import { AudioDirector, AudioMixSnapshot } from '@/cinematic/audio/AudioDirector'
import { getSceneRegistry } from '@/cinematic/director/SceneRegistry'
import {
  TimelineEngine,
  TimelineEvent,
  TimelineTickSnapshot,
} from '@/cinematic/director/TimelineEngine'
import { resolveLightingProfile } from '@/cinematic/environment/LightingDirector'
import { EmotionalScene, EmotionalState } from '@/cinematic/types'
import { HologramManager } from '@/cinematic/ui/HologramManager'
import { OverlaySequencer } from '@/cinematic/ui/OverlaySequencer'
import { SubtitleEngine, SubtitleTone } from '@/cinematic/ui/SubtitleEngine'
import { ChamberContentItem } from '@/store/chamberContentStore'

export interface CinematicDirectorSnapshot {
  emotion: EmotionalState
  cameraPresetId: EmotionalScene['cameraPresetId']
  lightingProfileId: EmotionalScene['lightingProfileId']
  atmosphereProfileId: EmotionalScene['atmosphereProfileId']
  avatarEmotionId: EmotionalScene['avatarEmotionId']
  activationBias: number
  subtitle: string
  subtitleTone: SubtitleTone
  bootLines: string[]
  holograms: ChamberContentItem[]
  splitPortraitVisible: boolean
  interactiveReady: boolean
  progress: number
  paused: boolean
  audioMix: AudioMixSnapshot
}

type DirectorListener = (snapshot: CinematicDirectorSnapshot) => void

function toneFromEmotion(state: EmotionalState): SubtitleTone {
  switch (state) {
    case 'DORMANT':
      return 'system'
    case 'AWARENESS':
      return 'presence'
    case 'MEMORY':
      return 'reflection'
    case 'VISION':
      return 'vision'
    case 'INVITATION':
      return 'invitation'
    default:
      return 'presence'
  }
}

function mapProgress(snapshot: TimelineTickSnapshot) {
  return snapshot.progress
}

export function createInitialCinematicSnapshot(): CinematicDirectorSnapshot {
  const firstScene = getSceneRegistry()[0]
  const lighting = resolveLightingProfile(firstScene.lightingProfileId)
  return {
    emotion: firstScene.id,
    cameraPresetId: firstScene.cameraPresetId,
    lightingProfileId: firstScene.lightingProfileId,
    atmosphereProfileId: firstScene.atmosphereProfileId,
    avatarEmotionId: firstScene.avatarEmotionId,
    activationBias: lighting.activationBias,
    subtitle: '',
    subtitleTone: 'system',
    bootLines: [],
    holograms: [],
    splitPortraitVisible: false,
    interactiveReady: false,
    progress: 0,
    paused: false,
    audioMix: { ambienceLevel: 0.22, droneLevel: 0.32, pulseLevel: 0.1 },
  }
}

export class CinematicDirector {
  private readonly timeline: TimelineEngine
  private readonly subtitleEngine = new SubtitleEngine()
  private readonly overlays = new OverlaySequencer()
  private readonly hologramManager = new HologramManager()
  private readonly audio = new AudioDirector()
  private readonly listeners = new Set<DirectorListener>()
  private snapshot: CinematicDirectorSnapshot = createInitialCinematicSnapshot()

  constructor() {
    this.timeline = new TimelineEngine(getSceneRegistry())
    this.timeline.subscribe((event) => this.onTimelineEvent(event))
  }

  subscribe(listener: DirectorListener) {
    this.listeners.add(listener)
    listener(this.snapshot)
    return () => {
      this.listeners.delete(listener)
    }
  }

  start() {
    this.timeline.start()
  }

  stop() {
    this.timeline.stop()
  }

  notifyVoiceActivity(active: boolean) {
    this.audio.setVoiceActive(active)
    if (active && !this.snapshot.interactiveReady) {
      this.timeline.skipToState('INVITATION')
      this.subtitleEngine.set('Voice channel engaged.', {
        tone: 'invitation',
        holdMs: 2400,
      })
      this.snapshot = {
        ...this.snapshot,
        interactiveReady: true,
      }
    }
    this.refreshSnapshot()
  }

  getSnapshot() {
    return this.snapshot
  }

  private onTimelineEvent(event: TimelineEvent) {
    switch (event.type) {
      case 'scene': {
        const lighting = resolveLightingProfile(event.scene.lightingProfileId)
        this.audio.setEmotion(event.scene.id)
        this.snapshot = {
          ...this.snapshot,
          emotion: event.scene.id,
          cameraPresetId: event.scene.cameraPresetId,
          lightingProfileId: event.scene.lightingProfileId,
          atmosphereProfileId: event.scene.atmosphereProfileId,
          avatarEmotionId: event.scene.avatarEmotionId,
          activationBias: lighting.activationBias,
          splitPortraitVisible: false,
          interactiveReady: this.snapshot.interactiveReady,
        }
        this.refreshSnapshot()
        break
      }
      case 'cue': {
        const cue = event.cue
        if (cue.kind === 'boot' && cue.text) {
          const nextBootLines = [...this.snapshot.bootLines, cue.text].slice(-3)
          this.snapshot = {
            ...this.snapshot,
            bootLines: nextBootLines,
          }
        }

        if (cue.kind === 'subtitle' && cue.text) {
          this.subtitleEngine.set(cue.text, {
            holdMs: cue.holdMs,
            tone: toneFromEmotion(event.scene.id),
            persistent: cue.id.startsWith('invitation-sub-2'),
          })
        }

        if (cue.payload?.cameraPresetId || cue.payload?.splitPortrait !== undefined) {
          this.snapshot = {
            ...this.snapshot,
            cameraPresetId: cue.payload?.cameraPresetId ?? this.snapshot.cameraPresetId,
            splitPortraitVisible:
              cue.payload?.splitPortrait ?? this.snapshot.splitPortraitVisible,
          }
        }

        if (
          (cue.kind === 'memory' || cue.kind === 'vision' || cue.kind === 'invitation') &&
          cue.payload?.label
        ) {
          this.overlays.add({
            id: cue.id,
            label: cue.payload.label,
            tone: cue.kind,
            anchor: cue.payload.anchor,
            mediaSrc: cue.payload.mediaSrc,
            ttlMs: cue.kind === 'invitation' ? 12000 : 7600,
          })
        }

        this.refreshSnapshot()
        break
      }
      case 'tick': {
        const subtitleChanged = this.subtitleEngine.tick(event.snapshot.deltaMs)
        const overlaysChanged = this.overlays.tick(event.snapshot.deltaMs)
        this.snapshot = {
          ...this.snapshot,
          progress: mapProgress(event.snapshot),
          paused: event.snapshot.paused,
        }
        if (subtitleChanged || overlaysChanged) {
          this.refreshSnapshot()
          return
        }
        if (event.snapshot.deltaMs > 0 && event.snapshot.totalElapsedMs % 600 < 18) {
          this.refreshSnapshot()
        }
        break
      }
      case 'complete': {
        if (!this.subtitleEngine.getFrame().text) {
          this.subtitleEngine.set("And when you're ready... let's talk.", {
            tone: 'invitation',
            persistent: true,
          })
        }
        this.snapshot = {
          ...this.snapshot,
          interactiveReady: true,
          progress: 1,
          paused: false,
        }
        this.refreshSnapshot()
        break
      }
    }
  }

  private refreshSnapshot() {
    const subtitleFrame = this.subtitleEngine.getFrame()
    const overlayList = this.overlays.getOverlays()
    this.snapshot = {
      ...this.snapshot,
      subtitle: subtitleFrame.text,
      subtitleTone: subtitleFrame.tone,
      holograms: this.hologramManager.toChamberItems(overlayList),
      audioMix: this.audio.getSnapshot(),
    }
    this.listeners.forEach((listener) => listener(this.snapshot))
  }
}

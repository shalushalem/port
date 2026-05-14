import { CinematicCue, EmotionalScene, EmotionalState } from '@/cinematic/types'

export interface TimelineTickSnapshot {
  state: EmotionalState
  sceneElapsedMs: number
  sceneDurationMs: number
  totalElapsedMs: number
  progress: number
  paused: boolean
  deltaMs: number
}

interface TimelineSceneEvent {
  type: 'scene'
  scene: EmotionalScene
}

interface TimelineCueEvent {
  type: 'cue'
  scene: EmotionalScene
  cue: CinematicCue
}

interface TimelineTickEvent {
  type: 'tick'
  scene: EmotionalScene
  snapshot: TimelineTickSnapshot
}

interface TimelineCompleteEvent {
  type: 'complete'
  snapshot: TimelineTickSnapshot
}

export type TimelineEvent =
  | TimelineSceneEvent
  | TimelineCueEvent
  | TimelineTickEvent
  | TimelineCompleteEvent

type TimelineListener = (event: TimelineEvent) => void

export class TimelineEngine {
  private readonly scenes: EmotionalScene[]
  private readonly listeners = new Set<TimelineListener>()
  private rafId: number | null = null
  private running = false
  private lastFrameMs = 0
  private pauseRemainingMs = 0

  private currentSceneIndex = 0
  private sceneElapsedMs = 0
  private totalElapsedMs = 0
  private firedCueIds = new Set<string>()

  constructor(scenes: EmotionalScene[]) {
    if (scenes.length === 0) {
      throw new Error('TimelineEngine requires at least one scene.')
    }
    this.scenes = scenes
  }

  subscribe(listener: TimelineListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  start() {
    this.stop()
    this.running = true
    this.lastFrameMs = 0
    this.pauseRemainingMs = 0
    this.currentSceneIndex = 0
    this.sceneElapsedMs = 0
    this.totalElapsedMs = 0
    this.firedCueIds = new Set<string>()
    this.emit({
      type: 'scene',
      scene: this.currentScene(),
    })
    this.queueFrame()
  }

  stop() {
    this.running = false
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  pause(ms: number) {
    this.pauseRemainingMs = Math.max(this.pauseRemainingMs, ms)
  }

  skipToState(state: EmotionalState) {
    const index = this.scenes.findIndex((scene) => scene.id === state)
    if (index < 0) return
    this.currentSceneIndex = index
    this.sceneElapsedMs = 0
    this.firedCueIds = new Set<string>()
    this.pauseRemainingMs = 0
    this.emit({
      type: 'scene',
      scene: this.currentScene(),
    })
  }

  private queueFrame() {
    this.rafId = window.requestAnimationFrame((nowMs) => this.onFrame(nowMs))
  }

  private onFrame(nowMs: number) {
    if (!this.running) return

    const deltaMs = this.lastFrameMs === 0 ? 0 : nowMs - this.lastFrameMs
    this.lastFrameMs = nowMs

    if (deltaMs > 0) {
      if (this.pauseRemainingMs > 0) {
        this.pauseRemainingMs = Math.max(0, this.pauseRemainingMs - deltaMs)
      } else {
        this.totalElapsedMs += deltaMs
        this.sceneElapsedMs += deltaMs
      }
    }

    let scene = this.currentScene()
    this.processCues(scene)

    while (this.sceneElapsedMs >= scene.durationMs) {
      const overflowMs = this.sceneElapsedMs - scene.durationMs
      if (!this.advanceScene()) {
        this.emit({
          type: 'complete',
          snapshot: this.createSnapshot(
            scene,
            deltaMs,
            this.pauseRemainingMs > 0,
            1,
          ),
        })
        this.stop()
        return
      }
      this.sceneElapsedMs = overflowMs
      scene = this.currentScene()
      this.processCues(scene)
    }

    this.emit({
      type: 'tick',
      scene,
      snapshot: this.createSnapshot(
        scene,
        deltaMs,
        this.pauseRemainingMs > 0,
        scene.durationMs > 0
          ? Math.min(1, this.sceneElapsedMs / scene.durationMs)
          : 1,
      ),
    })

    this.queueFrame()
  }

  private processCues(scene: EmotionalScene) {
    for (const cue of scene.cues) {
      if (cue.atMs > this.sceneElapsedMs) continue
      const eventId = `${scene.id}:${cue.id}`
      if (this.firedCueIds.has(eventId)) continue
      this.firedCueIds.add(eventId)
      this.emit({
        type: 'cue',
        scene,
        cue,
      })
    }
  }

  private advanceScene() {
    if (this.currentSceneIndex >= this.scenes.length - 1) {
      return false
    }
    this.currentSceneIndex += 1
    this.firedCueIds = new Set<string>()
    this.emit({
      type: 'scene',
      scene: this.currentScene(),
    })
    return true
  }

  private currentScene() {
    return this.scenes[this.currentSceneIndex]
  }

  private createSnapshot(
    scene: EmotionalScene,
    deltaMs: number,
    paused: boolean,
    progress: number,
  ): TimelineTickSnapshot {
    return {
      state: scene.id,
      sceneElapsedMs: this.sceneElapsedMs,
      sceneDurationMs: scene.durationMs,
      totalElapsedMs: this.totalElapsedMs,
      progress,
      paused,
      deltaMs,
    }
  }

  private emit(event: TimelineEvent) {
    this.listeners.forEach((listener) => listener(event))
  }
}

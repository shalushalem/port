import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  LoopRepeat,
  Object3D,
} from 'three'
import type { AvatarState } from '@/lib/constants'

const CLIP_HINTS: Record<AvatarState, RegExp[]> = {
  idle: [/idle/i, /breath/i, /default/i, /stand/i],
  listening: [/listen/i, /scan/i, /aware/i, /focus/i],
  thinking: [/think/i, /ponder/i, /analy/i, /inspect/i],
  talking: [/talk/i, /speak/i, /answer/i, /chat/i, /mouth/i],
}

const LOCOMOTION_OR_DANCE = /(walk|run|jog|sprint|hiphop|salsa|fight|rap)/i
const CALM_FALLBACK_PRIORITY = [
  /talk/i,
  /idle/i,
  /stand/i,
  /pose/i,
  /breathe/i,
  /house/i,
] as const

export interface PlayOptions {
  fadeDuration?: number
  timeScale?: number
  reset?: boolean
}

export class AnimationController {
  readonly mixer: AnimationMixer
  readonly clips: AnimationClip[]
  readonly actionMap: Map<string, AnimationAction>
  readonly clipNames: string[]

  private root: Object3D
  private currentActionName: string | null = null

  constructor(root: Object3D, clips: AnimationClip[]) {
    this.root = root
    this.mixer = new AnimationMixer(root)
    this.clips = clips
    this.actionMap = new Map<string, AnimationAction>()
    this.clipNames = clips.map((clip, index) =>
      clip.name && clip.name.trim().length > 0 ? clip.name : `clip_${index}`,
    )

    clips.forEach((clip, index) => {
      const actionName = this.clipNames[index]
      const action = this.mixer.clipAction(clip)
      action.enabled = true
      action.loop = LoopRepeat
      action.clampWhenFinished = false
      this.actionMap.set(actionName, action)
    })
  }

  update(delta: number) {
    this.mixer.update(delta)
  }

  getCurrentActionName() {
    return this.currentActionName
  }

  getIdleClipName() {
    return this.findBestClipByState('idle') ?? this.findCalmFallbackClip()
  }

  findBestClipByState(state: AvatarState): string | null {
    const hints = CLIP_HINTS[state]
    for (const hint of hints) {
      const found = this.clipNames.find((name) => {
        if (!hint.test(name)) return false
        if (state !== 'talking' && this.isLocomotionLike(name)) return false
        return true
      })
      if (found) return found
    }
    return null
  }

  isLocomotionLike(name: string) {
    return LOCOMOTION_OR_DANCE.test(name)
  }

  findCalmFallbackClip() {
    for (const pattern of CALM_FALLBACK_PRIORITY) {
      const byPriority = this.clipNames.find((name) => pattern.test(name))
      if (byPriority && !this.isLocomotionLike(byPriority)) {
        return byPriority
      }
    }

    const firstSafe = this.clipNames.find((name) => !this.isLocomotionLike(name))
    return firstSafe ?? null
  }

  play(name: string, options: PlayOptions = {}) {
    const nextAction = this.actionMap.get(name)
    if (!nextAction) return false

    const {
      fadeDuration = 0.45,
      timeScale = 1,
      reset = true,
    } = options

    if (this.currentActionName === name) {
      nextAction.timeScale = timeScale
      if (!nextAction.isRunning()) {
        nextAction.play()
      }
      return true
    }

    const previousAction = this.currentActionName
      ? this.actionMap.get(this.currentActionName)
      : null

    nextAction.enabled = true
    nextAction.timeScale = timeScale
    nextAction.setEffectiveWeight(1)
    if (reset) nextAction.reset()
    nextAction.play()

    if (previousAction) {
      previousAction.crossFadeTo(nextAction, fadeDuration, true)
    } else {
      nextAction.fadeIn(fadeDuration)
    }

    this.currentActionName = name
    return true
  }

  transitionToState(state: AvatarState, options: PlayOptions = {}) {
    const clipName = this.findBestClipByState(state) ?? this.getIdleClipName()

    if (!clipName) return null
    this.play(clipName, options)
    return clipName
  }

  stopAll() {
    this.actionMap.forEach((action) => action.stop())
    this.currentActionName = null
  }

  dispose() {
    this.stopAll()
    this.mixer.stopAllAction()
    this.mixer.uncacheRoot(this.root)
  }
}

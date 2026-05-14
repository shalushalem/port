export enum AvatarState {
  IDLE = 'idle',
  LISTENING = 'listening',
  THINKING = 'thinking',
  TALKING = 'talking',
  ERROR = 'error',
  SLEEPING = 'sleeping',
}

export type AvatarTransitionEvent =
  | 'boot'
  | 'startListening'
  | 'stopListening'
  | 'startThinking'
  | 'startTalking'
  | 'finishTalking'
  | 'error'
  | 'sleep'
  | 'wake'
  | 'reset'

const TRANSITIONS: Record<AvatarState, Partial<Record<AvatarTransitionEvent, AvatarState>>> = {
  [AvatarState.IDLE]: {
    boot: AvatarState.IDLE,
    startListening: AvatarState.LISTENING,
    startThinking: AvatarState.THINKING,
    startTalking: AvatarState.TALKING,
    error: AvatarState.ERROR,
    sleep: AvatarState.SLEEPING,
    reset: AvatarState.IDLE,
  },
  [AvatarState.LISTENING]: {
    stopListening: AvatarState.IDLE,
    startThinking: AvatarState.THINKING,
    error: AvatarState.ERROR,
    sleep: AvatarState.SLEEPING,
    reset: AvatarState.IDLE,
  },
  [AvatarState.THINKING]: {
    startTalking: AvatarState.TALKING,
    stopListening: AvatarState.IDLE,
    error: AvatarState.ERROR,
    reset: AvatarState.IDLE,
  },
  [AvatarState.TALKING]: {
    finishTalking: AvatarState.IDLE,
    startThinking: AvatarState.THINKING,
    error: AvatarState.ERROR,
    reset: AvatarState.IDLE,
  },
  [AvatarState.ERROR]: {
    reset: AvatarState.IDLE,
    wake: AvatarState.IDLE,
  },
  [AvatarState.SLEEPING]: {
    wake: AvatarState.IDLE,
    reset: AvatarState.IDLE,
  },
}

export function transitionAvatarState(
  current: AvatarState,
  event: AvatarTransitionEvent,
) {
  return TRANSITIONS[current][event] ?? current
}

export function canTransitionAvatarState(
  current: AvatarState,
  event: AvatarTransitionEvent,
) {
  return Boolean(TRANSITIONS[current][event])
}

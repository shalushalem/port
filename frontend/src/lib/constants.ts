export { AvatarState } from '@/systems/avatar/avatarStateMachine'
import { AvatarState } from '@/systems/avatar/avatarStateMachine'

export const ROBOT_MODEL_PATH = '/models/ash.glb'

export const INITIAL_SUBTITLE =
  'Hello, I am Shalem. Welcome to my digital consciousness.'

export const AVATAR_GLOW_BY_STATE: Record<AvatarState, number> = {
  [AvatarState.IDLE]: 0.55,
  [AvatarState.LISTENING]: 0.95,
  [AvatarState.THINKING]: 0.78,
  [AvatarState.TALKING]: 1,
  [AvatarState.ERROR]: 0.68,
  [AvatarState.SLEEPING]: 0.26,
}

export const STATE_LABELS: Record<AvatarState, string> = {
  [AvatarState.IDLE]: 'Idle',
  [AvatarState.LISTENING]: 'Listening',
  [AvatarState.THINKING]: 'Thinking',
  [AvatarState.TALKING]: 'Talking',
  [AvatarState.ERROR]: 'Error',
  [AvatarState.SLEEPING]: 'Sleeping',
}

export const SCENE_COLORS = {
  base: '#050816',
  deep: '#0b1120',
  cyan: '#00d9ff',
  softCyan: '#6ee7ff',
  violet: '#7c3aed',
}

export const CAMERA_DEFAULT = {
  position: [0, 1.24, 8.2] as [number, number, number],
  target: [0, 1.1, 0] as [number, number, number],
  fov: 33,
}

export const PARTICLE_COUNT = 82

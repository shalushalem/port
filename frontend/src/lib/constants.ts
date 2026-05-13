export type AvatarState = 'idle' | 'listening' | 'thinking' | 'talking'

export const ROBOT_MODEL_PATH = '/models/ash.glb'

export const INITIAL_SUBTITLE =
  'Hello, I am Shalem. Welcome to my digital consciousness.'

export const AVATAR_GLOW_BY_STATE: Record<AvatarState, number> = {
  idle: 0.55,
  listening: 0.95,
  thinking: 0.78,
  talking: 1,
}

export const STATE_LABELS: Record<AvatarState, string> = {
  idle: 'Idle',
  listening: 'Listening',
  thinking: 'Thinking',
  talking: 'Talking',
}

export const SCENE_COLORS = {
  base: '#050816',
  deep: '#0b1120',
  cyan: '#00d9ff',
  softCyan: '#6ee7ff',
  violet: '#7c3aed',
}

export const CAMERA_DEFAULT = {
  position: [0, 1.45, 4.9] as [number, number, number],
  target: [0, 1.2, 0] as [number, number, number],
  fov: 38,
}

export const PARTICLE_COUNT = 220

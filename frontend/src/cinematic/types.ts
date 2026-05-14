export type EmotionalState =
  | 'DORMANT'
  | 'AWARENESS'
  | 'CONNECTION'
  | 'MEMORY'
  | 'VISION'
  | 'INVITATION'

export type CameraPresetId =
  | 'deskPan'
  | 'dormant'
  | 'closeUp'
  | 'orbitLeft'
  | 'dramaticLowAngle'
  | 'memoryFocus'
  | 'overShoulder'
  | 'mediumShot'
  | 'awareness'
  | 'awarenessSplit'
  | 'skylineRise'
  | 'connection'
  | 'memory'
  | 'vision'
  | 'invitation'

export type LightingProfileId =
  | 'dormant'
  | 'awareness'
  | 'connection'
  | 'memory'
  | 'vision'
  | 'invitation'

export type AtmosphereProfileId =
  | 'dormant'
  | 'awareness'
  | 'connection'
  | 'memory'
  | 'vision'
  | 'invitation'

export type AvatarEmotionId =
  | 'dormant'
  | 'awareness'
  | 'connection'
  | 'memory'
  | 'vision'
  | 'invitation'

export type CinematicCueKind =
  | 'boot'
  | 'subtitle'
  | 'memory'
  | 'vision'
  | 'invitation'

export interface NormalizedAnchor {
  x: number
  y: number
}

export interface CinematicCuePayload {
  label?: string
  anchor?: NormalizedAnchor
  cameraPresetId?: CameraPresetId
  splitPortrait?: boolean
  mediaSrc?: string
}

export interface CinematicCue {
  id: string
  atMs: number
  kind: CinematicCueKind
  text?: string
  holdMs?: number
  payload?: CinematicCuePayload
}

export interface EmotionalScene {
  id: EmotionalState
  durationMs: number
  cameraPresetId: CameraPresetId
  lightingProfileId: LightingProfileId
  atmosphereProfileId: AtmosphereProfileId
  avatarEmotionId: AvatarEmotionId
  cues: CinematicCue[]
}

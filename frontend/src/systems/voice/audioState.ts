export enum VoicePipelineStage {
  IDLE = 'idle',
  LISTENING = 'listening',
  TRANSCRIBING = 'transcribing',
  THINKING = 'thinking',
  SYNTHESIZING = 'synthesizing',
  SPEAKING = 'speaking',
  ERROR = 'error',
}

export interface VoicePipelineState {
  stage: VoicePipelineStage
  transcript: string
  response: string
  error: string | null
}

export const INITIAL_VOICE_PIPELINE_STATE: VoicePipelineState = {
  stage: VoicePipelineStage.IDLE,
  transcript: '',
  response: '',
  error: null,
}

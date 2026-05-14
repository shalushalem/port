import { create } from 'zustand'
import {
  AVATAR_GLOW_BY_STATE,
  AvatarState,
  INITIAL_SUBTITLE,
} from '@/lib/constants'
import {
  AvatarTransitionEvent,
  transitionAvatarState,
} from '@/systems/avatar/avatarStateMachine'

interface AvatarStore {
  state: AvatarState
  glowIntensity: number
  subtitle: string
  commandInput: string
  isTyping: boolean
  isListening: boolean
  isSpeaking: boolean
  speechLevel: number
  activeClip: string | null

  setState: (next: AvatarState) => void
  transitionState: (event: AvatarTransitionEvent) => void
  setSubtitle: (text: string) => void
  setCommandInput: (text: string) => void
  setTyping: (typing: boolean) => void
  setListening: (listening: boolean) => void
  setSpeaking: (speaking: boolean) => void
  setSpeechLevel: (level: number) => void
  setActiveClip: (clip: string | null) => void
  resetToIdle: () => void
}

export const useAvatarStore = create<AvatarStore>((set) => ({
  state: AvatarState.IDLE,
  glowIntensity: AVATAR_GLOW_BY_STATE[AvatarState.IDLE],
  subtitle: INITIAL_SUBTITLE,
  commandInput: '',
  isTyping: false,
  isListening: false,
  isSpeaking: false,
  speechLevel: 0,
  activeClip: null,

  setState: (next) =>
    set({
      state: next,
      glowIntensity: AVATAR_GLOW_BY_STATE[next],
    }),

  transitionState: (event) =>
    set((current) => {
      const next = transitionAvatarState(current.state, event)
      return {
        state: next,
        glowIntensity: AVATAR_GLOW_BY_STATE[next],
      }
    }),

  setSubtitle: (text) => set({ subtitle: text }),
  setCommandInput: (text) => set({ commandInput: text }),
  setTyping: (typing) => set({ isTyping: typing }),
  setListening: (listening) => set({ isListening: listening }),
  setSpeaking: (speaking) => set({ isSpeaking: speaking }),
  setSpeechLevel: (level) => set({ speechLevel: Math.max(0, Math.min(1, level)) }),
  setActiveClip: (clip) => set({ activeClip: clip }),

  resetToIdle: () =>
    set({
      state: AvatarState.IDLE,
      glowIntensity: AVATAR_GLOW_BY_STATE[AvatarState.IDLE],
      isListening: false,
      isSpeaking: false,
      speechLevel: 0,
      isTyping: false,
    }),
}))

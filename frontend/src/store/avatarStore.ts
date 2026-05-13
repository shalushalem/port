import { create } from 'zustand'
import {
  AVATAR_GLOW_BY_STATE,
  AvatarState,
  INITIAL_SUBTITLE,
} from '@/lib/constants'

interface AvatarStore {
  state: AvatarState
  glowIntensity: number
  subtitle: string
  commandInput: string
  isTyping: boolean
  activeClip: string | null

  setState: (next: AvatarState) => void
  setSubtitle: (text: string) => void
  setCommandInput: (text: string) => void
  setTyping: (typing: boolean) => void
  setActiveClip: (clip: string | null) => void
  resetToIdle: () => void
}

export const useAvatarStore = create<AvatarStore>((set) => ({
  state: 'idle',
  glowIntensity: AVATAR_GLOW_BY_STATE.idle,
  subtitle: INITIAL_SUBTITLE,
  commandInput: '',
  isTyping: false,
  activeClip: null,

  setState: (next) =>
    set({
      state: next,
      glowIntensity: AVATAR_GLOW_BY_STATE[next],
    }),

  setSubtitle: (text) => set({ subtitle: text }),
  setCommandInput: (text) => set({ commandInput: text }),
  setTyping: (typing) => set({ isTyping: typing }),
  setActiveClip: (clip) => set({ activeClip: clip }),

  resetToIdle: () =>
    set({
      state: 'idle',
      glowIntensity: AVATAR_GLOW_BY_STATE.idle,
      isTyping: false,
    }),
}))

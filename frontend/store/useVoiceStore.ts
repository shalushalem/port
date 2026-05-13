import { create } from "zustand";

interface VoiceState {
  isListening: boolean;
  isThinking: boolean;
  transcript: string;
  aiSpeech: string;
  audioLevel: number;
  setListening: (value: boolean) => void;
  setThinking: (value: boolean) => void;
  setTranscript: (value: string) => void;
  setAiSpeech: (value: string) => void;
  setAudioLevel: (value: number) => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isListening: false,
  isThinking: false,
  transcript: "",
  aiSpeech: "",
  audioLevel: 0,
  setListening: (value) => set({ isListening: value }),
  setThinking: (value) => set({ isThinking: value }),
  setTranscript: (value) => set({ transcript: value }),
  setAiSpeech: (value) => set({ aiSpeech: value }),
  setAudioLevel: (value) => set({ audioLevel: value })
}));

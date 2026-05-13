import { create } from "zustand";
import { SceneName } from "@/lib/events";

type BootPhase = "boot" | "awakening" | "interactive";

interface SceneState {
  phase: BootPhase;
  scene: SceneName;
  theme: "neural" | "cyber" | "contact";
  subtitle: string;
  setPhase: (phase: BootPhase) => void;
  setScene: (scene: SceneName) => void;
  setTheme: (theme: "neural" | "cyber" | "contact") => void;
  setSubtitle: (subtitle: string) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  phase: "boot",
  scene: "intro",
  theme: "neural",
  subtitle: "Booting consciousness...",
  setPhase: (phase) => set({ phase }),
  setScene: (scene) => set({ scene }),
  setTheme: (theme) => set({ theme }),
  setSubtitle: (subtitle) => set({ subtitle })
}));

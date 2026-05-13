import { create } from "zustand";
import { CinematicEvent } from "@/lib/events";
import { useSceneStore } from "@/store/useSceneStore";

interface EventState {
  lastEvent?: CinematicEvent;
  highlightedProject?: string;
  contactVisible: boolean;
  avatarGlow: number;
  dispatchEvent: (event: CinematicEvent) => void;
  resetContact: () => void;
}

export const useEventStore = create<EventState>((set) => ({
  lastEvent: undefined,
  highlightedProject: undefined,
  contactVisible: false,
  avatarGlow: 0.35,
  dispatchEvent: (event) => {
    const sceneStore = useSceneStore.getState();
    switch (event.type) {
      case "HIGHLIGHT_PROJECT":
        sceneStore.setScene("projects");
        set({
          highlightedProject: String(event.payload?.project ?? "voice_os"),
          lastEvent: event
        });
        break;
      case "BACKGROUND_CHANGE": {
        const theme = String(event.payload?.theme ?? "neural");
        if (theme === "cyber" || theme === "contact" || theme === "neural") {
          sceneStore.setTheme(theme);
        }
        set({ lastEvent: event });
        break;
      }
      case "SCENE_TRANSITION": {
        const nextScene = String(event.payload?.scene ?? "intro");
        if (nextScene === "intro" || nextScene === "ai-room" || nextScene === "projects" || nextScene === "contact") {
          sceneStore.setScene(nextScene);
        }
        set({ lastEvent: event });
        break;
      }
      case "SUBTITLE":
        sceneStore.setSubtitle(String(event.payload?.text ?? ""));
        set({ lastEvent: event });
        break;
      case "CONTACT_INTENT":
        sceneStore.setScene("contact");
        sceneStore.setTheme("contact");
        set({ contactVisible: true, lastEvent: event });
        break;
      case "AVATAR_GLOW":
        set({ avatarGlow: Number(event.payload?.intensity ?? 0.6), lastEvent: event });
        break;
      case "SHOW_AVATAR":
      default:
        set({ lastEvent: event });
        break;
    }
  },
  resetContact: () => set({ contactVisible: false })
}));

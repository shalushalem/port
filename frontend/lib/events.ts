export type CinematicEventType =
  | "SHOW_AVATAR"
  | "AVATAR_GLOW"
  | "HIGHLIGHT_PROJECT"
  | "BACKGROUND_CHANGE"
  | "SCENE_TRANSITION"
  | "CONTACT_INTENT"
  | "SUBTITLE";

export interface CinematicEvent {
  type: CinematicEventType;
  payload?: Record<string, unknown>;
}

export type SceneName = "intro" | "ai-room" | "projects" | "contact";

export interface ConversationResponse {
  speech: string;
  events: CinematicEvent[];
  transcript?: string;
}

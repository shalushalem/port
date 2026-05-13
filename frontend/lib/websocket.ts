import { CinematicEvent } from "@/lib/events";

const WS_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace("http", "ws");

export function connectEventSocket(onEvent: (event: CinematicEvent) => void): WebSocket {
  const socket = new WebSocket(`${WS_BASE}/ws/events`);
  socket.onmessage = (message) => {
    try {
      const payload = JSON.parse(message.data) as { payload?: CinematicEvent };
      if (payload.payload) {
        onEvent(payload.payload);
      }
    } catch {
      // Ignore invalid packets.
    }
  };
  return socket;
}

import { ConversationResponse } from "@/lib/events";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function sendTextMessage(input: string, sessionId: string): Promise<ConversationResponse> {
  const response = await fetch(`${API_BASE}/api/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, session_id: sessionId })
  });
  if (!response.ok) {
    throw new Error("Failed to send message");
  }
  return response.json();
}

export async function uploadVoiceClip(blob: Blob, sessionId: string): Promise<{ file_url: string }> {
  const formData = new FormData();
  formData.append("file", blob, `idea-${Date.now()}.webm`);
  formData.append("session_id", sessionId);

  const response = await fetch(`${API_BASE}/api/voice/record`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    throw new Error("Failed to upload voice clip");
  }
  return response.json();
}

export async function transcribeVoiceClip(blob: Blob, sessionId: string): Promise<{ transcript: string }> {
  const formData = new FormData();
  formData.append("file", blob, `idea-${Date.now()}.webm`);
  formData.append("session_id", sessionId);

  const response = await fetch(`${API_BASE}/api/voice/transcribe`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    throw new Error("Failed to transcribe voice clip");
  }
  return response.json();
}

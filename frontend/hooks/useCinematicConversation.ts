"use client";

import { useMemo } from "react";
import { sendTextMessage, transcribeVoiceClip, uploadVoiceClip } from "@/lib/api";
import { useEventStore } from "@/store/useEventStore";
import { useSceneStore } from "@/store/useSceneStore";
import { useVoiceStore } from "@/store/useVoiceStore";

export function useCinematicConversation() {
  const dispatchEvent = useEventStore((state) => state.dispatchEvent);
  const setSubtitle = useSceneStore((state) => state.setSubtitle);
  const setThinking = useVoiceStore((state) => state.setThinking);
  const setTranscript = useVoiceStore((state) => state.setTranscript);
  const setAiSpeech = useVoiceStore((state) => state.setAiSpeech);

  const sessionId = useMemo(() => `sess_${crypto.randomUUID()}`, []);

  async function processTranscript(text: string) {
    setThinking(true);
    setTranscript(text);
    const response = await sendTextMessage(text, sessionId);
    setAiSpeech(response.speech);
    setSubtitle(response.speech);
    response.events.forEach(dispatchEvent);
    setThinking(false);
    return response;
  }

  async function processAudio(blob: Blob) {
    await uploadVoiceClip(blob, sessionId);
    const { transcript } = await transcribeVoiceClip(blob, sessionId);
    return processTranscript(transcript);
  }

  return {
    processTranscript,
    processAudio,
    sessionId
  };
}

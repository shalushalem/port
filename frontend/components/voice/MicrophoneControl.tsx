"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useVoiceStore } from "@/store/useVoiceStore";

interface MicrophoneControlProps {
  onAudio: (blob: Blob) => Promise<unknown>;
  onText: (text: string) => Promise<unknown>;
}

export default function MicrophoneControl({ onAudio, onText }: MicrophoneControlProps) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [prompt, setPrompt] = useState("");
  const setListening = useVoiceStore((state) => state.setListening);
  const setThinking = useVoiceStore((state) => state.setThinking);
  const isListening = useVoiceStore((state) => state.isListening);
  const isThinking = useVoiceStore((state) => state.isThinking);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setListening(false);
      setThinking(true);
      try {
        await onAudio(blob);
      } finally {
        setThinking(false);
      }
      stream.getTracks().forEach((track) => track.stop());
    };
    recorder.start();
    setListening(true);
  }

  async function toggleRecording() {
    if (!recorderRef.current || recorderRef.current.state === "inactive") {
      await startRecording();
      return;
    }
    recorderRef.current.stop();
  }

  async function submitText() {
    if (!prompt.trim() || isThinking) return;
    setThinking(true);
    try {
      await onText(prompt.trim());
      setPrompt("");
    } finally {
      setThinking(false);
    }
  }

  return (
    <section className="absolute left-1/2 top-6 z-40 w-[min(94vw,760px)] -translate-x-1/2">
      <div className="glass rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={toggleRecording}
            disabled={isThinking}
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-900 disabled:opacity-50"
          >
            {isListening ? "Stop Recording" : "Speak"}
          </motion.button>
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void submitText();
              }
            }}
            placeholder="Or type: show projects / who are you / I have an idea..."
            className="w-full rounded-xl border border-cyan-100/30 bg-black/20 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => void submitText()}
            disabled={isThinking}
            className="rounded-xl border border-cyan-100/40 px-4 py-3 text-cyan-100 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}

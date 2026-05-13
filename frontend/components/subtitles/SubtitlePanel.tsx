"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSceneStore } from "@/store/useSceneStore";
import { useVoiceStore } from "@/store/useVoiceStore";

export default function SubtitlePanel() {
  const subtitle = useSceneStore((state) => state.subtitle);
  const transcript = useVoiceStore((state) => state.transcript);

  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-40 w-[min(90vw,920px)] -translate-x-1/2">
      <AnimatePresence mode="wait">
        <motion.div
          key={subtitle}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="glass rounded-2xl px-5 py-4"
        >
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-100/80">Digital Consciousness</p>
          <p className="mt-2 text-xl leading-relaxed text-slate-100">{subtitle}</p>
          {transcript ? (
            <p className="mt-3 border-t border-white/10 pt-3 text-sm text-slate-300">
              You: <span className="text-slate-200">{transcript}</span>
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

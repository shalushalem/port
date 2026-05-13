"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEventStore } from "@/store/useEventStore";
import { useVoiceStore } from "@/store/useVoiceStore";

export default function AvatarLayer() {
  const avatarGlow = useEventStore((state) => state.avatarGlow);
  const isListening = useVoiceStore((state) => state.isListening);
  const isThinking = useVoiceStore((state) => state.isThinking);

  const intensity = isListening ? 1 : isThinking ? 0.75 : avatarGlow;

  return (
    <motion.div
      className="pointer-events-none absolute bottom-0 left-1/2 z-20 w-[min(74vw,560px)] -translate-x-1/2"
      animate={{
        y: [0, -8, 0],
        rotate: [-0.5, 0.6, -0.5]
      }}
      transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
      style={{
        filter: `drop-shadow(0 0 ${20 + intensity * 40}px rgba(46,242,255,${0.25 + intensity * 0.35}))`
      }}
    >
      <Image
        src="/assets/avatar/hero.png"
        alt="Shalem AI avatar"
        width={1024}
        height={1536}
        className="h-auto w-full object-contain"
        priority
      />
    </motion.div>
  );
}

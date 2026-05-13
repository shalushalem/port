"use client";

import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useEventStore } from "@/store/useEventStore";
import { useSceneStore } from "@/store/useSceneStore";

const projects = [
  {
    id: "comic_ai",
    title: "AI Comic Generator",
    text: "Prompt-driven story to comic pipeline with style continuity."
  },
  {
    id: "voice_os",
    title: "Voice Portfolio OS",
    text: "Realtime cinematic interface controlled through speech."
  },
  {
    id: "idea_engine",
    title: "Idea Analyzer",
    text: "Captures startup voice pitches and returns actionable plans."
  }
];

export default function ProjectHolograms() {
  const scene = useSceneStore((state) => state.scene);
  const highlightedProject = useEventStore((state) => state.highlightedProject);

  if (scene !== "projects") return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        className="absolute right-5 top-20 z-30 w-[min(92vw,420px)] space-y-3"
      >
        {projects.map((project) => (
          <article
            key={project.id}
            className={clsx(
              "glass rounded-xl p-4 transition-all",
              project.id === highlightedProject && "border-cyan-300 shadow-glow"
            )}
          >
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="mt-1 text-sm text-slate-300">{project.text}</p>
          </article>
        ))}
      </motion.aside>
    </AnimatePresence>
  );
}

"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import AvatarLayer from "@/components/avatar/AvatarLayer";
import BackgroundAtmosphere from "@/components/cinematic/BackgroundAtmosphere";
import ProjectHolograms from "@/components/projects/ProjectHolograms";
import SubtitlePanel from "@/components/subtitles/SubtitlePanel";
import MicrophoneControl from "@/components/voice/MicrophoneControl";
import ContactOverlay from "@/components/ui/ContactOverlay";
import { useCinematicConversation } from "@/hooks/useCinematicConversation";
import { useEventStore } from "@/store/useEventStore";
import { useSceneStore } from "@/store/useSceneStore";
import { useVoiceStore } from "@/store/useVoiceStore";

const BrainStage = dynamic(() => import("@/components/cinematic/BrainStage"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-void" />
});

export default function CinematicExperience() {
  const phase = useSceneStore((state) => state.phase);
  const setPhase = useSceneStore((state) => state.setPhase);
  const setSubtitle = useSceneStore((state) => state.setSubtitle);
  const setScene = useSceneStore((state) => state.setScene);
  const setTheme = useSceneStore((state) => state.setTheme);
  const setAiSpeech = useVoiceStore((state) => state.setAiSpeech);
  const dispatchEvent = useEventStore((state) => state.dispatchEvent);
  const { processAudio, processTranscript } = useCinematicConversation();

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setPhase("awakening");
      setSubtitle("Neural field initializing...");
    }, 700);

    const introTimer = setTimeout(() => {
      setPhase("interactive");
      setScene("intro");
      setTheme("neural");
      const opening =
        "Hello... I am Shalem. Welcome to my digital consciousness. You can ask me about my projects, ideas, or collaboration.";
      setAiSpeech(opening);
      setSubtitle(opening);
      dispatchEvent({ type: "SHOW_AVATAR" });
      dispatchEvent({ type: "AVATAR_GLOW", payload: { intensity: 0.55 } });
    }, 2600);

    return () => {
      clearTimeout(bootTimer);
      clearTimeout(introTimer);
    };
  }, [dispatchEvent, setAiSpeech, setPhase, setScene, setSubtitle, setTheme]);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <BackgroundAtmosphere />

      <AnimatePresence>
        {phase !== "boot" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <BrainStage />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "interactive" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
            <MicrophoneControl onAudio={processAudio} onText={processTranscript} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ProjectHolograms />
      <ContactOverlay />
      <AvatarLayer />
      <SubtitlePanel />
    </main>
  );
}

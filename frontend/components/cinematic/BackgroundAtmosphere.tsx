"use client";

import { motion } from "framer-motion";
import { useSceneStore } from "@/store/useSceneStore";

const themeMap: Record<string, string> = {
  neural: "radial-gradient(circle at 30% 20%, #113857 0%, #050914 45%, #040610 100%)",
  cyber: "radial-gradient(circle at 70% 10%, #2c1f59 0%, #071530 45%, #02040b 100%)",
  contact: "radial-gradient(circle at 50% 30%, #1b4a40 0%, #061218 55%, #03060a 100%)"
};

export default function BackgroundAtmosphere() {
  const theme = useSceneStore((state) => state.theme);

  return (
    <motion.div
      className="absolute inset-0"
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ background: themeMap[theme] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(69,232,255,0.22),transparent_56%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(120,255,217,0.18),transparent_34%)]" />
    </motion.div>
  );
}

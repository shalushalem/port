"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEventStore } from "@/store/useEventStore";

export default function ContactOverlay() {
  const visible = useEventStore((state) => state.contactVisible);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="glass absolute left-1/2 top-20 z-50 w-[min(92vw,560px)] -translate-x-1/2 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-semibold text-gradient">Let&apos;s Build Together</h2>
          <p className="mt-3 text-slate-200">
            I&apos;d love to discuss your idea in detail. Drop a mail or schedule an appointment.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="mailto:shalem@example.com?subject=Project%20Discussion"
              className="rounded-lg bg-cyan-400 px-4 py-2 font-medium text-slate-900"
            >
              Mail: shalem@example.com
            </a>
            <a
              href="https://calendly.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-cyan-200/60 px-4 py-2 text-cyan-100"
            >
              Book Appointment
            </a>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

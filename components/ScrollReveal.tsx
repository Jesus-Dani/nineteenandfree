"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Shared, reusable scroll-trigger fade/slide-in (Design doc Section 6 / TRD Section 6).
 * Gentle only — no bounce, no wobble, no attention-grabbing motion.
 */
export function ScrollReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

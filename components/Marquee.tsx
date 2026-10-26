"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/content";

function Row({ words, reverse, tone }: { words: string[]; reverse?: boolean; tone: "naranja" | "tinta" }) {
  const items = [...words, ...words];
  const text = tone === "naranja" ? "text-tinta" : "text-white";
  const sep = tone === "naranja" ? "#111111" : "#FF4F00";
  return (
    <div className={`flex overflow-hidden ${tone === "naranja" ? "bg-naranja" : "bg-tinta"}`}>
      <motion.div
        className="flex flex-none items-center gap-8 py-4 pr-8 md:gap-12 md:py-6 md:pr-12"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex flex-none items-center gap-8 md:gap-12" aria-hidden={copy === 1}>
            {items.map((w, i) => (
              <span key={`${copy}-${i}`} className="flex flex-none items-center gap-8 md:gap-12">
                <span className={`whitespace-nowrap text-[2rem] font-bold leading-none tracking-[-0.03em] md:text-[4.5rem] ${text}`}>{w}</span>
                <svg aria-hidden="true" viewBox="0 0 44 24" className="h-6 w-auto flex-none md:h-10">
                  <polyline points="0,12 12,12 16,3 21,21 26,8 29,12 44,12" fill="none" stroke={sep} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** Dos bandas cruzadas que se mueven en sentidos opuestos. */
export function Marquee() {
  return (
    <section aria-label="Lo que hacemos" className="relative overflow-hidden bg-white py-10 md:py-16">
      <p className="sr-only">{site.marquee.join(", ")}</p>
      <div className="relative z-10 -mx-8 -rotate-2">
        <Row words={site.marquee} tone="naranja" />
      </div>
      <div className="relative -mx-8 mt-3 rotate-[1.5deg] md:mt-4">
        <Row words={site.marqueeAlt} tone="tinta" reverse />
      </div>
    </section>
  );
}

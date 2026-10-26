"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";
import { Reveal } from "./ui/Reveal";
import { site } from "@/lib/content";

const { about } = site;

export function About() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="dot-grid-dark scroll-mt-20 bg-papel py-20 md:py-32">
      <div className="container-page flex flex-col gap-16 md:gap-24">
        <SectionHeader id="nosotros-title" eyebrow={about.eyebrow} title={about.title} />

        <ScrollText text={about.statement} />

        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <Reveal className="flex max-w-prose flex-col gap-5 text-lead text-gris-700">
            {about.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>

          <ol className="grid gap-4 sm:grid-cols-3">
            {about.principles.map((pr, i) => (
              <li key={pr.n}>
                <Reveal delay={0.1 * i} className="group flex h-full flex-col gap-6 rounded bg-white p-5 transition-colors duration-300 hover:bg-tinta hover:text-white">
                  <span className="text-outline text-[4rem] font-bold leading-none tracking-[-0.05em] text-naranja-texto transition-colors group-hover:text-naranja">
                    {pr.n}
                  </span>
                  <div className="mt-auto flex flex-col gap-1">
                    <span className="font-bold">{pr.title}</span>
                    <span className="text-[15px] leading-[1.5] text-gris-700 transition-colors group-hover:text-white/75">{pr.text}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Texto grande que se "enciende" palabra por palabra al scrollear. */
function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="max-w-[24ch] text-statement" aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const highlight = /reales|limpio|precisión/i.test(children);
  return (
    <span aria-hidden="true" className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }} className={highlight ? "text-naranja-texto" : ""}>
        {children}
      </motion.span>
    </span>
  );
}

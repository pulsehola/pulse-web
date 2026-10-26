"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/Button";
import { pulsePath } from "./fx/pulse";
import { site } from "@/lib/content";

const { hero } = site;
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (reduce) videoRef.current?.pause();
  }, [reduce]);

  const words = hero.title.split(" ");
  const last = words.length - 1;

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-tinta text-white"
    >
      {/* Fondo: video si existe; si no, monitor de pulso */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {hero.video.enabled && (
          <>
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay={!reduce} muted loop playsInline preload="metadata" poster={hero.video.poster}>
              <source src={hero.video.webm} type="video/webm" />
              <source src={hero.video.mp4} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-tinta/60" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-tinta to-transparent" />
          </>
        )}
        <div className="dot-grid absolute inset-0" />
        <PulseMonitor />
      </div>

      <motion.div style={{ y: yText, opacity: fade }} className="container-page flex flex-1 flex-col justify-end gap-8 pb-28 pt-32 md:pb-36">
        <motion.span
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="flex items-center gap-3 font-mono text-label font-medium uppercase text-naranja"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-sm bg-naranja opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-sm bg-naranja" />
          </span>
          {hero.eyebrow}
        </motion.span>

        <h1 id="hero-title" className="text-hero max-w-[15ch]">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className={`relative inline-block ${i === last ? "px-[0.08em] text-tinta" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.06 }}
              >
                {i === last && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 origin-left bg-naranja"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, ease, delay: 0.25 + last * 0.06 }}
                  />
                )}
                {w}
              </motion.span>
              {i < last && " "}
            </span>
          ))}
        </h1>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.9 }}
            className="max-w-[34ch] text-lg leading-[1.55] text-white/80 md:text-xl"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 1.05 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} variant="secondary-dark">
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <MetaBar />
    </section>
  );
}

/** Línea de pulso tipo monitor: trazo tenue fijo + un tramo brillante que la recorre. */
function PulseMonitor() {
  const d = pulsePath(1600, 330, 150, 4, 120);
  return (
    <svg className="absolute inset-x-0 top-[10%] h-[60%] w-full" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMid slice">
      <motion.path
        d={d}
        fill="none"
        stroke="#FF4F00"
        strokeOpacity="0.16"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.path
        d={d}
        pathLength={1}
        fill="none"
        stroke="#FF4F00"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="0.14 2"
        initial={{ strokeDashoffset: 0.14 }}
        animate={{ strokeDashoffset: -1 }}
        transition={{ duration: 4.2, ease: "linear", repeat: Infinity, delay: 1.4 }}
      />
    </svg>
  );
}

/** Franja inferior con datos vivos: ubicación, hora en Barcelona e indicador de scroll. */
function MetaBar() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Madrid" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-white/15">
      <div className="container-page flex h-14 items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.08em] text-gris-300">
        <span className="hidden sm:inline">{hero.meta.location}</span>
        <span className="tabular-nums">BCN {time || "--:--:--"}</span>
        <span className="hidden md:inline">{hero.meta.status}</span>
        <a href="#servicios" className="flex items-center gap-2 text-white">
          {hero.meta.scroll}
          <span className="relative block h-5 w-[1.5px] overflow-hidden bg-white/25">
            <motion.span
              className="absolute inset-x-0 top-0 h-2 bg-naranja"
              animate={{ y: [-8, 20] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </a>
      </div>
    </div>
  );
}

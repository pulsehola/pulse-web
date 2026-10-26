"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { pulsePath } from "./fx/pulse";

/** Ilustración animada para cada servicio. Todo construido con formas de la marca, sin imágenes. */
export function ServiceVisual({ id }: { id: string }) {
  switch (id) {
    case "web":
      return <WebVisual />;
    case "pwa":
      return <PwaVisual />;
    case "rrss":
      return <RrssVisual />;
    default:
      return <UxVisual />;
  }
}

const ease = [0.22, 1, 0.36, 1] as const;

function Frame({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded p-6 md:p-10 ${dark ? "bg-tinta dot-grid" : "bg-papel dot-grid-dark"}`}>
      {children}
    </div>
  );
}

/* ---------- Web: ventana de navegador que se construye ---------- */
function WebVisual() {
  const blocks = [
    "col-span-6 h-10 bg-tinta",
    "col-span-4 h-24 bg-naranja",
    "col-span-2 h-24 bg-gris-200",
    "col-span-2 h-14 bg-white border-regla border-tinta",
    "col-span-2 h-14 bg-white border-regla border-tinta",
    "col-span-2 h-14 bg-white border-regla border-tinta",
  ];
  return (
    <Frame>
      <div className="w-full max-w-[420px] overflow-hidden rounded border-regla border-tinta bg-white">
        <div className="flex items-center gap-2 border-b-regla border-tinta px-3 py-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-sm border-regla border-tinta" />
          ))}
          <span className="ml-2 flex-1 truncate rounded-sm bg-papel px-2 py-1 font-mono text-[11px] text-gris-500">tumarca.com</span>
        </div>
        <motion.div className="h-[3px] origin-left bg-naranja" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease }} />
        <div className="grid grid-cols-6 gap-2 p-3">
          {blocks.map((b, i) => (
            <motion.span
              key={i}
              className={`${b} rounded-sm`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.5 + i * 0.08 }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-gris-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.06em] text-gris-500">
          <span>Next.js · Headless CMS</span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-tinta">
            SEO ✓
          </motion.span>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- PWA: móvil con push, modo sin conexión e instalación ---------- */
function PwaVisual() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 3), 2600);
    return () => clearInterval(id);
  }, []);

  const rows = ["Pilates Reformer · 9:00", "Yoga suave · 11:30", "Funcional · 18:00", "Stretching · 19:30"];

  return (
    <Frame dark>
      <div className="flex flex-col items-center gap-4">
      <div className="relative h-[320px] w-[176px] rounded-[28px] border-[6px] border-white/90 bg-white md:h-[380px] md:w-[200px]">
        <div className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-tinta" />
        <div className="flex h-full flex-col gap-2 overflow-hidden rounded-[20px] px-3 pb-3 pt-9">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-tinta">Mis clases</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={step === 1 ? "off" : "on"}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className={`rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase ${step === 1 ? "bg-tinta text-white" : "bg-papel text-gris-700"}`}
              >
                {step === 1 ? "Sin conexión ✓" : "En línea"}
              </motion.span>
            </AnimatePresence>
          </div>
          {rows.map((r, i) => (
            <motion.div
              key={r}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08, ease }}
              className={`flex items-center justify-between rounded-sm px-2 py-2 text-[11px] font-semibold ${i === 0 ? "bg-naranja text-tinta" : "bg-papel text-tinta"}`}
            >
              {r}
              <span className="font-mono text-[9px]">{i === 0 ? "RESERVADA" : "+"}</span>
            </motion.div>
          ))}
          <div className="mt-auto">
            <AnimatePresence>
              {step === 2 && (
                <motion.div
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 60, opacity: 0 }}
                  transition={{ ease }}
                  className="flex items-center justify-between rounded-sm bg-tinta px-2 py-2 text-[10px] font-semibold text-white"
                >
                  Instalar la app
                  <span className="rounded-sm bg-naranja px-1.5 py-0.5 text-tinta">Añadir</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {step === 0 && (
            <motion.div
              initial={{ y: -40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="absolute -left-10 top-6 flex w-[230px] items-start gap-2 rounded bg-white p-2.5 shadow-[0_0_0_1.5px_#111111] md:-left-14"
            >
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-sm bg-tinta">
                <svg viewBox="0 0 44 24" className="h-3 w-auto" aria-hidden="true">
                  <polyline points="0,12 12,12 16,3 21,21 26,8 29,12 44,12" fill="none" stroke="#FF4F00" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </span>
              <span className="flex flex-col">
                <span className="text-[11px] font-bold text-tinta">Recordatorio</span>
                <span className="text-[11px] leading-tight text-gris-700">Mañana 9:00 · Pilates Reformer</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-gris-300">
        {["Push", "Offline", "Instalable"].map((t, i) => (
          <span key={t} className={`rounded-sm border px-2 py-1 transition-colors ${i === step ? "border-naranja text-naranja" : "border-white/20"}`}>
            {t}
          </span>
        ))}
      </div>
      </div>
    </Frame>
  );
}

/* ---------- RRSS: abanico de posts 4:5 ---------- */
function RrssVisual() {
  const cards = [
    { r: -12, x: -110, cls: "bg-tinta text-white", body: <span className="text-[34px] font-bold leading-none tracking-[-0.04em]">1/6</span> },
    { r: 0, x: 0, cls: "bg-naranja text-tinta", body: <span className="text-[22px] font-bold leading-[1] tracking-[-0.03em]">Tu marca, reconocible en el feed.</span> },
    { r: 12, x: 110, cls: "bg-white text-tinta border-regla border-tinta", body: <MiniPulse /> },
  ];
  return (
    <Frame>
      <div className="relative h-[260px] w-full max-w-[420px]">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            className={`absolute left-1/2 top-1/2 flex h-[220px] w-[176px] -ml-[88px] -mt-[110px] flex-col justify-between rounded p-4 ${c.cls}`}
            initial={{ rotate: 0, x: 0, opacity: 0 }}
            animate={{ rotate: c.r, x: c.x, opacity: 1 }}
            whileHover={{ y: -16, rotate: 0, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.08 }}
            style={{ zIndex: i === 1 ? 3 : 1 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] opacity-70">@tumarca</span>
            {c.body}
          </motion.div>
        ))}
      </div>
    </Frame>
  );
}

function MiniPulse() {
  return (
    <svg viewBox="0 0 160 80" className="w-full" aria-hidden="true">
      <motion.path
        d={pulsePath(160, 50, 30, 1, 20)}
        fill="none"
        stroke="#FF4F00"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      />
    </svg>
  );
}

/* ---------- UX/UI: de wireframe a interfaz, con un cursor que prueba el prototipo ---------- */
function UxVisual() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setDone((d) => !d), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <Frame>
      <div className="relative w-full max-w-[380px]">
        <div className="flex flex-col gap-3 rounded bg-white p-5 shadow-[0_0_0_1.5px_#111111]">
          <motion.span animate={{ backgroundColor: done ? "#111111" : "#D0D0D0" }} className="h-5 w-3/4 rounded-sm" />
          <motion.span animate={{ backgroundColor: done ? "#3D3D3D" : "#E4E4E2" }} className="h-3 w-full rounded-sm" />
          <motion.span animate={{ backgroundColor: done ? "#3D3D3D" : "#E4E4E2" }} className="h-3 w-5/6 rounded-sm" />
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ borderStyle: done ? "solid" : "dashed", backgroundColor: done && i === 1 ? "#FF4F00" : "#FFFFFF" }}
                className="h-14 rounded-sm border-[1.5px] border-tinta"
              />
            ))}
          </div>
          <motion.span
            animate={{ backgroundColor: done ? "#FF4F00" : "#FFFFFF", scale: done ? [1, 0.94, 1] : 1 }}
            transition={{ duration: 0.4 }}
            className="mt-2 flex h-10 items-center justify-center rounded-sm border-[1.5px] border-tinta font-mono text-[11px] uppercase tracking-[0.08em] text-tinta"
          >
            {done ? "Reservar ✓" : "[ Botón ]"}
          </motion.span>
        </div>
        <motion.div
          aria-hidden="true"
          className="absolute h-4 w-4 rounded-sm bg-tinta"
          animate={{ left: done ? "48%" : "88%", top: done ? "86%" : "8%", rotate: done ? 45 : 0 }}
          transition={{ duration: 0.9, ease }}
        />
        <span className="absolute -top-7 left-0 font-mono text-[11px] uppercase tracking-[0.08em] text-gris-500">
          {done ? "Prototipo · UI" : "Wireframe"}
        </span>
      </div>
    </Frame>
  );
}

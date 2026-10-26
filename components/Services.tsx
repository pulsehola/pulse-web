"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";
import { ServiceVisual } from "./ServiceVisuals";
import { site } from "@/lib/content";

const { services } = site;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Lista interactiva: cada servicio es una fila grande. Al abrirla (click o hover en escritorio)
 * el panel de la izquierda muestra su ilustración animada.
 */
export function Services() {
  const [active, setActive] = useState(1); // abre con PWA, el servicio destacado
  const current = services.items[active];

  return (
    <section id="servicios" aria-labelledby="servicios-title" className="scroll-mt-20 py-20 md:py-32">
      <div className="container-page flex flex-col gap-14 md:gap-20">
        <SectionHeader id="servicios-title" eyebrow={services.eyebrow} title={services.title} lead={services.lead} />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Panel visual fijo (solo escritorio) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-4">
              <div className="relative aspect-[4/3.4] w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                    animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                    exit={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
                    transition={{ duration: 0.55, ease }}
                  >
                    <ServiceVisual id={current.id} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.08em] text-gris-500">
                <span>
                  <span className="text-tinta">{current.number}</span> / 0{services.items.length}
                </span>
                <span>{current.title}</span>
              </div>
            </div>
          </div>

          {/* Lista */}
          <ul className="flex flex-col border-b-regla border-tinta">
            {services.items.map((s, i) => {
              const open = i === active;
              return (
                <li key={s.id} className="border-t-regla border-tinta" onMouseEnter={() => window.matchMedia("(min-width: 1024px)").matches && setActive(i)}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`svc-${s.id}`}
                      onClick={() => setActive(i)}
                      className="group relative flex w-full items-start gap-4 overflow-hidden py-6 text-left md:gap-6 md:py-8"
                    >
                      <span className={`pt-2 font-mono text-label font-medium transition-colors ${open ? "text-naranja-texto" : "text-gris-500"}`}>{s.number}</span>
                      <span
                        className={`flex-1 text-[clamp(1.6rem,3.6vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.035em] transition-transform duration-500 ${
                          open ? "translate-x-0" : "group-hover:translate-x-2"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded transition-colors duration-300 ${
                          open ? "bg-naranja text-tinta" : "bg-papel text-tinta group-hover:bg-tinta group-hover:text-white"
                        }`}
                      >
                        <motion.svg viewBox="0 0 24 24" className="h-5 w-5" animate={{ rotate: open ? 45 : 0 }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </motion.svg>
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`svc-${s.id}`}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-6 pb-8 md:pl-12">
                          <div className="aspect-[4/3.4] w-full lg:hidden">
                            <ServiceVisual id={s.id} />
                          </div>
                          <p className="max-w-lead text-lead text-gris-700">{s.summary}</p>
                          <ul className={`grid gap-2 ${s.points.length > 3 ? "sm:grid-cols-2" : ""}`}>
                            {s.points.map((p, j) => (
                              <motion.li
                                key={p}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + j * 0.05, ease }}
                                className="flex gap-3 rounded bg-papel px-4 py-3 text-[15px] leading-[1.45]"
                              >
                                <span aria-hidden="true" className="mt-[7px] h-2 w-2 flex-none rounded-sm bg-naranja" />
                                {p}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

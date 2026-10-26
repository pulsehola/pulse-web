"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";
import { pulsePath } from "./fx/pulse";
import { site, type Project } from "@/lib/content";

const { projects } = site;
const ease = [0.22, 1, 0.36, 1] as const;

export function Projects() {
  const [filter, setFilter] = useState<string>("all");
  const visible = projects.items.filter((p) => filter === "all" || p.category === filter);

  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="scroll-mt-20 py-20 md:py-32">
      <div className="container-page flex flex-col gap-10 md:gap-14">
        <SectionHeader id="proyectos-title" eyebrow={projects.eyebrow} title={projects.title} lead={projects.lead} />

        <LayoutGroup>
          <div role="group" aria-label="Filtrar proyectos" className="-mx-6 flex gap-1 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0">
            {projects.filters.map((f) => {
              const active = filter === f.id;
              const count = f.id === "all" ? projects.items.length : projects.items.filter((p) => p.category === f.id).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={`relative flex min-h-[44px] flex-none items-center gap-2 rounded px-5 text-[15px] font-semibold transition-colors ${active ? "text-white" : "text-tinta hover:bg-papel"}`}
                >
                  {active && <motion.span layoutId="filter-pill" className="absolute inset-0 -z-0 rounded bg-tinta" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className="relative">{f.label}</span>
                  <span className={`relative font-mono text-[11px] ${active ? "text-naranja" : "text-gris-500"}`}>{String(count).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>

          <p className="sr-only" aria-live="polite">
            {visible.length} proyectos visibles
          </p>

          <motion.ul layout className="grid auto-rows-[minmax(0,auto)] gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, ease }}
                  className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}
                >
                  <ProjectCard project={p} big={i === 0} index={i} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, big, index }: { project: Project; big: boolean; index: number }) {
  const label = projects.filters.find((f) => f.id === p.category)?.label;
  return (
    // Cuando haya casos reales, convertir en <Link href={`/proyectos/${p.id}`}>.
    <article className="group flex h-full flex-col gap-4" data-cursor="Ver">
      <div className={`relative overflow-hidden rounded ${big ? "aspect-[4/3] lg:aspect-auto lg:flex-1" : "aspect-[4/3]"}`}>
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          {p.image ? (
            <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
          ) : (
            <PlaceholderArt category={p.category} variant={index} />
          )}
        </div>
        <span className="absolute left-3 top-3 rounded-sm bg-white px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-tinta">{label}</span>
        {!p.image && (
          <span className="absolute right-3 top-3 rounded-sm bg-tinta px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white">Ejemplo</span>
        )}
        {/* Barra que sube en hover */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-naranja px-4 py-3 text-[15px] font-semibold text-tinta transition-transform duration-300 ease-out group-hover:translate-y-0">
          Ver caso <span aria-hidden="true">→</span>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className={`font-bold leading-tight tracking-[-0.02em] ${big ? "text-[clamp(1.4rem,2.4vw,2rem)]" : "text-[19px]"}`}>{p.title}</h3>
          <span className="text-[15px] text-gris-700">{p.client}</span>
        </div>
        <span className="flex flex-col items-end gap-1 font-mono text-[12px] text-gris-500">
          {p.year}
          <span className="hidden sm:inline">{p.tags.join(" · ")}</span>
        </span>
      </div>
    </article>
  );
}

/** Composición abstracta de marca mientras no hay imagen real. */
function PlaceholderArt({ category, variant }: { category: Project["category"]; variant: number }) {
  if (category === "pwa") {
    return (
      <div className="dot-grid flex h-full w-full items-center justify-center bg-tinta">
        <div className="flex h-[70%] aspect-[9/18] flex-col gap-1.5 rounded-[18px] border-[4px] border-white/80 bg-white p-2 pt-5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-[14%] rounded-sm ${i === variant % 4 ? "bg-naranja" : "bg-papel"}`} />
          ))}
        </div>
      </div>
    );
  }
  if (category === "rrss") {
    return (
      <div className="grid h-full w-full grid-cols-3 gap-1 bg-naranja p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className={`rounded-sm ${(i + variant) % 3 === 0 ? "bg-tinta" : (i + variant) % 3 === 1 ? "bg-white" : "bg-naranja ring-[1.5px] ring-inset ring-tinta"}`} />
        ))}
      </div>
    );
  }
  return (
    <div className="dot-grid-dark flex h-full w-full flex-col bg-papel p-5">
      <div className="flex flex-1 flex-col overflow-hidden rounded border-regla border-tinta bg-white">
        <div className="flex gap-1.5 border-b-regla border-tinta px-2 py-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-sm border border-tinta" />
          ))}
        </div>
        <svg viewBox="0 0 400 200" className="w-full flex-1" preserveAspectRatio="none" aria-hidden="true">
          <path d={pulsePath(400, 110, 60, 2, 40)} fill="none" stroke="#FF4F00" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}

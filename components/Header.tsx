"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { site } from "@/lib/content";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Sobre el hero oscuro el header es transparente; al scrollear pasa a blanco.
  const dark = !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        dark ? "bg-transparent on-dark" : "bg-white/95 backdrop-blur border-b border-gris-200"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="PULSE, ir al inicio" onClick={() => setOpen(false)}>
          <Logo tone={dark ? "dark" : "light"} className="h-5 w-auto md:h-6" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-[15px] font-semibold transition-colors ${
                dark ? "text-white/80 hover:text-white" : "text-gris-700 hover:text-tinta"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="inline-flex min-h-[44px] items-center rounded border-regla border-naranja bg-naranja px-5 text-[15px] font-semibold text-tinta transition-colors hover:border-tinta hover:bg-tinta hover:text-white"
          >
            {site.navCta}
          </a>
        </nav>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`absolute h-[1.5px] w-6 transition-transform duration-300 ${dark ? "bg-white" : "bg-tinta"} ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
          <span className={`absolute h-[1.5px] w-6 transition-transform duration-300 ${dark ? "bg-white" : "bg-tinta"} ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-movil"
            aria-label="Menú móvil"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-white md:hidden"
          >
            <ul className="container-page flex flex-col pt-6">
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                  className="border-b border-gris-200"
                >
                  <a href={item.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-5 text-h2">
                    <span className="font-mono text-label text-naranja-texto">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Cursor propio: un cuadrado naranja (la marca es cuadrada, no hay círculos).
 * Sobre elementos con data-cursor="Texto" crece y muestra la etiqueta.
 * Solo con mouse (pointer: fine) y sin "reducir movimiento".
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hoverLink, setHoverLink] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as HTMLElement | null;
      const withLabel = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(withLabel?.dataset.cursor ?? null);
      setHoverLink(!!t?.closest("a, button, label, input, textarea, select"));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 88 : hoverLink ? 36 : 12;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-sm bg-naranja font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-tinta"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: size,
        height: size,
        opacity: visible ? (hoverLink && !label ? 0.5 : 1) : 0,
        rotate: label ? 0 : hoverLink ? 45 : 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {label && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}

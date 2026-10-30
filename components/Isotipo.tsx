"use client";

import { motion } from "framer-motion";

/**
 * Isotipo "Trazo" (Manual de marca v1.1 §2): la P en una sola línea + punto naranja.
 * - normal: trazo 3,5 u (desde 24 px de alto)
 * - heavy: versión reforzada para tamaños chicos (< 24 px)
 */
export const TRAZO_PATH = "M10 15.5H13.5A6.25 6.25 0 0 0 13.5 3H5V15";
const TRAZO_HEAVY = "M11 15.5H13.5A6.25 6.25 0 0 0 13.5 3H5V14";

type Props = {
  line?: string;
  dot?: string;
  heavy?: boolean;
  /** Dibuja el trazo y luego hace aparecer el punto (una sola vez). */
  draw?: boolean;
  className?: string;
  title?: string;
};

export function Isotipo({ line = "#111111", dot = "#FF4F00", heavy = false, draw = false, className = "h-6 w-auto", title }: Props) {
  const d = heavy ? TRAZO_HEAVY : TRAZO_PATH;
  const sw = heavy ? 4.5 : 3.5;
  const r = heavy ? { x: 2, y: 18, s: 6 } : { x: 2.5, y: 18.5, s: 5 };
  return (
    <svg
      viewBox={heavy ? "1.5 0.5 20.5 24" : "2.5 1.25 19 22.25"}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {draw ? (
        <>
          <motion.path
            d={d}
            fill="none"
            stroke={line}
            strokeWidth={sw}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.rect
            x={r.x}
            y={r.y}
            width={r.s}
            height={r.s}
            rx={1}
            fill={dot}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.65 }}
          />
        </>
      ) : (
        <>
          <path d={d} fill="none" stroke={line} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
          <rect x={r.x} y={r.y} width={r.s} height={r.s} rx={1} fill={dot} />
        </>
      )}
    </svg>
  );
}

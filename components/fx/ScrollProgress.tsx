"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Barra naranja de progreso de lectura, arriba de todo. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-naranja" style={{ scaleX }} />;
}

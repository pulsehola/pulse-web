"use client";

import { MotionConfig } from "framer-motion";

// reducedMotion="user": respeta la preferencia "reducir movimiento" del sistema.
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

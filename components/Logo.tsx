import { WORDMARK_PATH } from "./wordmark";
import { TRAZO_PATH } from "./Isotipo";

type Props = {
  /** "light" = sobre fondo claro (trazo y wordmark tinta). "dark" = sobre tinta (blanco). */
  tone?: "light" | "dark";
  className?: string;
};

// Isotipo escalado a la altura del lockup (24 u): bounds 2.5,1.25 → 19 × 22.25
const S = 24 / 22.25;

/** Logotipo oficial PULSE v1.1: isotipo Trazo + wordmark (Manual de marca §2). */
export function Logo({ tone = "light", className = "h-6 w-auto" }: Props) {
  const ink = tone === "dark" ? "#FFFFFF" : "#111111";
  return (
    <svg viewBox="0 0 115.62 24" className={className} role="img" aria-label="PULSE">
      <g transform={`translate(${(-2.5 * S).toFixed(3)} ${(-1.25 * S).toFixed(3)}) scale(${S.toFixed(4)})`}>
        <path d={TRAZO_PATH} fill="none" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="2.5" y="18.5" width="5" height="5" rx="1" fill="#FF4F00" />
      </g>
      <path transform="translate(30.96 19.92)" fill={ink} d={WORDMARK_PATH} />
    </svg>
  );
}

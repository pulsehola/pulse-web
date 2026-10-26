import { WORDMARK_PATH } from "./wordmark";

const ISO_POINTS = "0,12 12,12 16,3 21,21 26,8 29,12 44,12";

type Props = {
  /** "light" = sobre fondo claro (wordmark tinta). "dark" = sobre tinta (wordmark blanco). */
  tone?: "light" | "dark";
  className?: string;
};

/** Logotipo oficial PULSE (Manual de marca §2). Escalar solo con height/width proporcional. */
export function Logo({ tone = "light", className = "h-6 w-auto" }: Props) {
  return (
    <svg viewBox="0 0 143 24" className={className} role="img" aria-label="PULSE">
      <polyline
        transform="translate(1.25 0)"
        points={ISO_POINTS}
        fill="none"
        stroke="#FF4F00"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path transform="translate(57.25 19.92)" fill={tone === "dark" ? "#FFFFFF" : "#111111"} d={WORDMARK_PATH} />
    </svg>
  );
}

export { ISO_POINTS };

import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  id?: string;
  dark?: boolean;
};

/** Regla + eyebrow mono + título grande + bajada. Número gigante calado de fondo. */
export function SectionHeader({ eyebrow, title, lead, id, dark }: Props) {
  const num = eyebrow.slice(0, 2);
  return (
    <Reveal className={`relative flex flex-col gap-4 border-t-regla pt-6 ${dark ? "border-naranja" : "border-tinta"}`}>
      <span
        aria-hidden="true"
        className={`text-outline pointer-events-none absolute -top-2 right-0 hidden select-none text-[clamp(5rem,12vw,13rem)] font-bold leading-[0.8] tracking-[-0.05em] md:block ${
          dark ? "md:hidden" : "text-gris-300"
        }`}
      >
        {num}
      </span>
      <span className={`font-mono text-label font-medium uppercase ${dark ? "text-naranja" : "text-naranja-texto"}`}>{eyebrow}</span>
      <h2 id={id} className="relative max-w-[16ch] text-[clamp(2.25rem,6vw,4.75rem)] font-bold leading-[0.98] tracking-[-0.04em]">
        {title}
      </h2>
      {lead && <p className={`relative max-w-lead text-lead ${dark ? "text-white/75" : "text-gris-700"}`}>{lead}</p>}
    </Reveal>
  );
}

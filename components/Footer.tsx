import { WORDMARK_PATH } from "./wordmark";
import { site } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-tinta text-white">
      <div className="container-page flex flex-col gap-12 pt-16 md:pt-24">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <a href="#contacto" className="group flex flex-col gap-2">
            <span className="font-mono text-label font-medium uppercase text-naranja">{site.footer.cta}</span>
            <span className="flex items-center gap-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-none tracking-[-0.04em]">
              {site.footer.ctaLink}
              <span aria-hidden="true" className="inline-flex h-12 w-12 items-center justify-center rounded bg-naranja text-2xl text-tinta transition-transform duration-300 group-hover:translate-x-2 group-hover:-rotate-45">
                →
              </span>
            </span>
          </a>
          <nav aria-label="Pie de página" className="flex flex-wrap gap-x-8 gap-y-3">
            {site.nav.map((n) => (
              <a key={n.href} href={n.href} className="text-[15px] font-semibold text-white/80 transition-colors hover:text-naranja">
                {n.label}
              </a>
            ))}
            <a href="#top" className="font-mono text-[12px] uppercase tracking-[0.08em] text-gris-300 hover:text-white">
              {site.footer.backToTop} ↑
            </a>
          </nav>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t-regla border-naranja pt-6 font-mono text-[12px] tracking-[0.06em] text-gris-300 md:flex-row">
          <span>
            {site.footer.tagline} · {site.contact.city}
          </span>
          <span>
            © {year} PULSE. {site.footer.rights}
          </span>
        </div>
      </div>

      {/* Wordmark a todo el ancho, cortado por el borde inferior */}
      <svg aria-hidden="true" viewBox="1.2 -16.4 83.8 13.2" className="mt-10 block w-full" preserveAspectRatio="xMidYMin slice">
        <path d={WORDMARK_PATH} fill="#FFFFFF" fillOpacity="0.06" />
      </svg>
    </footer>
  );
}

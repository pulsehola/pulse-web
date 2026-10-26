import Link from "next/link";

type Variant = "primary" | "secondary" | "secondary-dark";

const base =
  "group relative isolate inline-flex min-h-[48px] items-center justify-center gap-3 overflow-hidden rounded px-6 py-[14px] text-[15px] font-semibold leading-none border-regla transition-colors duration-300";

// Manual §3: primario naranja con texto tinta (5,7:1). Nunca texto blanco sobre naranja.
// Hover: un bloque de color barre el botón de izquierda a derecha.
const variants: Record<Variant, { cls: string; sweep: string }> = {
  primary: { cls: "bg-naranja border-naranja text-tinta hover:text-white hover:border-tinta", sweep: "bg-tinta" },
  secondary: { cls: "bg-transparent border-tinta text-tinta hover:text-white", sweep: "bg-tinta" },
  "secondary-dark": { cls: "bg-transparent border-white text-white hover:text-tinta", sweep: "bg-white" },
};

type Props = {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

export function Button({ href, variant = "primary", children, className = "", external }: Props) {
  const v = variants[variant];
  const cls = `${base} ${v.cls} ${className}`;
  const inner = (
    <>
      <span aria-hidden="true" className={`absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 ${v.sweep}`} />
      {children}
      <span aria-hidden="true" className="relative flex h-4 w-4 items-center overflow-hidden">
        <span className="absolute transition-transform duration-300 group-hover:translate-x-5">→</span>
        <span className="absolute -translate-x-5 transition-transform duration-300 group-hover:translate-x-0">→</span>
      </span>
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

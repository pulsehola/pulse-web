import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Proyecto } from "@/components/landing/Landing";

// Páginas de proyecto de la sección Clientes. Los textos y las pantallas viven en
// components/landing/Landing.tsx (constante CLIENTES); acá solo el título para buscadores.
const PROYECTOS: Record<string, { titulo: string; descripcion: string }> = {
  "un-clu-de-bordado": {
    titulo: "un clu de bordado",
    descripcion: "App de reservas para una comunidad de bordado: calendario de clases, kits y noticias, en español y catalán.",
  },
  daily: {
    titulo: "DAILY",
    descripcion: "App web de finanzas personales multidivisa: cuentas en pesos, dólares y euros, importación de extractos, deudas, viajes, inversiones e informes en PDF.",
  },
  "daiana-marlene": {
    titulo: "Daiana Marlene",
    descripcion: "App para una terapeuta y mentora: cursos en vivo por Meet con su material, reserva de sesiones individuales, recordatorios y panel semanal.",
  },
};

export function generateStaticParams() {
  return Object.keys(PROYECTOS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROYECTOS[slug];
  if (!p) return {};
  return {
    title: `${p.titulo} — Proyecto de PULSE`,
    description: p.descripcion,
    openGraph: { title: `${p.titulo} — Proyecto de PULSE`, description: p.descripcion, type: "website", locale: "es_ES" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!PROYECTOS[slug]) notFound();
  return <Proyecto slug={slug} />;
}

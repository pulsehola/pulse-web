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
  const titulo = `${p.titulo}, proyecto de PULSE`;
  return {
    title: `${p.titulo} · Proyecto`,
    description: p.descripcion,
    alternates: { canonical: `/clientes/${slug}` },
    openGraph: {
      type: "article", locale: "es_ES", siteName: "PULSE", url: `/clientes/${slug}`, title: titulo, description: p.descripcion,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "PULSE: tu negocio, en una app propia" }],
    },
    twitter: { card: "summary_large_image", title: titulo, description: p.descripcion, images: ["/og.jpg"] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!PROYECTOS[slug]) notFound();
  return <Proyecto slug={slug} />;
}

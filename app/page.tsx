import type { Metadata } from "next";
import Landing from "@/components/landing/Landing";

// Portada: landing de apps web a medida.
// La home anterior (Hero, Services, About, Projects, Contact) sigue en /components por si se quiere recuperar.
export const metadata: Metadata = {
  title: "PULSE — Apps web a medida para tu negocio",
  description:
    "Convertimos tu forma de trabajar en una app propia: reservas, stock, citas y clientes, conectada con WhatsApp, Instagram, Excel y Google Calendar.",
  openGraph: {
    title: "PULSE — Apps web a medida para tu negocio",
    description:
      "Reservas, stock, citas y clientes en una app hecha a tu medida. Sin descargas y sin saber de código.",
    type: "website",
    locale: "es_ES",
  },
};

export default function Home() {
  return <Landing />;
}

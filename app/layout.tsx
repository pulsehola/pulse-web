import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// Fuentes autoalojadas (sin llamadas a Google en el navegador: mejor para RGPD y performance).
// Subset latino + castellano/catalán. Licencia SIL OFL 1.1.
const manrope = localFont({
  src: "./fonts/Manrope-Variable.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "./fonts/IBMPlexMono-Regular.woff2", weight: "400" },
    { path: "./fonts/IBMPlexMono-Medium.woff2", weight: "500" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

const TITULO = "PULSE — Apps web a medida para tu negocio";
const DESCRIPCION =
  "Apps web a medida (PWA) para gestionar reservas, stock, citas y clientes. Se instalan en el móvil sin pasar por las tiendas y se conectan con WhatsApp, pagos y Google Calendar.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITULO, template: "%s — PULSE" },
  description: DESCRIPCION,
  applicationName: "PULSE",
  keywords: ["apps web a medida", "PWA", "app para negocios", "gestión de reservas", "gestión de stock", "agenda de citas", "software a medida"],
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }] },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "PULSE",
    url: "/",
    title: TITULO,
    description: DESCRIPCION,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "PULSE: tu negocio, en una app propia" }],
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRIPCION, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${plexMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

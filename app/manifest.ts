import type { MetadataRoute } from "next";

// Permite "Añadir a pantalla de inicio" con el icono y el nombre correctos.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PULSE — Apps web a medida",
    short_name: "PULSE",
    description: "Apps web a medida para tu negocio.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}

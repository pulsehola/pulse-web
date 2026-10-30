import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const CLIENTES = ["un-clu-de-bordado", "daily", "daiana-marlene"];

export default function sitemap(): MetadataRoute.Sitemap {
  const hoy = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: hoy, changeFrequency: "monthly", priority: 1 },
    ...CLIENTES.map((s) => ({ url: `${SITE_URL}/clientes/${s}`, lastModified: hoy, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}

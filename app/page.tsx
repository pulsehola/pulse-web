import type { Metadata } from "next";
import Landing from "@/components/landing/Landing";

// Portada: landing de apps web a medida.
// La home anterior (Hero, Services, About, Projects, Contact) sigue en /components por si se quiere recuperar.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <Landing />;
}

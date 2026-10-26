import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Política de privacidad — PULSE" };

// Marcador: este texto lo tiene que redactar o revisar alguien con conocimiento legal (RGPD / LOPDGDD).
export default function Privacidad() {
  return (
    <main className="container-page flex max-w-prose flex-col gap-6 py-16">
      <Link href="/" aria-label="Volver al inicio">
        <Logo className="h-6 w-auto" />
      </Link>
      <h1 className="text-h1">Política de privacidad</h1>
      <p className="text-lead text-gris-700">[Completar: responsable del tratamiento, finalidad, base legal, plazo de conservación, derechos y contacto.]</p>
      <Link href="/" className="font-semibold underline underline-offset-4">
        ← Volver al inicio
      </Link>
    </main>
  );
}

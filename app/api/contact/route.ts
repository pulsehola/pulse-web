import { NextResponse } from "next/server";

/**
 * Recibe el brief del formulario.
 * TODO: conectar un proveedor de email (Resend, Postmark, etc.) o un CRM.
 * Hoy solo valida y lo deja en el log del servidor.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: si un bot completó el campo oculto, respondemos OK sin hacer nada.
  if (body.website) return NextResponse.json({ ok: true });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const needs = Array.isArray(body.needs) ? body.needs.map(String) : [];
  const consent = Boolean(body.consent);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || needs.length === 0 || !consent) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const brief = {
    name: name.slice(0, 200),
    email: email.slice(0, 200),
    company: String(body.company ?? "").slice(0, 200),
    needs,
    timeline: String(body.timeline ?? ""),
    message: String(body.message ?? "").slice(0, 5000),
    receivedAt: new Date().toISOString(),
  };

  console.log("[brief]", brief);
  return NextResponse.json({ ok: true });
}

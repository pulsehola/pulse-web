"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";
import { Reveal } from "./ui/Reveal";
import { site } from "@/lib/content";
import { Isotipo } from "./Isotipo";

const c = site.contact_section;
const { contact } = site;

type Status = "idle" | "sending" | "ok" | "error";
type Errors = Partial<Record<"name" | "email" | "needs" | "consent", string>>;

export function Contact() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const waHref = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`;

  function toggleNeed(id: string) {
    setNeeds((cur) => (cur.includes(id) ? cur.filter((n) => n !== id) : [...cur, id]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};
    if (!String(data.get("name") || "").trim()) next.name = c.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") || ""))) next.email = c.errors.email;
    if (needs.length === 0) next.needs = c.errors.needs;
    if (!data.get("consent")) next.consent = c.errors.consent;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = form.querySelector<HTMLElement>(`[data-field="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data.entries()), needs }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
      setNeeds([]);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="on-dark dot-grid relative scroll-mt-20 overflow-hidden bg-tinta py-20 text-white md:py-32">
      <div className="container-page mb-14 md:mb-20">
        <BigTitle text={c.bigTitle} />
      </div>
      <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <div className="flex flex-col gap-10">
          <SectionHeader id="contacto-title" eyebrow={c.eyebrow} title={c.title} lead={c.lead} dark />
          <Reveal className="flex flex-col gap-1">
            <span className="mb-2 font-mono text-label font-medium uppercase text-gris-300">{c.directTitle}</span>
            {[
              { href: waHref, label: c.whatsappCta, ext: true },
              { href: `mailto:${contact.email}`, label: c.emailCta, ext: false },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center justify-between border-b border-white/20 py-4 text-xl font-bold tracking-[-0.02em] transition-colors hover:text-naranja"
              >
                {l.label}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:-rotate-45">→</span>
              </a>
            ))}
            <span className="pt-3 font-mono text-[12px] tracking-[0.06em] text-gris-300">{contact.email}</span>
          </Reveal>
        </div>

        <Reveal>
          <AnimatePresence mode="wait">
            {status === "ok" ? (
              <motion.div
                key="ok"
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[320px] flex-col justify-center gap-4 rounded bg-naranja p-8 text-tinta"
              >
                <Isotipo draw line="#111111" dot="#111111" className="h-12 w-auto self-start" />
                <p className="text-h3">{c.success}</p>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate onSubmit={onSubmit} className="flex flex-col gap-6 rounded bg-white p-6 text-tinta md:p-8 [&_:focus-visible]:outline-tinta" exit={{ opacity: 0 }}>
                {/* Honeypot anti-spam: invisible para personas */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label={c.fields.name} name="name" error={errors.name} autoComplete="name" />
                  <Field label={c.fields.email} name="email" type="email" error={errors.email} autoComplete="email" />
                </div>
                <Field label={c.fields.company} name="company" autoComplete="organization" />

                <fieldset className="flex flex-col gap-3" aria-describedby={errors.needs ? "needs-error" : undefined}>
                  <legend className="mb-3 text-[15px] font-semibold">{c.needsLabel}</legend>
                  <div className="flex flex-wrap gap-2">
                    {c.needs.map((n, i) => {
                      const on = needs.includes(n.id);
                      return (
                        <label
                          key={n.id}
                          className={`relative inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded border-regla px-4 text-[15px] font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tinta ${
                            on ? "border-naranja bg-naranja text-tinta" : "border-gris-300 bg-white hover:border-tinta"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={on}
                            onChange={() => toggleNeed(n.id)}
                            data-field={i === 0 ? "needs" : undefined}
                          />
                          <motion.span aria-hidden="true" animate={{ rotate: on ? 45 : 0 }} className="text-lg leading-none">
                            +
                          </motion.span>
                          {n.label}
                        </label>
                      );
                    })}
                  </div>
                  {errors.needs && <ErrorText id="needs-error">{errors.needs}</ErrorText>}
                </fieldset>

                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-3 text-[15px] font-semibold">{c.timelineLabel}</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {c.timelines.map((t, i) => (
                      <label
                        key={t}
                        className="flex min-h-[44px] cursor-pointer items-center justify-center rounded border-regla border-gris-300 px-3 text-center text-[14px] font-semibold transition-colors hover:border-tinta has-[:checked]:border-tinta has-[:checked]:bg-tinta has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tinta"
                      >
                        <input type="radio" name="timeline" value={t} defaultChecked={i === 3} className="sr-only" />
                        {t}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-[15px] font-semibold">
                    {c.fields.message}
                  </label>
                  <textarea id="message" name="message" rows={4} placeholder={c.fields.messagePlaceholder} className="field resize-y" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-[1.5] text-gris-700">
                    <input
                      type="checkbox"
                      name="consent"
                      data-field="consent"
                      aria-invalid={!!errors.consent}
                      aria-describedby={errors.consent ? "consent-error" : undefined}
                      className="mt-0.5 h-5 w-5 flex-none cursor-pointer accent-tinta"
                    />
                    <span>
                      {c.consent}{" "}
                      <a href={c.privacyLink.href} className="font-semibold text-tinta underline underline-offset-2">
                        {c.privacyLink.label}
                      </a>
                    </span>
                  </label>
                  {errors.consent && <ErrorText id="consent-error">{errors.consent}</ErrorText>}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded border-regla border-naranja bg-naranja px-7 text-[15px] font-semibold text-tinta transition-colors hover:border-tinta hover:bg-tinta hover:text-white disabled:cursor-wait disabled:border-papel disabled:bg-papel disabled:text-gris-500"
                  >
                    {status === "sending" ? c.sending : c.submit}
                  </motion.button>
                  {status === "error" && (
                    <p role="alert" className="text-[14px] font-semibold text-tinta">
                      {c.error}
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

/** "Hablemos." gigante, letra por letra, con una línea de proceso que termina en el punto del isotipo. */
function BigTitle({ text }: { text: string }) {
  return (
    <div aria-hidden="true" className="relative">
      <motion.p
        className="text-mega"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.04 }}
      >
        {text.split("").map((ch, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className={`inline-block ${ch === "." ? "text-naranja" : ""}`}
              variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
            >
              {ch}
            </motion.span>
          </span>
        ))}
      </motion.p>
      {/* Línea de proceso que termina en el punto del isotipo: de principio a fin */}
      <div className="mt-6 flex items-center gap-3">
        <motion.span
          className="h-[3px] flex-1 origin-left rounded-full bg-white/25"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.4 }}
        />
        <motion.span
          className="h-4 w-4 flex-none rounded-[3px] bg-naranja"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 1.5 }}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  autoComplete?: string;
}) {
  const errId = `${name}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-[15px] font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        data-field={name}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={`field ${error ? "border-naranja-texto" : ""}`}
      />
      {error && <ErrorText id={errId}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-2 text-[14px] font-semibold leading-[1.45] text-naranja-texto">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-[2px] h-4 w-4 flex-none"fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      {children}
    </p>
  );
}

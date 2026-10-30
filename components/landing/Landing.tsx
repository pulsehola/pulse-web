// @ts-nocheck
"use client";
// Landing "Apps a medida". Portada desde el prototipo en Claude; los tipos se añadirán al
// dividir este archivo en componentes. Contenido editable en las constantes de CONTENIDO.
/* =====================================================================
   PULSE — Landing "Apps a medida" · v3 (línea producto / SaaS)
   React + Tailwind + Framer Motion.
   - Escritorio: motion ligado al scroll (sticky showcase, parallax, pulsos).
   - Móvil o "reducir movimiento": modo simple, sin sticky ni parallax.
   Cada bloque "SECCIÓN" es un componente .tsx para pulse-web.
   ===================================================================== */

import React, { useState, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useMotionValue } from "framer-motion";
import { Logo } from "../Logo";
import { WORDMARK_PATH } from "../wordmark";
const ease = [0.22, 1, 0.36, 1];

/* ---------------------------------------------------------------------
   CONTENIDO (en pulse-web → lib/content.ts)
   --------------------------------------------------------------------- */
const CONTACTO = {
  agenda: "#contacto",            // TODO: Cal.com / Calendly
  whatsapp: "#contacto",          // TODO: https://wa.me/34XXXXXXXXX?text=...
  email: "pulse.hola@gmail.com",
};
// Todos los botones de contacto abren un email nuevo en Gmail, con asunto y texto de partida.
// Para que abra la app de correo de cada persona, usar: `mailto:${CONTACTO.email}?subject=...&body=...`
CONTACTO.gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACTO.email}&su=${encodeURIComponent("Quiero una app para mi negocio")}&body=${encodeURIComponent("Hola PULSE,\n\nMi negocio es: \nLo que me gustaría organizar: \n\nGracias.")}`;
const EXTERNO = { target: "_blank", rel: "noopener noreferrer" };

const CASOS = [
  {
    id: "pilates", word: "tus clases", tab: "Estudio de pilates", corto: "Estudio",
    titulo: "Reservas, plazas y bonos, sin contestar un mensaje.",
    texto: "Tus alumnas ven las plazas libres y reservan desde el móvil. El bono se descuenta solo y el recordatorio sale por WhatsApp el día antes.",
    puntos: ["Plazas libres en tiempo real", "Bonos que se descuentan solos", "Lista de espera automática", "Recordatorio el día antes"],
    para: "Pilates, yoga, entrenamiento, talleres",
  },
  {
    id: "stock", word: "tu stock", tab: "Almacén y comercio", corto: "Almacén",
    titulo: "Entradas, salidas y avisos antes de quedarte sin nada.",
    texto: "Cada movimiento queda registrado y ves qué queda en cada momento. Cuando algo baja del mínimo, te avisa a ti y a quien tenga que pedirlo.",
    puntos: ["Entradas y salidas en un toque", "Alertas de stock bajo", "Historial de cada movimiento", "Exporta a Excel cuando quieras"],
    para: "Logística, comercios, distribución, e-commerce",
  },
  {
    id: "agenda", word: "tus citas", tab: "Profesional independiente", corto: "Profesional",
    titulo: "Tu agenda llena, y los avisos salen solos.",
    texto: "Tus clientes reservan desde un enlace, la cita aparece en tu calendario y el recordatorio les llega por WhatsApp. Tú solo atiendes.",
    puntos: ["Reservas desde un enlace", "Recordatorios por WhatsApp", "Citas en tu Google Calendar", "Huecos libres a la vista"],
    para: "Fisios, peluquerías, asesoras, terapeutas",
  },
];

// Cómo trabajamos: proceso real, en orden.
const PASOS = [
  { t: "Coordinamos una reunión", d: "Una primera charla, por videollamada o en persona, para conocer tu negocio." },
  { t: "Nos cuentas tus necesidades específicas", d: "Cómo trabajas hoy, qué te quita tiempo y qué te gustaría resolver." },
  { t: "Presupuestamos", d: "Cada negocio o proyecto es único, así que el presupuesto también se hace a medida." },
  { t: "Diseñamos un prototipo", d: "Ves y pruebas las pantallas de tu app antes de que la programemos." },
  { t: "Ajustamos detalles a partir de tu feedback", d: "Afinamos lo que haga falta hasta que encaje con tu día a día." },
  { t: "¡Y listo! Puedes comenzar a usarla", d: "Tu app queda lista para ti, tu equipo y tus clientes." },
];

// Soluciones: lo que puede resolver una app de PULSE.
const SOLUCIONES = [
  { k: "reservas", t: "Reservas", d: "Tus clientes reservan solos, a cualquier hora, y ven las plazas libres al momento." },
  { k: "citas", t: "Citas", d: "Confirmaciones y recordatorios automáticos para que nadie se olvide de venir." },
  { k: "agendas", t: "Agendas", d: "El día de cada persona del equipo en una pantalla, sin choques ni dobles reservas." },
  { k: "stock", t: "Stock", d: "Entradas, salidas y un aviso antes de que algo se agote." },
  { k: "presupuestos", t: "Presupuestos", d: "Prepara y envía presupuestos en minutos, con tu marca." },
  { k: "datos", t: "Datos", d: "Clientes, pedidos e historial ordenados en un solo sitio, siempre a mano." },
  { k: "dashboards", t: "Dashboards", d: "Los números de tu negocio de un vistazo: reservas, ventas y ocupación." },
  { k: "analisis", t: "Análisis", d: "Qué se vende más, qué horarios se llenan y dónde puedes mejorar." },
  { k: "soporte", t: "Soporte", d: "Seguimos a tu lado después de la entrega, para resolver dudas y hacer ajustes." },
];

// Lo que hace cada integración, dicho tal cual. TODO: confirmar alcance técnico antes de publicar.
// TODO: confirmar alcance. Bizum online necesita la pasarela (TPV) del banco del cliente.
const INTEGRACIONES = [
  { id: "wa", n: "WhatsApp", d: "Recordatorios y confirmaciones automáticas para tus clientes.", lado: "izq" },
  { id: "card", n: "Pagos con tarjeta", d: "Cobra reservas, bonos o pedidos online con tarjeta, Apple Pay o Google Pay.", lado: "izq" },
  { id: "ig", n: "Instagram", d: "Un enlace para reservar o pedir desde tu bio y tus historias.", lado: "izq" },
  { id: "sheets", n: "Excel y Google Sheets", d: "Importas lo que ya tienes y exportas cuando quieras.", lado: "der" },
  { id: "bizum", n: "Bizum", d: "Tus clientes pagan desde el móvil, sin efectivo ni transferencias.", lado: "der" },
  { id: "cal", n: "Google Calendar", d: "Cada cita aparece en tu calendario de siempre.", lado: "der" },
];

const BENEFICIOS = [
  { t: "Funciona como trabajas tú", d: "No te adaptas a pantallas pensadas para otro negocio. La app sigue tus pasos, en tu orden." },
  { t: "Todo en un solo sitio", d: "Reservas, clientes, stock y números juntos, en vez de cinco herramientas que no se hablan." },
  { t: "Tu marca y tus datos", d: "La app lleva tu nombre y tus colores. La información de tu negocio es tuya." },
  { t: "Sin cuotas por usuario", d: "Sumar a una persona más a tu equipo no te cuesta nada extra. Con las apps que cobran por usuario, sí." },
];

// Comparativa: PULSE frente a software por suscripción y app nativa de tiendas.
// TODO: confirmar "sin cuotas de mantenimiento ni comisiones" con el modelo de precios real (alojamiento y mensajes de WhatsApp).
const COMPARATIVA = {
  alt: [
    { t: "Software de pago mensual", sub: "Plataformas por suscripción", corto: "Software mensual" },
    { t: "App nativa tradicional", sub: "App Store y Google Play", corto: "App nativa" },
  ],
  rows: [
    { t: "A medida de tu negocio", a: "Rígido: te tienes que adaptar a sus funciones estándar.", b: "A medida, pero con un coste muy alto.", p: "Hecha a la medida de cómo trabajas de verdad." },
    { t: "Costes", a: "Cuota mensual y, en muchos casos, comisión por cada pago o reserva.", b: "Desarrollo de miles de euros, normalmente doble: uno para iPhone y otro para Android.", p: "Pagas el desarrollo y listo: sin gastos fijos de mantenimiento ni comisiones sobre tus ventas." },
    { t: "Cómo entra tu cliente", a: "Tiene que descargar otra app más, a menudo con la marca de la plataforma.", b: "La tiene que buscar en la tienda, descargarla y mantenerla actualizada.", p: "Con un toque desde un enlace, directo a la pantalla de inicio." },
    { t: "Memoria y batería", a: "Una app más instalada, ocupando espacio en el móvil.", b: "Ocupa espacio y puede ir lenta en móviles modestos.", p: "Muy ligera: pesa menos que una foto y apenas gasta batería." },
    { t: "Propiedad de los datos", a: "Tus datos viven en su plataforma. Si te vas, sacarlos puede ser difícil.", b: "Dependes de las normas de Apple y Google para publicar y actualizar.", p: "Tus datos son tuyos y te los puedes llevar cuando quieras." },
    { t: "Integraciones", a: "Solo las que la plataforma decida ofrecer.", b: "Posibles, pero complejas y caras de programar.", p: "Conectada con lo que ya usas: WhatsApp, Excel, Google Calendar y más." },
    { t: "Tu marca y diseño", a: "Suele llevar la imagen de la plataforma.", b: "Tu marca, pero sujeta a la aprobación de las tiendas.", p: "Tu marca, tus colores y tu nombre, solo para ti." },
  ],
};

// TODO revisar antes de publicar: las respuestas 1, 2 y 3 son una propuesta de redacción.
const FAQS = [
  { q: "¿Qué es PULSE y cómo funciona?", a: "PULSE es un estudio que diseña y desarrolla apps web a medida para negocios. Nos cuentas cómo trabajas, diseñamos un prototipo, lo ajustamos contigo y te entregamos una app lista para usar, con tu marca y conectada a las herramientas que ya utilizas." },
  { q: "¿Se puede integrar a mi sitio web?", a: "Sí. La app puede tener tu propio dominio (por ejemplo, reservas.tunegocio.com) y enlazarse desde tu web con un botón o desde el menú. Si tu web lo permite, también puede ir dentro de una de sus páginas. Y si no tienes web, la app funciona sola, con su propio enlace." },
  { q: "¿Qué necesito para empezar?", a: "Solo saber qué te gustaría organizar. Si tienes listados en Excel, tu logo o los colores de tu marca, nos ayudan; si no, los preparamos contigo. Escríbenos y coordinamos una primera reunión." },
  { q: "¿Cuánto cuesta una app a medida?", a: "Cada proyecto es único. Presupuestamos a medida en función de tus necesidades y de las dimensiones y la complejidad del proyecto. Lo habitual es empezar con una versión simple que contenga lo imprescindible, con la opción de añadir lo que sea necesario una vez que está en funcionamiento." },
  { q: "No sé nada de tecnología. ¿Es un problema?", a: "Para nada. Tú sabes cómo funciona tu negocio y eso es lo único que necesitamos. Del resto nos ocupamos nosotros y te lo explicamos en detalle, sin tecnicismos." },
  { q: "¿Hay que descargarla de App Store o Google Play?", a: "No. Se abre con un enlace y se instala desde el navegador en el móvil o el ordenador, con su icono, como cualquier app. Funciona en iPhone y Android y envía notificaciones." },
  { q: "¿Es fácil de utilizar para mi equipo y mis clientes?", a: "Es el objetivo principal. La diseñamos alrededor de las tareas que ya hacen todos los días y la probamos con ustedes antes de lanzarla. Si alguien necesita un manual, la cambiamos." },
  { q: "Una vez entregada, ¿cuentan con soporte técnico?", a: "Claro, quedamos a disposición para lo que necesites." },
];

// Formulario de contacto: FormSubmit reenvía cada mensaje a CONTACTO.email.
// El primer envío llega como email de activación a esa cuenta: hay que confirmarlo una vez.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACTO.email}`;

/* ---------------------------------------------------------------------
   UTILIDADES DE MOTION
   --------------------------------------------------------------------- */
function useMedia(q) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const f = () => setM(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [q]);
  return m;
}
// Modo simple: móvil, pantallas táctiles estrechas o "reducir movimiento"
function useSimple() {
  const reduce = useReducedMotion();
  const narrow = useMedia("(max-width: 767px)");
  return reduce || narrow;
}

function useToast(ms = 1800) {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), ms);
    return () => clearTimeout(t);
  }, [msg, ms]);
  return [msg, setMsg];
}

/* ---------------------------------------------------------------------
   MARCA
   --------------------------------------------------------------------- */
// Color de acento centralizado. El logo mantiene siempre su naranja oficial.
const LOGO_NARANJA = "#FF4F00";
const ACENTO = { base: "#FF4F00", texto: "#C2410C", suave: "#FFF1EA", claro: "#FF4F00", a: "#FF4F00", b: "#FF8A3D" };

// El isotipo solo aparece en el pie y en la tabla comparativa (a través de <Logo />).
// En la cabecera y en las páginas de proyecto se usa solo el wordmark.
function Wordmark({ className = "h-4 w-auto", tone = "light" }) {
  return (
    <svg viewBox="1.2 -16.5 83.8 17.1" className={className} role="img" aria-label="PULSE">
      <path fill={tone === "dark" ? "#FFFFFF" : "#111111"} d={WORDMARK_PATH} />
    </svg>
  );
}

// Reloj compartido para las mini animaciones (se detiene con "reducir movimiento")
function useTick(ms = 1800) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setT((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms, reduce]);
  return t;
}

const BTN = {
  dark: "bg-tinta text-white hover:bg-[#2a2a2a]",
  accent: "bg-gradient-to-r from-grad-a to-grad-b text-tinta shadow-[0_12px_32px_-12px_rgba(255,79,0,0.75)] hover:brightness-105",
  onDark: "bg-white/10 text-white ring-1 ring-inset ring-white/25 backdrop-blur hover:bg-white/15",
  light: "bg-white text-tinta ring-1 ring-inset ring-linea hover:ring-tinta",
};
// Botón con atracción magnética al cursor (solo con ratón, fuera del modo simple)
function Button({ href = "#contacto", variant = "dark", children, className = "" }) {
  const simple = useSimple();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });
  const move = (e) => {
    if (simple || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.16);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <motion.a href={href} {...(href.startsWith("http") ? EXTERNO : {})} style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={leave}
      className={`group inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full px-6 text-[15px] font-semibold leading-none transition-[background-color,box-shadow,filter] duration-300 active:scale-[0.98] ${BTN[variant]} ${className}`}>
      {children}
      <span aria-hidden="true" className="relative flex h-4 w-4 items-center overflow-hidden">
        <span className="absolute transition-transform duration-300 group-hover:translate-x-5">→</span>
        <span className="absolute -translate-x-5 transition-transform duration-300 group-hover:translate-x-0">→</span>
      </span>
    </motion.a>
  );
}
function Eyebrow({ children, dark }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-mono text-label font-medium uppercase ${dark ? "text-white/60" : "text-gris-500"}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-[#FF8A3D]" : "bg-acento"}`} />{children}
    </span>
  );
}
function SectionTitle({ eyebrow, title, lead, id, center, as = "h2" }) {
  return (
    <div className={`flex flex-col gap-5 ${center ? "items-center text-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <RevealTitle as={as} id={id} className="max-w-[18ch] text-titulo">{title}</RevealTitle>
      {lead && <p className="max-w-entrada text-entrada text-gris-500">{lead}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------------
   ICONOS PROPIOS (glifos genéricos, sin logos de terceros)
   --------------------------------------------------------------------- */
function Glyph({ kind, className = "h-5 w-5" }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "wa") return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path {...p} d="M4 19.5 5.3 16A8 8 0 1 1 8 18.7Z" /><path {...p} d="M9 10.5h6M9 13.5h4" /></svg>;
  if (kind === "ig") return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path {...p} d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-.8.8" /><path {...p} d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l.8-.8" /></svg>;
  if (kind === "sheets") return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><rect {...p} x="4" y="4" width="16" height="16" rx="2.5" /><path {...p} d="M4 9.5h16M4 14.5h16M10 4v16" /></svg>;
  if (kind === "cal") return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><rect {...p} x="4" y="5.5" width="16" height="14.5" rx="2.5" /><path {...p} d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /><path {...p} d="M8.5 14h2M13.5 14h2M8.5 17h2" /></svg>;
  if (kind === "card") return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><rect {...p} x="3" y="5.5" width="18" height="13" rx="2.5" /><path {...p} d="M3 10h18M7 15h4" /></svg>;
  if (kind === "bizum") return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><rect {...p} x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path {...p} d="M10 18h4M14.2 8.6a2.6 2.6 0 1 0 0 3.8M9.6 9.7h3.4M9.6 11.3h3.4" /></svg>;
  if (kind === "note") return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><rect {...p} x="5" y="3.5" width="14" height="17" rx="2.5" /><path {...p} d="M8.5 8h7M8.5 11.5h7M8.5 15h4" /></svg>;
  if (kind === "box") return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path {...p} d="M4 8 12 4l8 4v8l-8 4-8-4Z" /><path {...p} d="M4 8l8 4 8-4M12 12v8" /></svg>;
  return null;
}

// Doble tick de lectura
function Ticks({ read = true, className = "w-[15px]" }) {
  return (
    <svg viewBox="0 0 16 11" className={className} aria-label={read ? "Leído" : "Entregado"}>
      <path d="M1 6.2 3.8 9 9.6 2.2" fill="none" stroke={read ? "#53BDEB" : "#8696A0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.2 8.4 7 9 12.8 2.2" fill="none" stroke={read ? "#53BDEB" : "#8696A0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------------------------------------------------------------
   DISPOSITIVOS
   --------------------------------------------------------------------- */
// Los mockups no muestran la barra del sistema (hora, batería, cobertura): solo dejan
// el espacio de la isla del teléfono para que la app se vea limpia.
function StatusBar() {
  return <div aria-hidden="true" className="h-9 shrink-0" />;
}
function Phone({ children, className = "", label = "Móvil de ejemplo" }) {
  return (
    <div role="group" aria-label={label} className={`relative h-[480px] w-[234px] shrink-0 rounded-[44px] bg-[#1d1d1f] p-[7px] shadow-[0_2px_0_1px_#3a3a3c_inset,0_60px_100px_-50px_rgba(17,17,17,0.55),0_30px_60px_-40px_rgba(17,17,17,0.35)] ${className}`}>
      <div className="absolute left-1/2 top-[15px] z-30 h-[22px] w-[74px] -translate-x-1/2 rounded-full bg-black" />
      <div role="presentation" className="relative h-full w-full overflow-hidden rounded-[37px] bg-white">{children}</div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-[7px] z-40 rounded-[37px] bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_32%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-6 left-1/2 -z-10 h-10 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl" />
    </div>
  );
}
function Tablet({ children, className = "" }) {
  return (
    <div className={`relative w-full rounded-[30px] bg-[#1d1d1f] p-[10px] shadow-[0_2px_0_1px_#3a3a3c_inset,0_60px_100px_-50px_rgba(17,17,17,0.5)] ${className}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[21px] bg-white">{children}</div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-[10px] z-40 rounded-[21px] bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_30%)]" />
    </div>
  );
}

// Aviso flotante tipo notificación del sistema
function Notif({ icon = "pulse", app, title, body, time = "ahora", className = "" }) {
  return (
    <div className={`glass ${/\bw-\[/.test(className) ? "" : "w-[292px]"} rounded-[20px] p-3.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_6px_rgba(17,17,17,0.04),0_24px_60px_-20px_rgba(17,17,17,0.32),0_0_0_1px_rgba(17,17,17,0.05)] ${className}`}>
      <div className="flex items-center gap-2">
        {icon === "wa" && <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-wa-verde text-white"><Glyph kind="wa" className="h-3.5 w-3.5" /></span>}
        {icon === "pulse" && <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-tinta font-sans text-[11px] font-bold text-white">{app?.[0]}</span>}
        {icon === "box" && <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-aviso text-white"><Glyph kind="box" className="h-3.5 w-3.5" /></span>}
        {icon === "cal" && <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-white text-tinta ring-1 ring-linea"><Glyph kind="cal" className="h-3.5 w-3.5" /></span>}
        <span className="font-sys text-[11.5px] font-medium uppercase tracking-[0.02em] text-gris-500">{app}</span>
        <span className="ml-auto font-sys text-[11.5px] text-gris-400">{time}</span>
      </div>
      <div className="mt-1.5 font-sys text-[13.5px] font-semibold leading-snug text-tinta">{title}</div>
      <div className="font-sys text-[13px] leading-snug text-gris-700">{body}</div>
    </div>
  );
}

function Toast({ msg }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div key={msg} initial={{ y: 24, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 14, opacity: 0 }} transition={{ duration: 0.3, ease }}
          className="absolute inset-x-3 bottom-10 z-20 rounded-[14px] bg-tinta/95 px-3 py-2.5 font-sys text-[11.5px] font-medium text-white shadow-lg">
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppHeader({ eyebrow, title, right }) {
  return (
    <div className="flex items-end justify-between gap-2 px-4 pt-6">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-sys text-[11px] font-medium text-gris-400">{eyebrow}</span>
        <span className="truncate font-sys text-[22px] font-bold leading-tight tracking-[-0.02em]">{title}</span>
      </div>
      {right}
    </div>
  );
}
function Hint({ children }) {
  return <div className="mt-auto px-4 pb-5 pt-2 text-center font-sys text-[10.5px] text-gris-400">{children}</div>;
}

/* ---------------------------------------------------------------------
   PANTALLAS · CASO 1: estudio de pilates
   --------------------------------------------------------------------- */
const CLASES = [
  { id: 1, h: "9:00", dur: "50 min", n: "Reformer", prof: "Núria", libres: 3, total: 8 },
  { id: 2, h: "11:30", dur: "45 min", n: "Mat suave", prof: "Clara", libres: 5, total: 10 },
  { id: 3, h: "18:00", dur: "50 min", n: "Reformer intermedio", prof: "Núria", libres: 0, total: 8 },
];
function PilatesScreen() {
  const [res, setRes] = useState([1]);
  const [espera, setEspera] = useState([]);
  const [msg, setMsg] = useToast();
  const toggle = (c) => {
    if (c.libres === 0 && !res.includes(c.id)) {
      setEspera((e) => (e.includes(c.id) ? e.filter((x) => x !== c.id) : [...e, c.id]));
      setMsg(espera.includes(c.id) ? "Saliste de la lista de espera" : "Te avisamos si se libera una plaza");
      return;
    }
    const on = res.includes(c.id);
    setRes((r) => (on ? r.filter((x) => x !== c.id) : [...r, c.id]));
    setMsg(on ? `Cancelada · ${c.n} ${c.h}` : `Reservada · ${c.n} ${c.h}`);
  };
  const bono = 7 - res.length;
  return (
    <div className="flex h-full flex-col bg-[#FAFAF8] font-sys text-tinta">
      <StatusBar />
      <AppHeader eyebrow="Estudio Arrel · jueves 30" title="Clases de hoy" right={<span className="flex h-8 w-8 items-center justify-center rounded-full bg-acento-suave font-sans text-[11px] font-bold text-acento-texto">LP</span>} />
      <div className="mx-4 mt-4 flex flex-col gap-2 rounded-[16px] bg-tinta px-4 py-3 text-white">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-white/60">Tu bono de 10 clases</span>
          <span className="text-[12px] font-semibold">Te quedan <motion.span key={bono} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block tnum text-acento">{bono}</motion.span></span>
        </div>
        <div className="flex gap-[3px]" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => <span key={i} className={`h-[5px] flex-1 rounded-full ${i < 10 - bono ? "bg-white/15" : "bg-acento"}`} />)}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2.5 px-4">
        {CLASES.map((c) => {
          const on = res.includes(c.id);
          const wait = espera.includes(c.id);
          const full = c.libres === 0 && !on;
          const libres = on ? c.libres - 1 : c.libres;
          return (
            <motion.button key={c.id} type="button" whileTap={{ scale: 0.98 }} onClick={() => toggle(c)} aria-pressed={on}
              className={`flex flex-col gap-1.5 rounded-[16px] px-3.5 py-3 text-left transition-colors ${on ? "bg-white ring-[1.5px] ring-acento" : "bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.06)]"}`}>
              <span className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium tnum text-gris-500">{c.h} · {c.dur}</span>
                <span className={`rounded-full px-2.5 py-[3px] text-[10px] font-semibold ${on ? "bg-acento text-tinta" : wait ? "bg-papel text-gris-700" : full ? "bg-papel text-gris-400" : "bg-tinta text-white"}`}>
                  {on ? "Reservada" : wait ? "En espera" : full ? "Avisarme" : "Reservar"}
                </span>
              </span>
              <span className="truncate text-[14px] font-semibold leading-tight">{c.n}</span>
              <span className="text-[11px] text-gris-500">con {c.prof} · {full ? "completa" : `${libres} de ${c.total} plazas libres`}</span>
            </motion.button>
          );
        })}
      </div>
      <Hint>Toca una clase para reservarla</Hint>
      <Toast msg={msg} />
    </div>
  );
}

/* ---------------------------------------------------------------------
   PANTALLAS · CASO 2: stock e inventario
   --------------------------------------------------------------------- */
const PRODUCTOS = [
  { id: 1, n: "Caja cartón 40×30", sku: "EMB-040", q: 12, min: 50, u: "uds" },
  { id: 2, n: "Cinta adhesiva 48 mm", sku: "EMB-112", q: 86, min: 40, u: "uds" },
  { id: 3, n: "Etiquetas envío A6", sku: "ETQ-006", q: 340, min: 200, u: "uds" },
  { id: 4, n: "Film estirable 23 µm", sku: "EMB-230", q: 7, min: 10, u: "rollos" },
  { id: 5, n: "Palet europeo", sku: "PAL-120", q: 24, min: 15, u: "uds" },
];
const PASO_MOV = { 1: 10, 2: 6, 3: 50, 4: 2, 5: 4 };
function hora() { const d = new Date(); return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`; }

function StockScreen({ wide = false }) {
  const [q, setQ] = useState(() => Object.fromEntries(PRODUCTOS.map((p) => [p.id, p.q])));
  const [log, setLog] = useState([
    { id: "l1", t: "10:42", tipo: "out", txt: "6 cajas 40×30", ref: "Pedido #3311" },
    { id: "l2", t: "09:15", tipo: "in", txt: "200 etiquetas A6", ref: "Proveedor Graf" },
    { id: "l3", t: "08:30", tipo: "out", txt: "2 rollos de film", ref: "Muelle 2" },
  ]);
  const [msg, setMsg] = useToast();
  const mover = (p, dir) => {
    const n = PASO_MOV[p.id];
    setQ((s) => {
      const nuevo = Math.max(0, s[p.id] + dir * n);
      const antes = s[p.id] >= p.min;
      if (antes && nuevo < p.min) setMsg(`Stock bajo · ${p.n}`);
      else setMsg(`${dir > 0 ? "Entrada" : "Salida"} · ${n} ${p.u}`);
      return { ...s, [p.id]: nuevo };
    });
    setLog((l) => [{ id: `l${Date.now()}`, t: hora(), tipo: dir > 0 ? "in" : "out", txt: `${n} ${p.u} · ${p.n.split(" ")[0]}`, ref: dir > 0 ? "Entrada manual" : "Salida manual" }, ...l].slice(0, 6));
  };
  const bajos = PRODUCTOS.filter((p) => q[p.id] < p.min).length;

  const lista = (
    <div className="flex min-w-0 flex-col gap-1.5">
      {PRODUCTOS.map((p) => {
        const v = q[p.id];
        const low = v < p.min;
        const pct = Math.min(100, (v / (p.min * 2)) * 100);
        return (
          <div key={p.id} className="flex items-center gap-2.5 rounded-[12px] bg-white px-2.5 py-2 shadow-[0_0_0_1px_rgba(17,17,17,0.05)]">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[11.5px] font-semibold leading-tight">{p.n}</span>
                {low && <span className="shrink-0 rounded-full bg-aviso-suave px-1.5 py-[1px] text-[8.5px] font-semibold text-aviso-texto">Bajo</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-[4px] flex-1 overflow-hidden rounded-full bg-gris-100">
                  <motion.span className={`block h-full rounded-full ${low ? "bg-aviso" : "bg-tinta"}`} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease }} />
                </span>
                <span className="w-[52px] text-right text-[10px] tnum text-gris-500"><b className="font-semibold text-tinta">{v}</b> / {p.min}</span>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button type="button" onClick={() => mover(p, -1)} aria-label={`Registrar salida de ${p.n}`} className="flex h-7 w-7 items-center justify-center rounded-full bg-papel text-[14px] font-semibold hover:bg-gris-100">−</button>
              <button type="button" onClick={() => mover(p, 1)} aria-label={`Registrar entrada de ${p.n}`} className="flex h-7 w-7 items-center justify-center rounded-full bg-tinta text-[14px] font-semibold text-white">+</button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-[#FAFAF8] font-sys text-tinta">
      {!wide && <StatusBar />}
      <div className={wide ? "flex items-end justify-between gap-2 px-[3.5%] pt-[3%]" : ""}>
        {wide ? (
          <>
            <div className="flex min-w-0 flex-col">
              <span className="text-[11px] font-medium text-gris-400">Almacén Norte · inventario</span>
              <span className="text-[clamp(15px,2.2vw,22px)] font-bold tracking-[-0.02em]">Stock</span>
            </div>
            <span className="rounded-full bg-tinta px-3 py-1.5 text-[10.5px] font-semibold text-white">Exportar a Excel</span>
          </>
        ) : (
          <AppHeader eyebrow="Almacén Norte" title="Stock" />
        )}
      </div>
      <AnimatePresence>
        {bajos > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`overflow-hidden ${wide ? "px-[3.5%]" : "px-4"}`}>
            <div className="mt-2.5 flex items-center gap-2 rounded-[12px] bg-aviso-suave px-3 py-2 text-[11px] font-semibold text-aviso-texto">
              <span className="h-1.5 w-1.5 rounded-full bg-aviso" />
              {bajos} {bajos === 1 ? "producto" : "productos"} por debajo del mínimo
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {wide ? (
        <div className="grid min-h-0 flex-1 grid-cols-[1.5fr_1fr] gap-[2.5%] p-[3.5%] pt-[2.5%]">
          {lista}
          <div className="flex min-w-0 flex-col gap-1 rounded-[14px] bg-white p-2.5 shadow-[0_0_0_1px_rgba(17,17,17,0.05)]">
            <span className="pb-1 text-[11px] font-semibold">Movimientos de hoy</span>
            <AnimatePresence initial={false}>
              {log.slice(0, 5).map((m) => (
                <motion.div key={m.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 border-b border-gris-100 py-1.5 last:border-0">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${m.tipo === "in" ? "bg-tinta text-white" : "bg-papel"}`}>{m.tipo === "in" ? "↓" : "↑"}</span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[10.5px] font-semibold">{m.txt}</span>
                    <span className="truncate text-[9px] text-gris-400">{m.ref}</span>
                  </span>
                  <span className="text-[9.5px] tnum text-gris-400">{m.t}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="mt-3 px-4">{lista}</div>
      )}
      {!wide && <Hint>Usa + y − para mover stock</Hint>}
      <Toast msg={msg} />
    </div>
  );
}

/* ---------------------------------------------------------------------
   PANTALLAS · CASO 3: agenda de una profesional independiente
   --------------------------------------------------------------------- */
const CITAS = [
  { id: 1, h: "9:00", n: "Jordi Pons", s: "Primera visita · 60 min", estado: "ok" },
  { id: 2, h: "10:15", n: "Ana Roca", s: "Seguimiento · 45 min", estado: "pend" },
  { id: 3, h: "11:30", n: null, s: "Hueco libre", estado: "libre" },
  { id: 4, h: "12:30", n: "Carles Mas", s: "Sesión · 45 min", estado: "pend" },
  { id: 5, h: "16:00", n: "Laia Soler", s: "Sesión · 45 min", estado: "ok" },
];
function AgendaScreen() {
  const [citas, setCitas] = useState(CITAS);
  const [msg, setMsg] = useToast(2000);
  const accion = (c) => {
    if (c.estado === "pend") {
      setCitas((l) => l.map((x) => (x.id === c.id ? { ...x, estado: "env" } : x)));
      setMsg(`Recordatorio enviado a ${c.n.split(" ")[0]} por WhatsApp`);
      setTimeout(() => setCitas((l) => l.map((x) => (x.id === c.id ? { ...x, estado: "ok" } : x))), 1800);
    } else if (c.estado === "libre") setMsg("Enlace de reserva copiado");
  };
  const confirmadas = citas.filter((c) => c.estado === "ok").length;
  return (
    <div className="flex h-full flex-col bg-[#FAFAF8] font-sys text-tinta">
      <StatusBar />
      <AppHeader eyebrow="Marta Vidal · Fisioterapia" title="Jueves 30" right={<span className="pb-1 text-[11px] font-semibold tnum text-gris-500">{confirmadas}/4 confirmadas</span>} />
      <div className="mt-3 flex flex-col gap-2 px-4">
        {citas.map((c) => (
          <div key={c.id} className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 ${c.estado === "libre" ? "border border-dashed border-gris-200" : "bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.05)]"}`}>
            <span className="w-9 text-[12px] font-semibold tnum">{c.h}</span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className={`truncate text-[12.5px] font-semibold leading-tight ${c.estado === "libre" ? "text-gris-400" : ""}`}>{c.n || "Libre"}</span>
              <span className="truncate text-[10.5px] text-gris-400">{c.s}</span>
            </span>
            {c.estado === "ok" && <span className="flex items-center gap-1 text-[9.5px] font-semibold text-gris-500"><Ticks /> Confirmó</span>}
            {c.estado === "env" && <span className="flex items-center gap-1 text-[9.5px] font-semibold text-gris-500"><Ticks read={false} /> Enviado</span>}
            {c.estado === "pend" && <button type="button" onClick={() => accion(c)} className="rounded-full bg-tinta px-2.5 py-1 text-[9.5px] font-semibold text-white">Recordar</button>}
            {c.estado === "libre" && <button type="button" onClick={() => accion(c)} className="rounded-full bg-papel px-2.5 py-1 text-[9.5px] font-semibold">Compartir</button>}
          </div>
        ))}
      </div>
      <Hint>Toca «Recordar» en una cita</Hint>
      <Toast msg={msg} />
    </div>
  );
}

/* ---------------------------------------------------------------------
   PANTALLAS · WhatsApp (lista de chats y conversación)
   --------------------------------------------------------------------- */
function Burbuja({ from, children, time, read, delay = 0 }) {
  const me = from === "me";
  return (
    <motion.div initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease, delay }}
      className={`relative max-w-[82%] rounded-[9px] px-2 pb-1 pt-1.5 text-[12px] leading-[1.35] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${me ? "self-end rounded-tr-[2px] bg-wa-out" : "self-start rounded-tl-[2px] bg-white"}`}>
      <span className={`absolute top-0 h-2.5 w-2 ${me ? "-right-[6px] bg-wa-out" : "-left-[6px] bg-white"}`} style={{ clipPath: me ? "polygon(0 0,100% 0,0 100%)" : "polygon(0 0,100% 0,100% 100%)" }} aria-hidden="true" />
      <span className="whitespace-pre-line text-wa-texto">{children}</span>
      <span className="float-right ml-2 mt-1.5 flex items-center gap-0.5 text-[9px] leading-none text-wa-gris">{time}{me && <Ticks read={read} className="w-[13px]" />}</span>
    </motion.div>
  );
}

function WAChat({ name, sub = "Cuenta de empresa", msgs, delayStep = 0.6 }) {
  return (
    <div className="flex h-full flex-col font-sys">
      <div className="bg-wa-barra">
        <StatusBar />
        <div className="flex items-center gap-2 px-3 pb-2 pt-1.5">
          <span className="text-[17px] leading-none text-wa-boton" aria-hidden="true">‹</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tinta font-sans text-[13px] font-bold text-white">{name?.[0]}</span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-center gap-1 truncate text-[12.5px] font-semibold text-wa-texto">
              {name}
              <svg viewBox="0 0 12 12" className="h-3 w-3" aria-label="Cuenta verificada"><circle cx="6" cy="6" r="6" fill="#25D366" /><path d="M3.4 6.2 5.2 8l3.4-3.8" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="truncate text-[9.5px] text-wa-gris">{sub}</span>
          </span>
        </div>
      </div>
      <div className="wa-wall flex flex-1 flex-col gap-1.5 overflow-hidden px-3 py-3">
        <span className="mx-auto mb-1 rounded-[6px] bg-white/90 px-2 py-[3px] text-[9.5px] font-medium text-wa-gris shadow-[0_1px_0.5px_rgba(11,20,26,0.1)]">HOY</span>
        {msgs.map((m, i) => <Burbuja key={i} {...m} delay={i * delayStep} />)}
      </div>
      <div className="flex items-center gap-1.5 bg-wa-barra px-2 py-2">
        <span className="flex-1 rounded-full bg-white px-3 py-1.5 text-[11px] text-wa-gris">Mensaje</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-wa-boton text-white" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.1A7 7 0 0 0 19 12Z" fill="currentColor" /></svg>
        </span>
      </div>
    </div>
  );
}

const MSGS_CITA = [
  { from: "them", time: "19:30", children: "Hola Ana, te escribe Marta Vidal Fisioterapia. Mañana tienes cita a las 10:15.\n\n¿La confirmas?" },
  { from: "me", time: "19:41", read: true, children: "Sí, ahí estaré. Gracias!" },
  { from: "them", time: "19:41", children: "Perfecto. Te esperamos en C/ Verdi 42." },
];

// Boceto: la app "en diseño"
function WireframeScreen() {
  return (
    <div className="flex h-full flex-col gap-3 bg-[#FAFAF8] px-4 pt-14">
      <motion.div className="h-2.5 w-20 rounded-full bg-gris-200" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0 }} />
      <motion.div className="h-5 w-32 rounded-full bg-gris-300" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.1 }} style={{ originX: 0 }} />
      <motion.div className="mt-1 h-12 rounded-[14px] border-[1.5px] border-dashed border-acento/60 bg-acento-suave" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} />
      {[0, 1, 2, 3].map((i) => (
        <motion.div key={i} className="flex items-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-gris-200 px-3 py-2.5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
          <span className="h-2 w-7 rounded-full bg-gris-200" />
          <span className="flex flex-1 flex-col gap-1.5"><span className="h-2 rounded-full bg-gris-200" style={{ width: `${72 - i * 9}%` }} /><span className="h-1.5 w-1/3 rounded-full bg-gris-100" /></span>
          <span className="h-5 w-12 rounded-full bg-gris-100" />
        </motion.div>
      ))}
      <span className="mt-auto pb-6 text-center font-mono text-[9.5px] uppercase tracking-[0.1em] text-gris-400">Boceto · versión 1</span>
    </div>
  );
}

// Pantallas del proceso de trabajo
const MSGS_NECESIDAD = [
  { from: "me", time: "10:02", read: true, children: "Hola! Tengo un estudio de pilates y paso el día contestando mensajes para reservar." },
  { from: "them", time: "10:05", children: "¡Hola! Cuéntanos cómo lo gestionas hoy y qué te gustaría resolver." },
  { from: "me", time: "10:09", read: true, children: "Quiero que las alumnas reserven solas y que el bono se descuente solo." },
];

function ReunionScreen() {
  return (
    <div className="flex h-full flex-col bg-[#FAFAF8] font-sys text-tinta">
      <StatusBar />
      <AppHeader eyebrow="Calendario · martes 4" title="Tu reunión" />
      <div className="mx-4 mt-5 flex flex-col gap-3 rounded-[18px] bg-white p-4 shadow-[0_0_0_1px_rgba(17,17,17,0.06)]">
        <span className="h-1 w-10 rounded-full bg-gradient-to-r from-grad-a to-grad-b" />
        <span className="text-[16px] font-bold leading-tight">Primera reunión</span>
        <span className="text-[12px] text-gris-500">Martes 4 · 10:00 – 10:45</span>
        <span className="text-[12px] text-gris-500">Videollamada</span>
        <div className="mt-1 flex -space-x-2">
          {["PU", "LS", "DC"].map((x, i) => <span key={x} className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-white ${i === 0 ? "bg-tinta text-white" : "bg-acento-suave text-acento-texto"}`}>{x}</span>)}
        </div>
      </div>
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
        <span className="rounded-full bg-tinta py-2 text-center text-[11px] font-semibold text-white">Aceptar</span>
        <span className="rounded-full bg-papel py-2 text-center text-[11px] font-semibold">Proponer otra hora</span>
      </div>
    </div>
  );
}

function PresupuestoScreen() {
  const items = ["Reservas online", "Bonos y lista de espera", "Recordatorios por WhatsApp", "Tu marca y tu dominio"];
  return (
    <div className="flex h-full flex-col bg-[#FAFAF8] font-sys text-tinta">
      <StatusBar />
      <AppHeader eyebrow="Para Estudio Arrel" title="Tu presupuesto" />
      <div className="mx-4 mt-5 flex flex-col gap-3 rounded-[18px] bg-white p-4 shadow-[0_0_0_1px_rgba(17,17,17,0.06)]">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold">Versión 1</span>
          <span className="rounded-full bg-acento-suave px-2 py-[3px] text-[10px] font-semibold text-acento-texto">A medida</span>
        </div>
        {items.map((t, i) => (
          <motion.span key={t} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="flex items-center gap-2 text-[12.5px]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-tinta"><svg viewBox="0 0 12 12" className="w-2"><path d="M2.5 6.3 5 8.6 9.5 3.4" fill="none" stroke="#FF4F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            {t}
          </motion.span>
        ))}
      </div>
      <span className="mx-4 mt-3 rounded-full bg-tinta py-2.5 text-center text-[11.5px] font-semibold text-white">Ver presupuesto completo</span>
    </div>
  );
}

function FeedbackScreen() {
  return (
    <div className="relative h-full">
      <WireframeScreen />
      {[{ t: "Botón de reservar más grande", c: "left-3 top-[118px]" }, { t: "Añadir lista de espera", c: "right-3 top-[250px]" }].map((n, i) => (
        <motion.span key={n.t} initial={{ opacity: 0, scale: 0.8, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.25, ease }}
          className={`absolute ${n.c} max-w-[150px] rounded-[12px] rounded-bl-[3px] bg-tinta px-2.5 py-1.5 text-[10.5px] font-semibold leading-snug text-white shadow-lg`}>
          {n.t}
        </motion.span>
      ))}
    </div>
  );
}

const SCREENS = { pilates: PilatesScreen, stock: StockScreen, agenda: AgendaScreen };

/* ---------------------------------------------------------------------
   EFECTOS: inclinación 3D, manchas difuminadas, foco que sigue al cursor
   --------------------------------------------------------------------- */
function Tilt({ children, max = 6, className = "" }) {
  const simple = useSimple();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const move = (e) => {
    if (simple || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
  };
  return (
    <div onPointerMove={move} onPointerLeave={() => { rx.set(0); ry.set(0); }} className={className} style={{ perspective: 1200 }}>
      <motion.div style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}>{children}</motion.div>
    </div>
  );
}

function Blob({ className = "", color = "rgba(255,79,0,0.2)", drift = true }) {
  const simple = useSimple();
  return (
    <motion.div aria-hidden="true" className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }}
      animate={simple || !drift ? undefined : { x: [0, 40, -24, 0], y: [0, -28, 18, 0], scale: [1, 1.1, 0.95, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
  );
}

function spot(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}

// Título de sección que se asienta al entrar (visible desde el primer fotograma)
function RevealTitle({ children, className = "", id, as: Tag = "h2" }) {
  const simple = useSimple();
  const words = String(children).split(" ");
  if (simple) return <Tag id={id} className={className}>{children}</Tag>;
  return (
    <Tag id={id} className={className}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="-mt-[0.15em] inline-block overflow-hidden pb-[0.1em] pt-[0.15em] align-bottom">
            <motion.span className="inline-block" initial={{ y: "40%", opacity: 0.2 }} whileInView={{ y: "0%", opacity: 1 }} viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease, delay: i * 0.04 }}>{w}</motion.span>
          </span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/* ---------------------------------------------------------------------
   SECCIÓN: Soluciones
   Frase que se escribe con el scroll + selector de soluciones con vista previa animada.
   --------------------------------------------------------------------- */
function Word({ children, progress, range }) {
  const reduce = useReducedMotion();
  const color = useTransform(progress, range, reduce ? ["#111111", "#111111"] : ["#CFCFCB", "#111111"]);
  return <motion.span style={{ color }}>{children} </motion.span>;
}

const TARJETA = "rounded-[14px] bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.06),0_10px_24px_-14px_rgba(17,17,17,0.25)]";
const OK = <svg viewBox="0 0 12 12" className="w-2.5"><path d="M2.5 6.3 5 8.6 9.5 3.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

// Vista previa animada de cada solución (sin datos reales: es ilustrativa)
function SolVisual({ k }) {
  const t = useTick(1300);
  if (k === "reservas") {
    const horas = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "16:00", "16:30", "17:00", "17:30"];
    const on = [2, 6, 10, 7][t % 4];
    return (
      <div className="grid w-full max-w-[360px] grid-cols-4 gap-2">
        {horas.map((h, i) => {
          const ocup = [1, 4, 9].includes(i);
          return (
            <motion.span key={h} animate={{ scale: i === on ? 1.08 : 1 }} transition={{ duration: 0.35, ease }}
              className={`flex h-12 items-center justify-center rounded-[12px] text-[12.5px] font-semibold tnum transition-colors duration-300 ${i === on ? "bg-gradient-to-br from-grad-a to-grad-b text-tinta shadow-[0_10px_22px_-8px_rgba(255,79,0,0.7)]" : ocup ? "bg-gris-100 text-gris-300 line-through" : TARJETA}`}>
              {h}
            </motion.span>
          );
        })}
      </div>
    );
  }
  if (k === "citas") {
    const n = t % 4;
    return (
      <div className="flex w-full max-w-[340px] flex-col gap-2.5">
        {[["Ana Roca", "10:15"], ["Marc Puig", "12:30"], ["Laia Soler", "16:00"]].map(([nom, h], i) => {
          const ok = i < n;
          return (
            <div key={nom} className={`flex items-center gap-3 px-4 py-3 ${TARJETA}`}>
              <span className="text-[13px] font-semibold tnum text-gris-500">{h}</span>
              <span className="flex-1 text-[14px] font-semibold">{nom}</span>
              <motion.span key={String(ok)} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${ok ? "bg-tinta text-white" : "bg-papel text-gris-500"}`}>
                {ok ? <>{OK} Confirmada</> : "Pendiente"}
              </motion.span>
            </div>
          );
        })}
      </div>
    );
  }
  if (k === "agendas") {
    const filas = [["Marta", [[8, 30], [52, 22]]], ["Pau", [[20, 26], [64, 24]]], ["Clara", [[4, 18], [36, 30], [76, 16]]]];
    return (
      <div className={`relative w-full max-w-[380px] p-4 ${TARJETA}`}>
        <div className="mb-2 flex justify-between pl-14 text-[10.5px] font-medium text-gris-400 tnum"><span>9:00</span><span>13:00</span><span>17:00</span></div>
        {filas.map(([n, bloques], r) => (
          <div key={n} className="flex items-center gap-3 py-1.5">
            <span className="w-11 text-[12.5px] font-semibold">{n}</span>
            <div className="relative h-7 flex-1 rounded-[8px] bg-papel">
              {bloques.map(([l, w], i) => <span key={i} className={`absolute inset-y-1 rounded-[6px] ${r === 1 && i === 0 ? "bg-gradient-to-r from-grad-a to-grad-b" : "bg-tinta"}`} style={{ left: `${l}%`, width: `${w}%` }} />)}
            </div>
          </div>
        ))}
        <motion.span aria-hidden="true" className="absolute bottom-3 top-9 w-[2px] rounded-full bg-acento" animate={{ left: `${30 + (t % 8) * 7.5}%` }} transition={{ duration: 1.2, ease: "linear" }} />
      </div>
    );
  }
  if (k === "stock") {
    const sets = [[78, 52, 16, 64], [70, 48, 30, 58], [62, 44, 12, 70]];
    const v = sets[t % 3];
    return (
      <div className={`flex w-full max-w-[360px] flex-col gap-3 p-4 ${TARJETA}`}>
        {["Cajas", "Etiquetas", "Film", "Palets"].map((n, i) => {
          const low = v[i] < 25;
          return (
            <div key={n} className="flex items-center gap-3">
              <span className="w-[72px] text-[12.5px] font-semibold">{n}</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-gris-100">
                <motion.span className={`block h-full rounded-full ${low ? "bg-aviso" : "bg-tinta"}`} animate={{ width: `${v[i]}%` }} transition={{ duration: 0.6, ease }} />
              </span>
              <span className={`w-[52px] text-right text-[10.5px] font-semibold ${low ? "text-aviso-texto" : "text-gris-400"}`}>{low ? "Pedir" : "OK"}</span>
            </div>
          );
        })}
      </div>
    );
  }
  if (k === "presupuestos") {
    const items = ["Reservas online", "Bonos y lista de espera", "Recordatorios", "Tu marca y dominio"];
    const n = t % (items.length + 2);
    return (
      <div className={`flex w-full max-w-[320px] flex-col gap-2.5 p-5 ${TARJETA}`}>
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold">Presupuesto · v1</span>
          <AnimatePresence>{n > items.length && <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="rounded-full bg-tinta px-2.5 py-1 text-[10.5px] font-semibold text-white">Enviado</motion.span>}</AnimatePresence>
        </div>
        {items.map((x, i) => (
          <motion.span key={x} animate={{ opacity: i < n ? 1 : 0.25, x: i < n ? 0 : 6 }} transition={{ duration: 0.35, ease }} className="flex items-center gap-2 text-[13px]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-tinta text-acento">{OK}</span>{x}
          </motion.span>
        ))}
      </div>
    );
  }
  if (k === "datos") {
    const on = t % 4;
    return (
      <div className={`flex w-full max-w-[340px] flex-col gap-1 p-3 ${TARJETA}`}>
        <span className="mb-1 rounded-[10px] border border-linea px-3 py-2 text-[12px] text-gris-400">Buscar cliente…</span>
        {[["Ana Puig", "Cliente desde 2024"], ["Hotel Mirador", "Pedido mensual"], ["Jordi Torres", "Última compra: ayer"], ["Clara Ferrer", "3 reservas este mes"]].map(([n, d], i) => (
          <motion.div key={n} animate={{ x: i === on ? 6 : 0, backgroundColor: i === on ? "#111111" : "#FFFFFF" }} transition={{ duration: 0.35, ease }} className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${i === on ? "bg-acento text-tinta" : "bg-papel"}`}>{n.split(" ").map((w) => w[0]).join("")}</span>
            <span className="flex flex-col"><span className={`text-[12.5px] font-semibold ${i === on ? "text-white" : ""}`}>{n}</span><span className={`text-[10.5px] ${i === on ? "text-white/60" : "text-gris-400"}`}>{d}</span></span>
          </motion.div>
        ))}
      </div>
    );
  }
  if (k === "dashboards") {
    const a = t % 2 === 0;
    const kpis = a ? [["Reservas", "142"], ["Ocupación", "86%"], ["Clientes", "38"]] : [["Reservas", "158"], ["Ocupación", "91%"], ["Clientes", "41"]];
    const bars = a ? [52, 70, 64, 88, 80, 46, 22] : [60, 74, 70, 92, 84, 50, 28];
    const max = Math.max(...bars);
    return (
      <div className="flex w-full max-w-[380px] flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-2">
          {kpis.map(([l, v]) => (
            <div key={l} className={`flex flex-col px-3 py-2.5 ${TARJETA}`}>
              <span className="text-[10.5px] text-gris-400">{l}</span>
              <motion.span key={v} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[20px] font-bold tracking-[-0.03em] tnum">{v}</motion.span>
            </div>
          ))}
        </div>
        <div className={`flex h-[120px] items-end gap-2 p-3 ${TARJETA}`}>
          {bars.map((b, i) => <motion.span key={i} className={`flex-1 rounded-[6px] ${b === max ? "bg-gradient-to-t from-grad-a to-grad-b" : "bg-tinta"}`} animate={{ height: `${(b / max) * 100}%` }} transition={{ duration: 0.6, ease, delay: i * 0.03 }} />)}
        </div>
      </div>
    );
  }
  if (k === "analisis") {
    const pts = [[0, 70], [16, 58], [33, 62], [50, 30], [66, 44], [83, 38], [100, 52]];
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x * 3.2 + 10} ${y * 1.4 + 10}`).join(" ");
    return (
      <div className={`relative w-full max-w-[380px] p-4 ${TARJETA}`}>
        <span className="text-[12px] font-semibold text-gris-500">Reservas por día</span>
        <svg viewBox="0 0 340 130" className="mt-2 w-full" aria-hidden="true">
          {[30, 65, 100].map((y) => <line key={y} x1="10" x2="330" y1={y} y2={y} stroke="#EFEFEC" />)}
          <motion.path key={t % 3} d={d} fill="none" stroke="#111111" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease }} />
          <motion.circle key={`c${t % 3}`} cx={50 * 3.2 + 10} cy={30 * 1.4 + 10} r="6" fill="#FF4F00" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }} />
        </svg>
        <motion.span key={`l${t % 3}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="absolute right-6 top-4 rounded-full bg-tinta px-2.5 py-1 text-[10.5px] font-semibold text-white">El jueves, el día más lleno</motion.span>
      </div>
    );
  }
  // soporte
  const n = t % 4;
  return (
    <div className="flex w-full max-w-[320px] flex-col gap-2">
      <motion.span initial={false} animate={{ opacity: n >= 1 ? 1 : 0, y: n >= 1 ? 0 : 8 }} className="self-end rounded-[16px] rounded-br-[4px] bg-tinta px-3.5 py-2.5 text-[13px] text-white">¿Podemos sumar un campo para el teléfono?</motion.span>
      <motion.span initial={false} animate={{ opacity: n >= 2 ? 1 : 0, y: n >= 2 ? 0 : 8 }} className={`self-start px-3.5 py-2.5 text-[13px] ${TARJETA} rounded-bl-[4px]`}>Claro, lo vemos ahora.</motion.span>
      <motion.span initial={false} animate={{ opacity: n >= 3 ? 1 : 0, y: n >= 3 ? 0 : 8 }} className={`flex items-center gap-2 self-start px-3.5 py-2.5 text-[13px] font-semibold ${TARJETA} rounded-bl-[4px]`}>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-acento text-tinta">{OK}</span>Hecho, ya está en tu app.
      </motion.span>
    </div>
  );
}

function Soluciones() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const text = "Diseñamos la herramienta exacta que tu negocio necesita hoy. Y la hacemos crecer al ritmo que cambia tu día a día.";
  const words = text.split(" ");
  const [act, setAct] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || reduce) return;
    const id = setInterval(() => setAct((a) => (a + 1) % SOLUCIONES.length), 3600);
    return () => clearInterval(id);
  }, [auto, reduce]);
  const pick = (i) => { setAct(i); setAuto(false); };
  const sol = SOLUCIONES[act];

  return (
    <section id="soluciones" aria-labelledby="soluciones-title" className="relative scroll-mt-16 overflow-hidden bg-white">
      <Blob className="-right-40 top-0 h-[420px] w-[420px]" color="rgba(255,79,0,0.12)" />
      <div className="container-page relative flex flex-col gap-14 py-24 md:gap-20 md:py-36">
        <div ref={ref} className="flex flex-col gap-6">
          <Eyebrow>Soluciones</Eyebrow>
          <h2 id="soluciones-title" className="max-w-[22ch] text-[clamp(2rem,5vw,4.2rem)] font-bold leading-[1.06] tracking-[-0.04em]">
            {words.map((w, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          {/* Escritorio: lista vertical */}
          <div role="tablist" aria-label="Soluciones" aria-orientation="vertical" className="hidden flex-col lg:flex">
            {SOLUCIONES.map((x, i) => (
              <button key={x.k} type="button" role="tab" id={`sol-tab-${i}`} aria-selected={i === act} aria-controls="sol-panel" onClick={() => pick(i)} onPointerEnter={(e) => e.pointerType === "mouse" && pick(i)}
                className="group relative flex items-center justify-between gap-4 border-t border-linea py-[14px] text-left last:border-b">
                {i === act && (
                  <motion.span layoutId="sol-barra" className="absolute -top-px left-0 h-[2px] w-full origin-left bg-gradient-to-r from-grad-a to-grad-b" transition={{ type: "spring", stiffness: 380, damping: 36 }}>
                    {auto && !reduce && <motion.span key={act} className="absolute inset-0 origin-left bg-tinta/15" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3.6, ease: "linear" }} />}
                  </motion.span>
                )}
                <span className={`text-[clamp(1.5rem,2.3vw,2rem)] font-bold leading-none tracking-[-0.035em] transition-colors duration-300 ${i === act ? "text-tinta" : "text-gris-300 group-hover:text-gris-500"}`}>{x.t}</span>
                <motion.span aria-hidden="true" animate={{ x: i === act ? 0 : -8, opacity: i === act ? 1 : 0 }} className="text-[20px] text-acento-texto">→</motion.span>
              </button>
            ))}
          </div>

          {/* Móvil: chips con scroll horizontal */}
          <div role="tablist" aria-label="Soluciones" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:hidden">
            {SOLUCIONES.map((x, i) => (
              <button key={x.k} type="button" role="tab" aria-selected={i === act} aria-controls="sol-panel" onClick={() => pick(i)}
                className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${i === act ? "bg-tinta text-white" : "bg-papel text-gris-500"}`}>
                {x.t}
              </button>
            ))}
          </div>

          {/* Vista previa */}
          <div id="sol-panel" role="tabpanel" aria-label={sol.t} className="lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-papel via-[#F7F3F0] to-[#FFEADF] p-5 md:p-10">
              <Blob className="-bottom-24 -right-16 h-[360px] w-[360px]" color="rgba(255,79,0,0.2)" />
              <div className="relative flex h-[270px] items-center justify-center md:h-[320px]">
                <AnimatePresence mode="wait">
                  <motion.div key={sol.k} className="flex w-full justify-center" initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14, scale: 0.98 }} transition={{ duration: 0.4, ease }}>
                    <SolVisual k={sol.k} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="relative mt-6 min-h-[88px] border-t border-tinta/10 pt-5">
                <AnimatePresence mode="wait">
                  <motion.div key={sol.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }} className="flex flex-col gap-1.5">
                    <h3 className="text-[clamp(1.4rem,2.2vw,1.75rem)] font-bold tracking-[-0.03em]">{sol.t}</h3>
                    <p className="max-w-[48ch] text-[16px] leading-relaxed text-gris-500">{sol.d}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------
   SECCIÓN: Nav (cristal)
   --------------------------------------------------------------------- */
function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 16));
  return (
    <header className={`sticky z-50 transition-[box-shadow,background-color] duration-300 ${solid ? "glass shadow-[0_1px_0_rgba(17,17,17,0.06)]" : "bg-white"}`} style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <a href="#top" aria-label="PULSE, inicio"><Wordmark className="h-[15px] w-auto md:h-[17px]" /></a>
        <nav className="hidden items-center gap-8 text-[14px] font-medium text-gris-500 lg:flex">
          <a href="#soluciones" className="transition-colors hover:text-tinta">Soluciones</a>
          <a href="#ejemplos" className="transition-colors hover:text-tinta">Ejemplos</a>
          <a href="#clientes" className="transition-colors hover:text-tinta">Clientes</a>
          <a href="#trabajamos" className="transition-colors hover:text-tinta">Cómo trabajamos</a>
          <a href="#preguntas" className="transition-colors hover:text-tinta">Preguntas</a>
        </nav>
        <a href="#contacto" className="inline-flex min-h-[40px] items-center rounded-full bg-tinta px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2a2a2a]">Hablemos</a>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------------
   SECCIÓN: Hero (titular con palabra rotatoria + escenario con avisos)
   --------------------------------------------------------------------- */
const HERO_AVISOS = {
  pilates: [
    { icon: "wa", app: "WhatsApp", title: "Laura Puig", body: "¿Me pasas a la clase de las 19:30?", time: "ahora", pos: "left-[-300px] top-[60px]" },
    { icon: "pulse", app: "Arrel Reservas", title: "Nueva reserva", body: "Reformer · jueves 9:00 · quedan 2 plazas", time: "hace 2 min", pos: "right-[-310px] top-[200px]" },
  ],
  stock: [
    { icon: "box", app: "Almacén Norte", title: "Stock bajo", body: "Caja cartón 40×30 · quedan 12 uds (mín. 50)", time: "ahora", pos: "left-[-310px] top-[90px]" },
    { icon: "pulse", app: "Almacén Norte", title: "Pedido #3312 preparado", body: "Sale hoy por el muelle 2", time: "hace 5 min", pos: "right-[-300px] top-[230px]" },
  ],
  agenda: [
    { icon: "wa", app: "WhatsApp", title: "Ana Roca", body: "Sí, ahí estaré. Gracias!", time: "ahora", pos: "left-[-300px] top-[70px]" },
    { icon: "cal", app: "Calendario", title: "Nueva cita · Carles Mas", body: "Jueves 30, 12:30 – 13:15", time: "hace 1 min", pos: "right-[-300px] top-[220px]" },
  ],
};

function Hero() {
  const reduce = useReducedMotion();
  const simple = useSimple();
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const caso = CASOS[idx];
  const Screen = SCREENS[caso.id];

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % CASOS.length), 4200);
    return () => clearInterval(id);
  }, [paused, reduce]);
  const pick = (i) => { setIdx(i); setPaused(true); };

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const k = simple ? 0 : 1;
  const sp = { stiffness: 100, damping: 24 };
  const phoneY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -80 * k]), sp);
  const phoneS = useSpring(useTransform(scrollYProgress, [0, 0.8], [1, 1 + 0.06 * k]), sp);
  const leftX = useTransform(scrollYProgress, [0, 1], [0, -60 * k]);
  const rightX = useTransform(scrollYProgress, [0, 1], [0, 60 * k]);
  const avisosY = useTransform(scrollYProgress, [0, 1], [0, -40 * k]);
  const glow = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative overflow-hidden bg-white">
      <div className="container-page flex flex-col items-center gap-8 pt-14 text-center md:pt-24">
        <h1 id="hero-title" aria-label="Organiza tu negocio con una app a tu medida" className="text-portada">
          <span aria-hidden="true" className="block">Organiza{" "}
            <span className="relative inline-grid h-[1.08em] overflow-hidden align-bottom">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={caso.id} className="col-start-1 row-start-1 whitespace-nowrap bg-gradient-to-r from-acento-texto to-acento bg-clip-text pb-[0.06em] text-transparent"
                  initial={{ y: reduce ? 0 : "105%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} exit={{ y: reduce ? 0 : "-105%", opacity: 0 }} transition={{ duration: 0.6, ease }}>
                  {caso.word}
                </motion.span>
              </AnimatePresence>
              <motion.span key={`u-${caso.id}`} aria-hidden="true" className="absolute inset-x-0 bottom-[0.04em] h-[0.07em] origin-left rounded-full bg-gradient-to-r from-grad-a to-grad-b"
                initial={{ scaleX: reduce ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, ease, delay: 0.25 }} />
            </span>
          </span>
          <span aria-hidden="true" className="block">con una app a tu medida.</span>
        </h1>

        <p className="max-w-[54ch] text-entrada text-gris-500 md:text-[19px]">
          Desarrollamos una app que se ajusta a las necesidades de tu proyecto o negocio. Gestionamos tus reservas, stock o base de datos y diseñamos una app con tu identidad, conectada a las herramientas que ya utilizas.
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-2">
          {["Sin gastos fijos de mantenimiento ni comisiones", "Fácil e intuitiva"].map((t) => (
            <li key={t} className="inline-flex items-center gap-2 rounded-full bg-papel px-3.5 py-1.5 text-left text-[13px] font-medium leading-snug text-gris-700 sm:text-[13.5px]">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-tinta"><svg viewBox="0 0 12 12" className="w-2"><path d="M2.5 6.3 5 8.6 9.5 3.4" fill="none" stroke="#FF4F00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              {t}
            </li>
          ))}
        </ul>

        <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Button href="#contacto" variant="dark" className="w-full sm:w-auto">Cuéntanos qué necesitas</Button>
          <Button href="#ejemplos" variant="light" className="w-full sm:w-auto">Ejemplos</Button>
        </div>
      </div>

      {/* Escenario */}
      <div className="container-page relative mt-14 flex flex-col items-center pb-24 md:mt-20 md:pb-32">
        <motion.div aria-hidden="true" style={{ scale: glow }} className="pointer-events-none absolute left-1/2 top-[38%] h-[420px] w-[min(900px,100%)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,#FFE6D8,rgba(255,255,255,0))]" />

        <div role="tablist" aria-label="Elige un ejemplo" className="relative z-10 mb-8 flex max-w-full gap-1 overflow-x-auto rounded-full bg-papel p-1 no-scrollbar">
          {CASOS.map((c, i) => (
            <button key={c.id} type="button" role="tab" aria-selected={i === idx} onClick={() => pick(i)}
              className={`relative shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors sm:px-4 ${i === idx ? "text-tinta" : "text-gris-500 hover:text-tinta"}`}>
              {i === idx && <motion.span layoutId="hero-seg" className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(17,17,17,0.12),0_0_0_1px_rgba(17,17,17,0.04)]" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
              <span className="relative"><span className="sm:hidden">{c.corto}</span><span className="hidden sm:inline">{c.tab}</span></span>
            </button>
          ))}
        </div>

        <motion.div style={{ y: phoneY, scale: phoneS }} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.2 }} className="relative">
          <Tilt max={7}><Phone label={`Ejemplo de app: ${caso.tab}`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={caso.id} className="h-full" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.35, ease }}>
                <Screen />
              </motion.div>
            </AnimatePresence>
          </Phone></Tilt>

          {/* Avisos flotantes (solo escritorio) */}
          {!simple && (
            <motion.div style={{ y: avisosY }} className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
              <AnimatePresence mode="wait">
                <motion.div key={caso.id} className="absolute inset-0">
                  {HERO_AVISOS[caso.id].map((a, i) => (
                    <motion.div key={a.title} style={{ x: i === 0 ? leftX : rightX }} className={`absolute ${a.pos}`}>
                      <motion.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ opacity: { duration: 0.5, delay: 0.15 + i * 0.35 }, scale: { duration: 0.5, delay: 0.15 + i * 0.35 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 } }}>
                        <Notif {...a} />
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* En móvil, un único aviso bajo el teléfono */}
        {(
          <div className="relative z-10 -mt-10 lg:hidden">
            <Notif {...HERO_AVISOS[caso.id][0]} className="w-[300px] max-w-[calc(100vw-40px)]" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------
   SECCIÓN: Casos (tres negocios reales, mismo enfoque)
   --------------------------------------------------------------------- */
function CasoVisual({ id, simple }) {
  if (id === "pilates") {
    return (
      <div className="relative flex items-center justify-center">
        <Phone label="App de reservas de un estudio de pilates"><PilatesScreen /></Phone>
        {!simple && (
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease, delay: 0.35 }} className="absolute -right-6 top-16 xl:-right-24">
            <Notif icon="wa" app="WhatsApp" title="Estudio Arrel" body="Te recordamos tu clase de mañana a las 9:00. Responde 1 para confirmar." time="18:00" className="w-[270px]" />
          </motion.div>
        )}
      </div>
    );
  }
  if (id === "stock") {
    return (
      <div className="relative w-full max-w-[640px]">
        <Tablet><StockScreen wide /></Tablet>
        {!simple && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.35 }} className="absolute -bottom-10 left-6">
            <Notif icon="box" app="Almacén Norte" title="Stock bajo · Film estirable" body="Quedan 7 rollos. Se avisó a Compras." time="ahora" className="w-[270px]" />
          </motion.div>
        )}
      </div>
    );
  }
  return (
    <div className="relative flex items-center justify-center gap-6">
      <Phone label="Agenda de una fisioterapeuta"><AgendaScreen /></Phone>
      {!simple && (
        <motion.div initial={{ opacity: 0, x: 40, rotate: 3 }} animate={{ opacity: 1, x: 0, rotate: 2 }} transition={{ duration: 0.7, ease, delay: 0.25 }} className="hidden xl:block">
          <Phone label="Conversación de WhatsApp con un recordatorio" className="scale-[0.9]"><WAChat name="Marta Vidal Fisioterapia" msgs={MSGS_CITA} delayStep={0.5} /></Phone>
        </motion.div>
      )}
    </div>
  );
}

function Casos() {
  const simple = useSimple();
  const [active, setActive] = useState(0);
  const c = CASOS[active];
  const tabsRef = useRef([]);
  const onKey = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (active + (e.key === "ArrowRight" ? 1 : CASOS.length - 1)) % CASOS.length;
    setActive(next); tabsRef.current[next]?.focus();
  };
  return (
    <section id="ejemplos" aria-labelledby="casos-title" className="scroll-mt-16 bg-white">
      <div className="container-page flex flex-col gap-12 py-24 md:gap-16 md:py-36">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionTitle id="casos-title" eyebrow="Ejemplos" title="Tu negocio es distinto. Tu app también." />
          <p className="max-w-[40ch] text-entrada text-gris-500 lg:pb-2">Tres ejemplos de cómo queda. Si lo tuyo es otra cosa, lo construimos igual: partimos siempre de cómo trabajas hoy.</p>
        </div>

        <div role="tablist" aria-label="Casos de uso" onKeyDown={onKey} className="flex max-w-full gap-1 self-start overflow-x-auto rounded-full bg-papel p-1 no-scrollbar">
          {CASOS.map((x, i) => (
            <button key={x.id} ref={(el) => (tabsRef.current[i] = el)} role="tab" id={`tab-${x.id}`} aria-selected={i === active} aria-controls={`panel-${x.id}`} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)}
              className={`relative shrink-0 rounded-full px-3.5 py-2.5 text-[14px] font-semibold transition-colors sm:px-4 ${i === active ? "text-white" : "text-gris-500 hover:text-tinta"}`}>
              {i === active && <motion.span layoutId="casos-seg" className="absolute inset-0 rounded-full bg-tinta" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
              <span className="relative"><span className="sm:hidden">{x.corto}</span><span className="hidden sm:inline">{x.tab}</span></span>
            </button>
          ))}
        </div>

        <div id={`panel-${c.id}`} role="tabpanel" aria-labelledby={`tab-${c.id}`} className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <AnimatePresence mode="wait">
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }} className="flex min-w-0 flex-col gap-6">
              <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.035em]">{c.titulo}</h3>
              <p className="max-w-entrada text-[17px] leading-relaxed text-gris-500">{c.texto}</p>
              <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {c.puntos.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-[15px] font-medium">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tinta"><svg viewBox="0 0 12 12" className="w-2.5"><path d="M2.5 6.3 5 8.6 9.5 3.4" fill="none" stroke={ACENTO.claro} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    {p}
                  </li>
                ))}
              </ul>
              <span className="text-[14px] text-gris-400">Para: {c.para}</span>
            </motion.div>
          </AnimatePresence>

          <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br from-papel via-[#F7F3F0] to-[#FFEADF] px-6 py-12 md:px-10">
            <Blob className="-left-20 -top-24 h-[380px] w-[380px]" color="rgba(255,79,0,0.22)" />
            <Blob className="-bottom-28 -right-16 h-[420px] w-[420px]" color="rgba(255,170,120,0.3)" />
            <AnimatePresence mode="wait">
              <motion.div key={c.id} className="relative flex w-full justify-center"
                initial={{ opacity: 0, y: simple ? 12 : 40, scale: simple ? 1 : 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: simple ? -6 : -24 }} transition={{ duration: simple ? 0.3 : 0.55, ease }}>
                <Tilt max={5}><CasoVisual id={c.id} simple={simple} /></Tilt>
              </motion.div>
            </AnimatePresence>
            <span className="absolute bottom-4 right-5 font-mono text-[11px] uppercase tracking-[0.1em] text-gris-400">Interactivo</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------
   CLIENTES: datos, pantallas simuladas de cada app y páginas de proyecto
   --------------------------------------------------------------------- */
// Enlaces de las fichas. En el artefacto de Claude se reemplazan por rutas con #.
const enlaceCliente = (slug) => `/clientes/${slug}`;
const ABRE_CLIENTE = EXTERNO;
const irA = (ancla) => `/#${ancla}`;

// --- un clu de bordado (paleta de su manual: crema, lino, piedra, ladrillo, miel) ---
const BOR = { crema: "#FBF8F3", lino: "#DFD7CC", linoSoft: "#EDE8E0", piedra: "#566567", piedraSoft: "#77898B", ladrillo: "#D9704A", miel: "#F2C166", verde: "#7FA87A" };
function BordadoScreen({ s }) {
  const barra = (
    <div className="absolute inset-x-3 bottom-3 flex items-center justify-around rounded-full bg-white px-3 py-2 shadow-[0_6px_18px_-8px_rgba(20,18,16,0.3)]">
      {["Inicio", "Kits"].map((x) => <span key={x} className="text-[9px] font-semibold" style={{ color: BOR.piedraSoft }}>{x}</span>)}
      <span className="-mt-6 flex h-10 w-10 items-center justify-center rounded-full text-[18px] font-bold text-white shadow-lg" style={{ background: BOR.ladrillo }}>+</span>
      {["News", "Perfil"].map((x) => <span key={x} className="text-[9px] font-semibold" style={{ color: BOR.piedraSoft }}>{x}</span>)}
    </div>
  );
  const cab = (t, sub) => (
    <div className="flex items-center justify-between px-4 pt-5">
      <div className="flex flex-col"><span className="text-[10px]" style={{ color: BOR.piedraSoft }}>{sub}</span><span className="text-[17px] font-bold" style={{ color: BOR.piedra }}>{t}</span></div>
      <img src="/clientes/un-clu-de-bordado.png" alt="" className="h-7 w-auto" />
    </div>
  );
  let body;
  if (s === "calendario") {
    const clases = [3, 5, 10, 12, 17, 19, 24, 26];
    body = (
      <>
        {cab("Noviembre", "Reserva tu clase")}
        <div className="mx-3 mt-3 rounded-[16px] bg-white p-2.5 shadow-[0_1px_2px_rgba(20,18,16,0.06)]">
          <div className="grid grid-cols-7 text-center text-[8.5px] font-semibold" style={{ color: BOR.piedraSoft }}>{["L", "M", "X", "J", "V", "S", "D"].map((d) => <span key={d}>{d}</span>)}</div>
          <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-[10px]" style={{ color: BOR.piedra }}>
            {Array.from({ length: 6 }).map((_, i) => <span key={`v${i}`} />)}
            {Array.from({ length: 30 }).map((_, i) => {
              const d = i + 1; const sel = d === 19; const mia = d === 12;
              return (
                <span key={d} className="flex flex-col items-center gap-[2px] rounded-[8px] py-[3px] font-semibold" style={sel ? { background: BOR.miel } : undefined}>
                  {d}
                  <span className="h-[4px] w-[4px] rounded-full" style={{ background: clases.includes(d) ? (mia ? "#B9C0C1" : BOR.ladrillo) : "transparent" }} />
                </span>
              );
            })}
          </div>
        </div>
        <div className="mx-3 mt-2.5 flex items-center gap-2 rounded-[14px] bg-white px-3 py-2.5 text-[10.5px] shadow-[0_1px_2px_rgba(20,18,16,0.06)]" style={{ color: BOR.piedra }}>
          <span className="h-2 w-2 rounded-full" style={{ background: BOR.ladrillo }} /> Hay lugar
          <span className="ml-2 h-2 w-2 rounded-full bg-[#B9C0C1]" /> Ya reservaste
        </div>
      </>
    );
  } else if (s === "clase") {
    body = (
      <>
        {cab("Jueves 19", "Noviembre")}
        <div className="mx-3 mt-4 flex flex-col gap-2.5 rounded-[18px] bg-white p-4 shadow-[0_1px_2px_rgba(20,18,16,0.06),0_8px_24px_rgba(20,18,16,0.08)]">
          <span className="text-[10px] font-semibold uppercase tracking-[0.06em]" style={{ color: BOR.ladrillo }}>18:30 – 20:30</span>
          <span className="text-[16px] font-bold leading-tight" style={{ color: BOR.piedra }}>Punto de cruz</span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => <span key={i} className="h-4 w-4 rounded-full" style={{ background: i < 4 ? BOR.ladrillo : BOR.linoSoft }} />)}
            <span className="ml-1 text-[10.5px]" style={{ color: BOR.piedraSoft }}>4 de 6 lugares</span>
          </div>
          <span className="mt-1 rounded-[12px] py-2.5 text-center text-[12px] font-bold text-white" style={{ background: BOR.ladrillo }}>Reservar mi lugar</span>
          <span className="text-center text-[9.5px]" style={{ color: BOR.piedraSoft }}>Puedes cancelar sin cargo hasta 24 h antes.</span>
        </div>
      </>
    );
  } else if (s === "reservada") {
    body = (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 pb-16 text-center">
        <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: BOR.miel }}>
          <svg viewBox="0 0 12 12" className="w-7"><path d="M2.5 6.3 5 8.6 9.5 3.4" fill="none" stroke="#566567" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.span>
        <span className="text-[18px] font-bold" style={{ color: BOR.piedra }}>¡Lugar reservado!</span>
        <span className="text-[11.5px]" style={{ color: BOR.piedraSoft }}>Jueves 19 · 18:30 · Punto de cruz</span>
        <span className="mt-2 rounded-[12px] border px-4 py-2 text-[11px] font-semibold" style={{ borderColor: BOR.lino, color: BOR.piedra }}>Añadir a mi calendario</span>
      </div>
    );
  } else if (s === "kits") {
    body = (
      <>
        {cab("Kits", "Pide el tuyo")}
        <div className="mt-3 flex flex-col gap-2 px-3">
          {[["Kit de iniciación", "Bastidor, hilos y tela"], ["Kit flores", "Patrón y 8 colores"], ["Kit bastidor grande", "Para proyectos XL"]].map(([n, d], i) => (
            <div key={n} className="flex items-center gap-3 rounded-[14px] bg-white p-2.5 shadow-[0_1px_2px_rgba(20,18,16,0.06)]">
              <span className="h-10 w-10 shrink-0 rounded-[10px]" style={{ background: [BOR.miel, "#E8B4A0", "#B8CFC4"][i] }} />
              <span className="flex min-w-0 flex-1 flex-col"><span className="truncate text-[11.5px] font-bold" style={{ color: BOR.piedra }}>{n}</span><span className="truncate text-[9.5px]" style={{ color: BOR.piedraSoft }}>{d}</span></span>
              <span className="rounded-full px-2.5 py-1 text-[9.5px] font-bold text-white" style={{ background: BOR.ladrillo }}>Pedir</span>
            </div>
          ))}
        </div>
      </>
    );
  } else if (s === "noticias") {
    body = (
      <>
        {cab("Noticias", "Novedades del club")}
        <div className="mt-3 flex flex-col gap-2 px-3">
          {[["Nuevo taller de diciembre", "Abrimos inscripciones para bordado navideño.", "Hoy"], ["Kits nuevos", "Llegaron los hilos de algodón orgánico.", "Lun"]].map(([t, d, f]) => (
            <div key={t} className="flex flex-col gap-1 rounded-[14px] bg-white p-3 shadow-[0_1px_2px_rgba(20,18,16,0.06)]">
              <span className="flex items-center justify-between"><span className="text-[11.5px] font-bold" style={{ color: BOR.piedra }}>{t}</span><span className="text-[9px]" style={{ color: BOR.piedraSoft }}>{f}</span></span>
              <span className="text-[10px] leading-snug" style={{ color: BOR.piedraSoft }}>{d}</span>
            </div>
          ))}
        </div>
      </>
    );
  } else if (s === "admin") {
    body = (
      <>
        {cab("Asistencia", "Jueves 19 · 18:30")}
        <div className="mx-3 mt-3 flex flex-col rounded-[14px] bg-white px-3 py-1 shadow-[0_1px_2px_rgba(20,18,16,0.06)]">
          {[["Laura M.", BOR.verde, "Cobrada"], ["Núria P.", BOR.ladrillo, "Sin cobrar"], ["Marta G.", BOR.verde, "Cobrada"], ["Sílvia R.", BOR.miel, "Baja < 24 h"]].map(([n, c, e]) => (
            <span key={n} className="flex items-center gap-2.5 border-b py-2 text-[11px] last:border-0" style={{ borderColor: BOR.linoSoft, color: BOR.piedra }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} /><span className="flex-1 font-semibold">{n}</span><span className="text-[9.5px]" style={{ color: BOR.piedraSoft }}>{e}</span>
            </span>
          ))}
        </div>
        <span className="mx-3 mt-2.5 block rounded-[12px] py-2 text-center text-[10.5px] font-bold" style={{ background: BOR.miel, color: BOR.piedra }}>Exportar planilla</span>
      </>
    );
  } else {
    body = (
      <>
        {cab("Perfil", "Hola, Laura")}
        <div className="mx-3 mt-3 flex flex-col rounded-[14px] bg-white px-3 py-1 shadow-[0_1px_2px_rgba(20,18,16,0.06)]">
          {[["Idioma", <span key="i" className="flex rounded-full p-0.5" style={{ background: BOR.linoSoft }}><span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold">ES</span><span className="px-2 py-0.5 text-[9px]">CAT</span></span>], ["Avisos en el móvil", <span key="a" className="flex h-4 w-7 items-center justify-end rounded-full p-0.5" style={{ background: BOR.ladrillo }}><span className="h-3 w-3 rounded-full bg-white" /></span>], ["Tema oscuro", <span key="t" className="flex h-4 w-7 items-center rounded-full p-0.5" style={{ background: BOR.lino }}><span className="h-3 w-3 rounded-full bg-white" /></span>], ["Mis datos", <span key="d" className="text-[10px]">›</span>]].map(([l, c]) => (
            <span key={l} className="flex items-center justify-between border-b py-2.5 text-[11px] font-semibold last:border-0" style={{ borderColor: BOR.linoSoft, color: BOR.piedra }}>{l}{c}</span>
          ))}
        </div>
      </>
    );
  }
  return <div className="relative flex h-full flex-col font-sys" style={{ background: BOR.crema }}><StatusBar />{body}{["calendario", "kits", "noticias", "perfil"].includes(s) && barra}</div>;
}

// --- DAILY (violeta #4B3AD6, tinta #111114) ---
const DLY = { fondo: "#F5F5F7", tinta: "#111114", violeta: "#4B3AD6", gris: "#7A7A85" };
function DailyScreen({ s }) {
  // Cabecera y etiquetas como en la app real: flecha atrás, título grande, rótulos en mayúsculas espaciadas.
  const etq = (t) => <span className="text-[6.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: DLY.gris }}>{t}</span>;
  const cabR = (t, sup) => (
    <div className="flex items-center gap-2.5 px-4 pt-4">
      <span className="text-[13px]" style={{ color: DLY.tinta }}>←</span>
      <span className="flex flex-col">{sup && etq(sup)}<span className="text-[14px] font-bold leading-tight tracking-[-0.02em]" style={{ color: DLY.tinta }}>{t}</span></span>
    </div>
  );
  const ico = (d) => <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
  const activa = { importar: 3, graficos: 0, cartera: 0 }[s];
  const barraApp = activa !== undefined && (
    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/90 px-3.5 py-1.5 shadow-[0_6px_20px_-6px_rgba(17,17,20,0.25)] ring-1 ring-black/5" aria-hidden="true">
      {[ico(<><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M16 13h2M3 9h15V6" /></>), ico(<><circle cx="12" cy="12" r="9" /><path d="m15 9-2 4-4 2 2-4z" /></>), null, ico(<path d="M4 9h14l-3-3M20 15H6l3 3" />), ico(<><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 12 3 3 5-6" /></>)].map((x, i) =>
        x ? <span key={i} className="relative flex flex-col items-center" style={{ color: i === activa ? DLY.tinta : "#A3A3AD" }}>{x}{i === activa && <span className="absolute -bottom-1.5 h-[3px] w-[3px] rounded-full" style={{ background: DLY.violeta }} />}</span>
          : <span key={i} className="flex h-7 w-7 items-center justify-center rounded-[9px] text-[14px] font-light text-white" style={{ background: DLY.tinta }}>+</span>)}
    </div>
  );
  const cab = (t) => (
    <div className="flex items-center justify-between px-4 pt-5">
      <span className="flex items-center gap-2"><img src="/clientes/daily.svg" alt="" className="h-7 w-7 rounded-[9px]" /><span className="text-[16px] font-bold" style={{ color: DLY.tinta }}>{t}</span></span>
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px]">🔔<span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full" style={{ background: DLY.violeta }} /></span>
    </div>
  );
  let body;
  if (s === "pin") {
    body = (
      <div className="flex h-full flex-col items-center justify-center gap-5 px-6 pb-8" style={{ background: DLY.tinta }}>
        <img src="/clientes/daily.svg" alt="" className="h-12 w-12 rounded-[14px] ring-1 ring-white/15" />
        <span className="text-[13px] font-semibold text-white">Ingresa tu PIN</span>
        <div className="flex gap-3">{[0, 1, 2, 3].map((i) => <motion.span key={i} initial={{ scale: 0.6, opacity: 0.3 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 * i }} className="h-3 w-3 rounded-full" style={{ background: i < 3 ? DLY.violeta : "#3A3A42" }} />)}</div>
        <div className="grid grid-cols-3 gap-2.5">{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <span key={n} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[15px] font-semibold text-white ring-1 ring-white/10">{n}</span>)}</div>
      </div>
    );
  } else if (s === "inicio") {
    body = (
      <>
        {cab("Inicio")}
        <div className="mx-3 mt-3 flex flex-col gap-2 rounded-[20px] p-4 text-white" style={{ background: DLY.tinta }}>
          <span className="text-[10px] text-white/60">Saldo total</span>
          <span className="text-[24px] font-bold tracking-[-0.03em] tnum">US$ 12.480</span>
          <div className="flex gap-1.5">{["ARS", "USD", "EUR"].map((c) => <span key={c} className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${c === "USD" ? "text-white" : "bg-white/10 text-white/60"}`} style={c === "USD" ? { background: DLY.violeta } : undefined}>{c}</span>)}</div>
          <svg viewBox="0 0 200 60" className="mt-1 w-full" aria-hidden="true">
            <defs><linearGradient id="dly-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4B3AD6" stopOpacity=".6" /><stop offset="1" stopColor="#4B3AD6" stopOpacity="0" /></linearGradient></defs>
            <path d="M0 48 L30 42 L60 44 L90 30 L120 34 L150 20 L180 24 L200 12 L200 60 L0 60Z" fill="url(#dly-g)" />
            <motion.path d="M0 48 L30 42 L60 44 L90 30 L120 34 L150 20 L180 24 L200 12" fill="none" stroke="#8B7BFF" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
          </svg>
        </div>
        <div className="mx-3 mt-2.5 grid grid-cols-2 gap-2">
          {[["Ingresos", "+ US$ 3.200", "#1F9D6B"], ["Gastos", "− US$ 1.840", "#D04545"]].map(([l, v, c]) => (
            <div key={l} className="flex flex-col rounded-[16px] bg-white p-3"><span className="text-[9.5px]" style={{ color: DLY.gris }}>{l} del mes</span><span className="text-[12.5px] font-bold tnum" style={{ color: c }}>{v}</span></div>
          ))}
        </div>
      </>
    );
  } else if (s === "bancos") {
    body = (
      <>
        {cab("Mis cuentas")}
        <div className="mt-3 flex flex-col gap-2 px-3">
          {[["Banco", "Cuenta sueldo", "AR$ 845.200", "#4B3AD6"], ["Billetera virtual", "Uso diario", "AR$ 92.300", "#111114"], ["Tarjeta de crédito", "Cierra el 24", "− AR$ 210.400", "#C24A7A"], ["Inversiones", "Cartera", "US$ 6.150", "#1F9D6B"], ["Efectivo", "En casa", "€ 320", "#B98A2E"]].map(([n, d, v, c]) => (
            <div key={n} className="flex items-center gap-2.5 rounded-[16px] bg-white px-3 py-2.5">
              <span className="h-8 w-8 shrink-0 rounded-[10px]" style={{ background: c }} />
              <span className="flex min-w-0 flex-1 flex-col"><span className="truncate text-[11.5px] font-bold" style={{ color: DLY.tinta }}>{n}</span><span className="truncate text-[9.5px]" style={{ color: DLY.gris }}>{d}</span></span>
              <span className="text-[11px] font-bold tnum" style={{ color: DLY.tinta }}>{v}</span>
            </div>
          ))}
        </div>
      </>
    );
  } else if (s === "categorias") {
    const seg = [["Vivienda", 38, "#4B3AD6"], ["Comida", 24, "#8B7BFF"], ["Transporte", 18, "#111114"], ["Ocio", 20, "#C9C3FF"]];
    let acc = 0;
    body = (
      <>
        {cab("Gastos")}
        <div className="mx-3 mt-3 flex flex-col items-center gap-3 rounded-[20px] bg-white p-4">
          <svg viewBox="0 0 42 42" className="h-28 w-28 -rotate-90" aria-hidden="true">
            {seg.map(([n, p, c]) => { const el = <motion.circle key={n} cx="21" cy="21" r="15.9" fill="none" stroke={c} strokeWidth="6" strokeDasharray={`${p} ${100 - p}`} strokeDashoffset={-acc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />; acc += p; return el; })}
          </svg>
          <div className="grid w-full grid-cols-2 gap-1.5">{seg.map(([n, p, c]) => <span key={n} className="flex items-center gap-1.5 text-[10px]" style={{ color: DLY.tinta }}><span className="h-2 w-2 rounded-full" style={{ background: c }} />{n} <b className="ml-auto tnum">{p}%</b></span>)}</div>
        </div>
      </>
    );
  } else if (s === "pagos") {
    body = (
      <>
        {cab("Pagos del mes")}
        <div className="mt-3 flex flex-col gap-2 px-3">
          {[["Alquiler", "Vence en 3 días", false], ["Internet", "Pagado", true], ["Gimnasio", "Vence el 15", false], ["Seguro", "Pagado", true]].map(([n, e, ok]) => (
            <div key={n} className="flex items-center gap-2.5 rounded-[16px] bg-white px-3 py-2.5">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${ok ? "text-white" : "border"}`} style={ok ? { background: DLY.violeta } : { borderColor: "#D5D5DC" }}>{ok && OK}</span>
              <span className="flex-1 text-[11.5px] font-bold" style={{ color: DLY.tinta }}>{n}</span>
              <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold" style={ok ? { background: "#EEEDFB", color: DLY.violeta } : { background: "#FFF1E6", color: "#B4570F" }}>{e}</span>
            </div>
          ))}
        </div>
      </>
    );
  } else if (s === "importar") {
    body = (
      <>
        {cabR("Importar", "Movimientos")}
        <div className="mx-3 mt-3 flex flex-col gap-2 rounded-[16px] bg-white p-3">
          <div className="flex items-center gap-2 rounded-[12px] border border-dashed p-2" style={{ borderColor: "#C9C3FF", background: "#F4F2FF" }}>
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[7px] font-extrabold text-white" style={{ background: "#1F9D6B" }}>XLSX</span>
            <span className="flex min-w-0 flex-1 flex-col"><span className="truncate text-[9px] font-bold" style={{ color: DLY.tinta }}>extracto_octubre.xlsx</span><span className="text-[7px]" style={{ color: DLY.gris }}>Excel o CSV de cualquier banco</span></span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full text-white" style={{ background: DLY.tinta }}>{OK}</span>
          </div>
          {etq("Moneda del extracto")}
          <div className="flex w-max gap-0.5 rounded-full p-0.5" style={{ background: DLY.fondo }}>{["EUR", "ARS", "USD"].map((c) => <span key={c} className="rounded-full px-2.5 py-1 text-[8px] font-bold" style={c === "EUR" ? { background: DLY.tinta, color: "#fff" } : { color: DLY.gris }}>{c}</span>)}</div>
          {etq("Columnas")}
          {[["Fecha", "Columna A"], ["Concepto", "Columna B"], ["Monto", "Columna D"]].map(([k, v]) => (
            <span key={k} className="flex items-center justify-between rounded-[10px] px-2.5 py-1.5 text-[8.5px]" style={{ background: DLY.fondo, color: DLY.tinta }}><b className="font-bold">{k}</b><span style={{ color: DLY.gris }}>{v} ▾</span></span>
          ))}
          <span className="mt-0.5 rounded-full py-2 text-center text-[9px] font-bold text-white" style={{ background: DLY.tinta }}>Importar 42 movimientos</span>
        </div>
      </>
    );
  } else if (s === "graficos") {
    const v = [64, 38, 41, 70, 66, 60];
    body = (
      <>
        <span className="px-4 pt-4 text-[12px] font-bold tracking-[-0.01em]" style={{ color: DLY.tinta }}>Rendimiento (Últimos 6 meses)</span>
        <div className="mx-3 mt-2.5 flex flex-col rounded-[16px] bg-white px-3 pb-3 pt-3.5">
          <span className="text-center">{etq("Histórico EUR")}</span>
          <div className="mt-2 flex h-[130px] items-end justify-around px-1">
            {v.map((x, i) => <motion.span key={i} className="w-[14px] rounded-t-[5px]" style={{ background: DLY.violeta }} initial={{ height: 0 }} animate={{ height: `${x}%` }} transition={{ duration: 0.6, delay: i * 0.05 }} />)}
          </div>
          <div className="mt-1.5 flex justify-around text-[6.5px] font-medium tracking-[0.04em]" style={{ color: DLY.gris }}>{["MAY", "JUN", "JUL", "AGO", "SEPT", "OCT"].map((m) => <span key={m}>{m}</span>)}</div>
        </div>
        <div className="mx-3 mt-2 flex items-center justify-between rounded-[14px] bg-white px-3 py-2.5">
          <span className="flex flex-col">{etq("Evolución anual")}<span className="text-[11px] font-bold tnum" style={{ color: DLY.tinta }}>+ 18,4 %</span></span>
          <span className="flex flex-col items-end">{etq("Mayor caída")}<span className="rounded-full px-1.5 py-0.5 text-[8px] font-bold" style={{ background: "#FDECEC", color: "#D04545" }}>− 4,5 %</span></span>
        </div>
      </>
    );
  } else if (s === "deudas") {
    body = (
      <>
        {cab("Deudas")}
        <div className="mx-3 mt-3 grid grid-cols-2 gap-2">
          <div className="flex flex-col rounded-[16px] bg-white p-3"><span className="text-[9px] font-semibold tracking-[0.04em]" style={{ color: DLY.gris }}>ME DEBEN</span><span className="text-[14px] font-bold tnum" style={{ color: "#1F9D6B" }}>US$ 120</span></div>
          <div className="flex flex-col rounded-[16px] bg-white p-3"><span className="text-[9px] font-semibold tracking-[0.04em]" style={{ color: DLY.gris }}>DEBO</span><span className="text-[14px] font-bold tnum" style={{ color: "#D04545" }}>AR$ 35.000</span></div>
        </div>
        <div className="mt-2.5 flex flex-col gap-2 px-3">
          {[["Cena de cumpleaños", "Me deben", "US$ 80", "#1F9D6B"], ["Entradas del concierto", "Me deben", "US$ 40", "#1F9D6B"], ["Préstamo de mamá", "Debo", "AR$ 35.000", "#D04545"]].map(([n, t, v, c]) => (
            <div key={n} className="flex items-center gap-2.5 rounded-[16px] bg-white px-3 py-2.5">
              <span className="flex min-w-0 flex-1 flex-col"><span className="truncate text-[11.5px] font-bold" style={{ color: DLY.tinta }}>{n}</span><span className="text-[9.5px]" style={{ color: DLY.gris }}>{t}</span></span>
              <span className="text-[11px] font-bold tnum" style={{ color: c }}>{v}</span>
            </div>
          ))}
        </div>
      </>
    );
  } else if (s === "viajes") {
    body = (
      <>
        {cab("Viajes")}
        <div className="mx-3 mt-3 flex flex-col gap-2 rounded-[20px] p-4 text-white" style={{ background: DLY.tinta }}>
          <span className="text-[10px] text-white/60">12 – 18 de noviembre</span>
          <span className="text-[16px] font-bold">Lisboa, Portugal</span>
          <div className="flex justify-between text-[10px]"><span className="text-white/60">Gastado <b className="text-white tnum">€ 640</b></span><span className="text-white/60">Presupuesto <b className="text-white tnum">€ 900</b></span></div>
          <span className="h-2 overflow-hidden rounded-full bg-white/15"><motion.span className="block h-full rounded-full" style={{ background: "#8B7BFF" }} initial={{ width: 0 }} animate={{ width: "71%" }} transition={{ duration: 0.8 }} /></span>
        </div>
        <div className="mt-2.5 flex flex-col gap-2 px-3">
          {[["Hotel", "€ 320"], ["Comidas", "€ 180"], ["Transporte", "€ 140"]].map(([n, v]) => (
            <div key={n} className="flex items-center justify-between rounded-[14px] bg-white px-3 py-2.5 text-[11.5px]"><span className="font-bold" style={{ color: DLY.tinta }}>{n}</span><span className="font-bold tnum" style={{ color: DLY.tinta }}>{v}</span></div>
          ))}
        </div>
      </>
    );
  } else if (s === "cartera") {
    const seg = [["Acciones", 46, DLY.tinta], ["Bonos", 30, DLY.violeta], ["Fondos", 16, "#8B7BFF"], ["Cripto", 8, "#D5D5DC"]];
    let acc = 0;
    body = (
      <>
        {cabR("Inversiones", "Cartera")}
        <div className="mx-3 mt-3 flex items-center gap-3 rounded-[16px] bg-white p-3">
          <svg viewBox="0 0 42 42" className="h-[70px] w-[70px] shrink-0 -rotate-90" aria-hidden="true">
            {seg.map(([n, p, c]) => { const el = <circle key={n} cx="21" cy="21" r="16" fill="none" stroke={c} strokeWidth="3.2" strokeLinecap="round" strokeDasharray={`${p - 3} ${103 - p}`} strokeDashoffset={-acc} />; acc += p; return el; })}
          </svg>
          <div className="flex flex-col gap-1">
            {etq("Total invertido")}
            <span className="text-[14px] font-bold tnum" style={{ color: DLY.tinta }}>US$ 6.150</span>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">{seg.map(([n, p, c]) => <span key={n} className="flex items-center gap-1 whitespace-nowrap text-[6.5px]" style={{ color: DLY.tinta }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />{n} <span style={{ color: DLY.gris }}>{p}%</span></span>)}</div>
          </div>
        </div>
        <span className="px-4 pt-3">{etq("Movimientos")}</span>
        <div className="mt-1.5 flex flex-col gap-1.5 px-3">
          {[["Compra", "10 acciones", "− US$ 480", "21/10/2026", DLY.violeta], ["Venta", "5 bonos", "+ US$ 520", "14/10/2026", "#1F9D6B"], ["Compra", "Fondo común", "− US$ 300", "02/10/2026", DLY.violeta]].map(([t, d, v, f, c], i) => (
            <div key={i} className="flex items-center gap-2 rounded-[12px] bg-white py-2 pl-2 pr-2.5">
              <span className="h-6 w-[2.5px] rounded-full" style={{ background: c }} />
              <span className="flex h-6 w-6 items-center justify-center rounded-[7px] text-[9px]" style={{ background: t === "Compra" ? "#EEEDFB" : "#E6F6EE", color: c }}>{t === "Compra" ? "↙" : "↗"}</span>
              <span className="flex min-w-0 flex-1 flex-col"><span className="truncate text-[9px] font-bold" style={{ color: DLY.tinta }}>{d}</span><span className="text-[6.5px] font-medium tracking-[0.06em]" style={{ color: DLY.gris }}>{t.toUpperCase()} · COM. 0,5%</span></span>
              <span className="flex flex-col items-end"><span className="text-[9px] font-bold tnum" style={{ color: DLY.tinta }}>{v}</span><span className="text-[6.5px] tnum" style={{ color: DLY.gris }}>{f}</span></span>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    body = (
      <>
        {cab("Informes")}
        <div className="mx-3 mt-3 flex flex-col gap-2 rounded-[20px] bg-white p-3.5">
          <span className="text-[11px] font-bold" style={{ color: DLY.tinta }}>Gasto por entidad</span>
          {[["Banco", 42], ["Tarjeta de crédito", 30], ["Billetera virtual", 28]].map(([n, p]) => (
            <div key={n} className="flex flex-col gap-1">
              <span className="flex justify-between text-[9.5px]" style={{ color: DLY.gris }}><span>{n}</span><span className="tnum">{p} %</span></span>
              <span className="h-1.5 overflow-hidden rounded-full" style={{ background: DLY.fondo }}><span className="block h-full rounded-full" style={{ width: `${p}%`, background: DLY.violeta }} /></span>
            </div>
          ))}
          <span className="mt-1 rounded-[12px] py-2.5 text-center text-[11.5px] font-bold text-white" style={{ background: DLY.violeta }}>Generar PDF mensual</span>
        </div>
        <div className="mt-2.5 flex flex-col gap-2 px-3">
          {["Octubre 2026", "Septiembre 2026"].map((m) => (
            <div key={m} className="flex items-center gap-2.5 rounded-[14px] bg-white px-3 py-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[8px] font-bold text-white" style={{ background: "#D04545" }}>PDF</span>
              <span className="flex-1 text-[11px] font-bold" style={{ color: DLY.tinta }}>Reporte {m}</span>
              <span className="text-[13px]" style={{ color: DLY.violeta }}>↓</span>
            </div>
          ))}
        </div>
      </>
    );
  }
  return <div className="relative flex h-full flex-col font-sys" style={{ background: DLY.fondo, fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>{s === "pin" ? <div className="absolute inset-x-0 top-0 z-10"><StatusBar light /></div> : <StatusBar />}{body}{barraApp}</div>;
}

// --- Daiana Marlene (sistema de diseño de su app: crema, rosa empolvado, melocotón y salvia; Kumbh Sans + DM Sans) ---
// Pantallas inventadas para la propuesta: todavía no son capturas de una app real.
const DMC = {
  crema: "#F7F4EE", lino: "#EFE8DE", arena: "#E4D8C8", linea: "#DCD1C3", tinta: "#3A3330", suave: "#6B615B",
  cacao: "#4A3D38", rosa1: "#F1DCD6", rosa: "#E3BDB4", rosa6: "#8E444A", melocoton: "#EECBAE", salvia: "#C9D1BF", salvia7: "#465747", aviso: "#8A5B14",
};
const DM_TIT = { fontFamily: "'Kumbh Sans', system-ui, sans-serif", letterSpacing: "-0.02em" };
function IcoDM({ d, className = "h-3 w-3" }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
}
const DM_ICO = {
  inicio: <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" />,
  agenda: <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  formaciones: <><path d="M3 9.5 12 5l9 4.5-9 4.5z" /><path d="M7 11.5V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5" /></>,
  perfil: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 19.5c1.2-3.2 3.8-4.8 7-4.8s5.8 1.6 7 4.8" /></>,
  ok: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  reloj: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4.5l3 2" /></>,
  video: <><rect x="3" y="7" width="12" height="10" rx="2.5" /><path d="m15 11 6-3.5v9L15 13" /></>,
  candado: <><rect x="5" y="11" width="14" height="9" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  flecha: <path d="M5 12h14m-5-5 5 5-5 5" />,
  campana: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  doc: <><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z" /><path d="M14 3.5V8h4" /></>,
};
function MarleneScreen({ s }) {
  const titulo = (a, b, sub) => (
    <div className="flex flex-col px-4 pt-3">
      {sub && <span className="text-[7.5px] font-semibold uppercase tracking-[0.06em]" style={{ color: DMC.suave }}>{sub}</span>}
      <span className="text-[17px] font-medium leading-[1.15]" style={{ ...DM_TIT, color: DMC.tinta }}>{a}{b && <span style={{ color: DMC.rosa6 }}> {b}</span>}</span>
    </div>
  );
  const chip = (t, tipo) => {
    const est = { ok: [DMC.salvia, DMC.salvia7, DM_ICO.ok], pend: [DMC.rosa1, DMC.aviso, DM_ICO.reloj] }[tipo];
    return <span className="inline-flex w-max items-center gap-1 rounded-full px-1.5 py-0.5 text-[7px] font-semibold" style={{ background: est[0], color: est[1] }}><IcoDM d={est[2]} className="h-2 w-2" />{t}</span>;
  };
  const etq = (t) => <span className="text-[7px] font-semibold uppercase tracking-[0.06em]" style={{ color: DMC.tinta }}>{t}</span>;
  const boton = (t, sec) => <span className="flex h-[26px] items-center justify-center rounded-full text-[8.5px] font-semibold" style={sec ? { border: `1px solid ${DMC.linea}`, color: DMC.tinta } : { background: DMC.cacao, color: DMC.crema }}>{t}</span>;
  const tarjeta = "rounded-[8px] border p-2.5";
  const tab = { inicio: 0, reservar: 1, confirmada: 1, agenda: 1, formaciones: 2, curso: 2, avisos: 0 }[s];
  let body;
  if (s === "inicio") {
    body = (
      <>
        <svg viewBox="0 0 100 60" className="absolute right-0 top-8 w-[92px]" aria-hidden="true"><path d="M30 60a35 35 0 0 1 70 0z" fill={DMC.rosa} opacity=".55" /><path d="M58 60a22 22 0 0 1 44 0z" fill={DMC.melocoton} /></svg>
        {titulo("Hola,", "Lucía", "Jueves 6 de noviembre")}
        <div className="mx-3 mt-3 flex flex-col gap-1.5 rounded-[13px] p-3" style={{ background: DMC.rosa }}>
          {etq("Formación online")}
          <span className="text-[13px] font-medium leading-tight" style={{ ...DM_TIT, color: DMC.tinta }}>Curso 1 · Encuentro 3</span>
          <span className="flex items-center gap-1 text-[8px]" style={{ color: DMC.tinta }}><IcoDM d={DM_ICO.video} className="h-2.5 w-2.5" />Hoy · 19:00 h · por Meet</span>
          <span className="mt-1">{boton("Entrar a la clase")}</span>
        </div>
        <div className="mx-3 mt-2 flex flex-col gap-1 rounded-[8px] p-2.5" style={{ background: DMC.melocoton }}>
          {etq("Sesión individual")}
          <span className="text-[10.5px] font-semibold" style={{ ...DM_TIT, color: DMC.tinta }}>Martes 11, 18:00 h</span>
          {chip("Confirmada", "ok")}
        </div>
        <div className={`mx-3 mt-2 flex items-center justify-between ${tarjeta}`} style={{ background: DMC.lino, borderColor: DMC.linea }}>
          <span className="flex flex-col"><span className="text-[9px] font-semibold" style={{ color: DMC.tinta }}>Reservá una sesión</span><span className="text-[7.5px]" style={{ color: DMC.suave }}>60 min · virtual</span></span>
          <span style={{ color: DMC.rosa6 }}><IcoDM d={DM_ICO.flecha} /></span>
        </div>
      </>
    );
  } else if (s === "reservar") {
    const dias = [["L", 10], ["M", 11], ["X", 12], ["J", 13], ["V", 14]];
    const horas = ["10:00", "11:30", "16:00", "18:00", "19:30"];
    body = (
      <>
        {titulo("Reservá tu", "sesión", "Sesión individual")}
        <div className="mx-3 mt-3 flex justify-between">
          {dias.map(([d, n]) => (
            <span key={n} className="flex w-[34px] flex-col items-center gap-0.5 rounded-[8px] border py-1.5" style={n === 11 ? { background: DMC.arena, borderColor: DMC.arena } : { borderColor: DMC.linea }}>
              <span className="text-[7px] font-semibold" style={{ color: DMC.suave }}>{d}</span><span className="text-[11px] font-semibold" style={{ ...DM_TIT, color: DMC.tinta }}>{n}</span>
            </span>
          ))}
        </div>
        <span className="mx-4 mt-3 text-[9px] font-semibold" style={{ color: DMC.tinta }}>Horarios del martes 11</span>
        <div className="mx-3 mt-1.5 grid grid-cols-3 gap-1.5">
          {horas.map((h) => <span key={h} className="rounded-[5px] border py-1.5 text-center text-[8.5px] font-semibold tnum" style={h === "18:00" ? { background: DMC.cacao, borderColor: DMC.cacao, color: DMC.crema } : { borderColor: DMC.linea, color: h === "11:30" ? DMC.linea : DMC.tinta, textDecoration: h === "11:30" ? "line-through" : "none" }}>{h}</span>)}
        </div>
        <div className={`mx-3 mt-3 flex items-center gap-2 ${tarjeta}`} style={{ background: DMC.lino, borderColor: DMC.linea }}>
          <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: DMC.salvia, color: DMC.salvia7 }}><IcoDM d={DM_ICO.video} /></span>
          <span className="flex flex-col"><span className="text-[9px] font-semibold" style={{ color: DMC.tinta }}>Virtual, por Meet</span><span className="text-[7.5px]" style={{ color: DMC.suave }}>60 minutos · el enlace llega al reservar</span></span>
        </div>
        <span className="mx-3 mt-3">{boton("Reservar martes 11, 18:00 h")}</span>
      </>
    );
  } else if (s === "confirmada") {
    body = (
      <div className="flex flex-1 flex-col items-center px-5 pt-10 text-center">
        <svg viewBox="0 0 100 52" className="w-[110px]" aria-hidden="true"><path d="M8 52a42 42 0 0 1 84 0z" fill={DMC.rosa} opacity=".5" /><path d="M26 52a24 24 0 0 1 48 0z" fill={DMC.melocoton} /></svg>
        <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease }} className="-mt-4 flex h-9 w-9 items-center justify-center rounded-full" style={{ background: DMC.salvia, color: DMC.salvia7 }}><IcoDM d={DM_ICO.ok} className="h-4 w-4" /></motion.span>
        <span className="mt-3 text-[16px] font-medium leading-[1.2]" style={{ ...DM_TIT, color: DMC.tinta }}>Listo, te espero el martes <span style={{ color: DMC.rosa6 }}>a las 18 h</span></span>
        <span className="mt-2 text-[8.5px] leading-snug" style={{ color: DMC.suave }}>Te mandé el enlace de Meet por mail. Te aviso un día antes.</span>
        <div className={`mt-4 flex w-full items-center justify-between ${tarjeta}`} style={{ background: DMC.melocoton, borderColor: DMC.melocoton }}>
          <span className="flex flex-col items-start"><span className="text-[7px] font-semibold uppercase tracking-[0.06em]" style={{ color: DMC.tinta }}>Sesión individual</span><span className="text-[10px] font-semibold" style={{ ...DM_TIT, color: DMC.tinta }}>Martes 11 · 18:00 h</span></span>
          {chip("Confirmada", "ok")}
        </div>
        <div className="mt-3 flex w-full flex-col gap-1.5">{boton("Agregar a mi calendario")}{boton("Volver al inicio", true)}</div>
      </div>
    );
  } else if (s === "formaciones") {
    body = (
      <>
        {titulo("Formate", "conmigo", "Formaciones")}
        <div className="mx-3 mt-3 flex flex-col gap-1.5 rounded-[13px] p-3" style={{ background: DMC.rosa }}>
          <span className="flex items-center justify-between">{etq("Formación online")}{chip("Inscripta", "ok")}</span>
          <span className="text-[14px] font-medium" style={{ ...DM_TIT, color: DMC.tinta }}>Curso 1</span>
          <span className="text-[8px] leading-snug" style={{ color: DMC.tinta }}>6 encuentros en vivo por Meet, con grabaciones y material de cada clase.</span>
          <div className="mt-0.5 flex items-center gap-1.5"><span className="h-1 flex-1 overflow-hidden rounded-full bg-white/50"><span className="block h-full w-1/2 rounded-full" style={{ background: DMC.cacao }} /></span><span className="text-[7px] font-medium" style={{ color: DMC.tinta }}>Encuentro 3 de 6</span></div>
        </div>
        <div className="mx-3 mt-2 flex flex-col gap-1.5 rounded-[13px] border p-3" style={{ background: DMC.rosa1, borderColor: DMC.rosa1 }}>
          <span className="flex items-center justify-between">{etq("Formación online")}{chip("Pendiente", "pend")}</span>
          <span className="text-[14px] font-medium" style={{ ...DM_TIT, color: DMC.tinta }}>Curso 2</span>
          <span className="text-[8px] leading-snug" style={{ color: DMC.suave }}>Empieza en marzo. Tu inscripción se confirma cuando Daiana revise el pago.</span>
        </div>
        <span className="mx-3 mt-3">{boton("Ver programa del Curso 2", true)}</span>
      </>
    );
  } else if (s === "curso") {
    const enc = [["Encuentro 1", "ok"], ["Encuentro 2", "ok"], ["Encuentro 3", "hoy"], ["Encuentro 4", "lock"]];
    body = (
      <>
        {titulo("Curso 1", null, "Formación online")}
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-[13px] p-3" style={{ background: DMC.rosa }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: DMC.crema, color: DMC.rosa6 }}><IcoDM d={DM_ICO.video} className="h-4 w-4" /></span>
          <span className="flex flex-1 flex-col"><span className="text-[7px] font-semibold uppercase tracking-[0.06em]" style={{ color: DMC.tinta }}>En vivo hoy</span><span className="text-[10px] font-semibold" style={{ ...DM_TIT, color: DMC.tinta }}>19:00 h · por Meet</span></span>
        </div>
        <span className="mx-3 mt-2">{boton("Entrar a la clase")}</span>
        <div className="mx-3 mt-3 flex flex-col overflow-hidden rounded-[8px] border" style={{ borderColor: DMC.linea, background: DMC.lino }}>
          {enc.map(([t, e], i) => (
            <div key={t} className="flex items-center gap-2 px-2.5 py-2" style={{ borderTop: i ? `1px solid ${DMC.linea}` : "none" }}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full" style={e === "ok" ? { background: DMC.salvia, color: DMC.salvia7 } : e === "hoy" ? { background: DMC.rosa, color: DMC.tinta } : { background: DMC.arena, color: DMC.suave }}><IcoDM d={e === "ok" ? DM_ICO.ok : e === "hoy" ? DM_ICO.video : DM_ICO.candado} className="h-2.5 w-2.5" /></span>
              <span className="flex flex-1 flex-col"><span className="text-[9px] font-semibold" style={{ color: DMC.tinta }}>{t}</span><span className="text-[7px]" style={{ color: DMC.suave }}>{e === "ok" ? "Grabación y material" : e === "hoy" ? "Hoy, 19:00 h" : "El material se abre el jueves 13"}</span></span>
              {e === "ok" && <span style={{ color: DMC.rosa6 }}><IcoDM d={DM_ICO.doc} /></span>}
            </div>
          ))}
        </div>
      </>
    );
  } else if (s === "agenda") {
    const forma = [6, 13, 20, 27], ses = [11, 18, 25];
    body = (
      <>
        {titulo("Tu", "agenda", "Noviembre")}
        <div className={`mx-3 mt-3 ${tarjeta}`} style={{ background: DMC.lino, borderColor: DMC.linea }}>
          <div className="grid grid-cols-7 text-center text-[6.5px] font-semibold" style={{ color: DMC.suave }}>{["L", "M", "X", "J", "V", "S", "D"].map((d) => <span key={d}>{d}</span>)}</div>
          <div className="mt-1 grid grid-cols-7 gap-y-1 text-center">
            {[null, null, null, null, null, 1, 2, ...Array.from({ length: 28 }, (_, i) => i + 3)].map((n, i) => (
              <span key={i} className="mx-auto flex h-[19px] w-[19px] flex-col items-center justify-center rounded-full text-[8px] tnum" style={{ color: n ? DMC.tinta : "transparent", background: n === 11 ? DMC.arena : "transparent", fontWeight: n === 11 ? 600 : 400 }}>
                {n || "·"}
                {(forma.includes(n) || ses.includes(n)) && <span className="h-[3px] w-[3px] rounded-full" style={{ background: forma.includes(n) ? DMC.rosa6 : "#C98B5E" }} />}
              </span>
            ))}
          </div>
        </div>
        <div className="mx-4 mt-2 flex gap-3 text-[7px]" style={{ color: DMC.suave }}><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: DMC.rosa6 }} />Formación</span><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: "#C98B5E" }} />Sesión individual</span></div>
        <div className="mx-3 mt-2 flex items-center gap-2 rounded-[8px] p-2.5" style={{ background: DMC.melocoton }}>
          <span className="flex flex-1 flex-col"><span className="text-[7px] font-semibold uppercase tracking-[0.06em]" style={{ color: DMC.tinta }}>Martes 11</span><span className="text-[10px] font-semibold" style={{ ...DM_TIT, color: DMC.tinta }}>Sesión · 18:00 h</span></span>
          {chip("Confirmada", "ok")}
        </div>
      </>
    );
  } else if (s === "avisos") {
    const av = [
      [DM_ICO.campana, "Mañana a las 18 h tenés sesión", "El enlace de Meet ya está en tu mail.", DMC.melocoton],
      [DM_ICO.ok, "Se confirmó tu inscripción al Curso 2", "Ya podés ver el programa completo.", DMC.salvia],
      [DM_ICO.doc, "Nuevo material en Curso 1", "Grabación y PDF del encuentro 2.", DMC.rosa],
      [DM_ICO.video, "La clase empieza en 15 minutos", "Encuentro 3 · 19:00 h", DMC.rosa1],
    ];
    body = (
      <>
        {titulo("Avisos", null, "Hoy")}
        <div className="mx-3 mt-3 flex flex-col gap-1.5">
          {av.map(([ic, t, d, c], i) => (
            <motion.div key={t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }} className={`flex items-start gap-2 ${tarjeta}`} style={{ background: DMC.lino, borderColor: DMC.linea }}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: c, color: DMC.tinta }}><IcoDM d={ic} /></span>
              <span className="flex flex-col"><span className="text-[9px] font-semibold leading-tight" style={{ color: DMC.tinta }}>{t}</span><span className="text-[7.5px]" style={{ color: DMC.suave }}>{d}</span></span>
            </motion.div>
          ))}
        </div>
      </>
    );
  } else {
    // panel: la vista de Daiana
    const filas = [["09:00", "Sofía", "Sesión", DMC.melocoton], ["11:30", "Marina", "Sesión", DMC.melocoton], ["16:00", "Paula", "Sesión", DMC.melocoton], ["19:00", "Curso 1 · 14 alumnas", "Encuentro 3", DMC.rosa]];
    body = (
      <>
        {titulo("Tu", "semana", "Panel de Daiana")}
        <div className="mx-3 mt-3 grid grid-cols-2 gap-1.5">
          {[["12", "sesiones"], ["3", "inscripciones pendientes"]].map(([n, t], i) => (
            <span key={t} className="flex flex-col rounded-[8px] p-2.5" style={{ background: i ? DMC.rosa1 : DMC.lino, border: `1px solid ${i ? DMC.rosa1 : DMC.linea}` }}><span className="text-[17px] font-medium tnum" style={{ ...DM_TIT, color: DMC.tinta }}>{n}</span><span className="text-[7.5px] leading-tight" style={{ color: DMC.suave }}>{t}</span></span>
          ))}
        </div>
        <span className="mx-4 mt-3 text-[9px] font-semibold" style={{ color: DMC.tinta }}>Hoy, jueves 6</span>
        <div className="mx-3 mt-1.5 flex flex-col overflow-hidden rounded-[8px] border" style={{ borderColor: DMC.linea, background: DMC.lino }}>
          {filas.map(([h, n, t, c], i) => (
            <div key={h} className="flex items-center gap-2 px-2.5 py-1.5" style={{ borderTop: i ? `1px solid ${DMC.linea}` : "none" }}>
              <span className="w-[26px] text-[8px] font-semibold tnum" style={{ color: DMC.suave }}>{h}</span>
              <span className="h-5 w-[3px] rounded-full" style={{ background: c }} />
              <span className="flex flex-1 flex-col"><span className="text-[9px] font-semibold" style={{ color: DMC.tinta }}>{n}</span><span className="text-[7px]" style={{ color: DMC.suave }}>{t}</span></span>
            </div>
          ))}
        </div>
        <div className={`mx-3 mt-2 flex items-center gap-2 ${tarjeta}`} style={{ background: DMC.lino, borderColor: DMC.linea }}>
          <span className="flex flex-1 flex-col"><span className="text-[9px] font-semibold" style={{ color: DMC.tinta }}>Carla · Curso 2</span>{chip("Pendiente de confirmar", "pend")}</span>
          <span className="rounded-full px-2.5 py-1 text-[8px] font-semibold" style={{ background: DMC.cacao, color: DMC.crema }}>Confirmar</span>
        </div>
      </>
    );
  }
  const nav = tab !== undefined && (
    <div className="absolute inset-x-0 bottom-0 flex justify-around border-t px-2 pb-4 pt-2" style={{ background: DMC.crema, borderColor: DMC.linea, boxShadow: "0 -8px 24px rgba(58,51,48,0.06)" }} aria-hidden="true">
      {[["inicio", "Inicio"], ["agenda", "Agenda"], ["formaciones", "Cursos"], ["perfil", "Perfil"]].map(([k, t], i) => (
        <span key={k} className="flex flex-col items-center gap-0.5 text-[6.5px] font-semibold uppercase tracking-[0.04em]" style={{ color: i === tab ? DMC.rosa6 : DMC.suave }}><IcoDM d={DM_ICO[k]} className="h-3.5 w-3.5" />{t}</span>
      ))}
    </div>
  );
  return <div className="relative flex h-full flex-col" style={{ background: DMC.crema, fontFamily: "'DM Sans', system-ui, sans-serif" }}><StatusBar />{body}{nav}</div>;
}

// Captura real de una app dentro del teléfono. Sin barras del sistema y con los datos anonimizados.
function Captura({ src, fondo, alt = "" }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: fondo }}>
      <img src={src} alt={alt} draggable={false} className="absolute inset-x-0 top-9 w-full select-none" />
    </div>
  );
}

// Una pantalla de cliente: captura real (img) o pantalla simulada (s).
function Pantalla({ c, p }) {
  if (p.img) return <Captura src={p.img} fondo={p.fondo || c.fondoApp} alt={p.alt} />;
  return <c.App s={p.s} />;
}

// Foco: oscurece la pantalla y deja a la vista la zona de la función, con un borde naranja.
// Se desliza de una zona a otra cuando cambia la función.
function Foco({ f }) {
  return (
    <AnimatePresence>
      {f && (
        <motion.span key="foco" aria-hidden="true" className="pointer-events-none absolute z-20 rounded-[14px] ring-2 ring-[#FF4F00]"
          style={{ boxShadow: "0 0 0 999px rgba(17,17,17,0.42), 0 0 24px 2px rgba(255,79,0,0.45)" }}
          initial={{ opacity: 0, top: `${f.y}%`, height: `${f.h}%`, left: `${f.x ?? 2.5}%`, width: `${f.w ?? 95}%` }}
          animate={{ opacity: 1, top: `${f.y}%`, height: `${f.h}%`, left: `${f.x ?? 2.5}%`, width: `${f.w ?? 95}%` }}
          exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }} />
      )}
    </AnimatePresence>
  );
}

const SHOT = (n) => ({ img: `/clientes/bordado/${n}.webp`, alt: `Pantalla de ${n} de la app un clu de bordado` });
const DSHOT = (n, fondo) => ({ img: `/clientes/daily/${n}.webp`, alt: `Pantalla de ${n} de la app DAILY`, fondo });

const CLIENTES = [
  {
    slug: "un-clu-de-bordado", nombre: "un clu de bordado", tipo: "Comunidad de bordado y reservas",
    logo: "/clientes/un-clu-de-bordado.png", logoFondo: "#FFFFFF", fondo: "#FBF8F3", fondoApp: "#F8F5F0", brillo: "rgba(242,193,102,0.45)", App: BordadoScreen,
    resumen: "Una app de reservas para una comunidad de bordado: las alumnas reservan su lugar y la profesora organiza el club desde el móvil.",
    descripcion: [
      "Las alumnas ven en un calendario mensual qué clases tienen lugar, reservan con un toque (hasta seis por clase), piden sus kits y reciben las novedades del club con avisos en el móvil.",
      "La profesora agenda las clases, marca la asistencia y los cobros, gestiona a sus alumnas y exporta sus reportes. La app funciona en español y catalán y se instala desde el navegador, sin pasar por las tiendas.",
    ],
    // Capturas reales (nombres y cifras cambiados por privacidad).
    portada: SHOT("calendario"),
    demoFija: true, // la página del proyecto muestra el calendario fijo, sin recorrido
    flujo: [{ p: SHOT("calendario"), toque: ["54%", "64%"] }, { p: SHOT("kits"), toque: ["50%", "73%"] }, { p: SHOT("noticias"), toque: ["11%", "41%"] }],
    funciones: [
      { t: "Calendario mensual", d: "Las alumnas ven de un vistazo qué días hay clase y dónde queda lugar.", p: SHOT("calendario"), foco: { y: 33, h: 41 } },
      { t: "Tu próxima clase", d: "Al entrar, la app recuerda a cada alumna cuándo es su próxima clase.", p: SHOT("calendario"), foco: { y: 22.5, h: 10.5 } },
      { t: "Kits del club", d: "Reservan su kit desde la app y la profe coordina la entrega.", p: SHOT("kits"), foco: { y: 39, h: 22 } },
      { t: "Noticias con reacciones", d: "La profe publica novedades y las alumnas responden con un emoji.", p: SHOT("noticias"), foco: { y: 21, h: 26 } },
      { t: "Horarios y cupos", d: "La profe crea franjas y ve cuántos lugares quedan en cada clase.", p: SHOT("horarios"), foco: { y: 15, h: 26 } },
      { t: "Cobros por alumna", d: "Un toque marca cada clase como cobrada, sin cobrar o baja con cargo.", p: SHOT("alumnas"), foco: { y: 41, h: 24 } },
      { t: "Dashboard del mes", d: "Lo recaudado, las clases cobradas y las alumnas nuevas, en una pantalla.", p: SHOT("dashboard"), foco: { y: 26, h: 25 } },
      { t: "Reporte automático", d: "El último día de cada mes se genera solo y llega por email.", p: SHOT("reportes"), foco: { y: 24, h: 39 } },
    ],
  },
  {
    slug: "daily", nombre: "DAILY", tipo: "Finanzas personales multidivisa",
    logo: "/clientes/daily.svg", logoFondo: "#111114", fondo: "#F5F5F7", fondoApp: "#F5F5F7", brillo: "rgba(75,58,214,0.3)", App: DailyScreen,
    resumen: "Una app web de finanzas personales que reúne todas las cuentas, en pesos, dólares y euros, en un solo lugar.",
    descripcion: [
      "Reúne bancos, billeteras virtuales, tarjetas, inversiones y efectivo en pesos, dólares y euros, y muestra cómo evoluciona el capital mes a mes. Los movimientos se cargan a mano o se importan desde el extracto del banco, en Excel o CSV.",
      "Lleva los pagos de cada mes, las deudas, el presupuesto de cada viaje y la cartera de inversiones con sus comisiones. Genera un informe mensual en PDF, avisa de los vencimientos, se protege con PIN y se instala en el móvil como cualquier app.",
    ],
    // Capturas reales (nombres y cifras cambiados por privacidad). Importar, evolución e inversiones son pantallas recreadas con el mismo diseño.
    portada: DSHOT("inicio"),
    flujo: [{ p: DSHOT("inicio"), toque: ["50%", "86%"] }, { p: DSHOT("pagos", "#939393"), toque: ["50%", "52%"] }, { p: DSHOT("cuentas"), toque: ["30%", "38%"] }],
    funciones: [
      { t: "Todas tus cuentas", d: "Bancos, billeteras virtuales, tarjetas, inversiones y efectivo en una sola lista.", p: DSHOT("cuentas") },
      { t: "Pesos, dólares y euros", d: "El saldo en ARS, USD y EUR, con un toque para cambiar de moneda.", p: DSHOT("inicio") },
      { t: "Importar extractos", d: "Sube el Excel o CSV de tu banco y los movimientos se cargan solos.", p: { s: "importar" } },
      { t: "Evolución del capital", d: "Cómo crece tu dinero mes a mes y año a año, con la mayor caída del período.", p: { s: "graficos" } },
      { t: "Gastos por categoría", d: "En qué se va el dinero cada mes, separado por categorías.", p: DSHOT("categorias") },
      { t: "Pagos del mes", d: "Lo que vence, lo que ya pagaste y lo que falta, con las cuotas de cada pago.", p: DSHOT("pagos", "#939393") },
      { t: "Deudas", d: "Lo que te deben y lo que debes, en cualquier moneda.", p: DSHOT("deudas") },
      { t: "Viajes con presupuesto", d: "Un presupuesto por viaje, sus gastos y cuánto llevas gastado.", p: DSHOT("viajes") },
      { t: "Inversiones", d: "Compras y ventas con sus comisiones y la composición de tu cartera.", p: { s: "cartera" } },
      { t: "Informes en PDF", d: "Un informe por mes con todos los movimientos, listo para descargar.", p: DSHOT("informes", "#FFFFFF") },
    ],
  },
  {
    // Propuesta: funciones y pantallas inventadas sobre su sistema de diseño (todavía no es una app real).
    slug: "daiana-marlene", nombre: "Daiana Marlene", tipo: "Terapeuta y mentora",
    logo: null, monograma: "DM", monogramaColor: "#3A3330", monogramaFuente: "'Cormorant Garamond', Georgia, serif", logoFondo: "#E3BDB4", fondo: "#F7F4EE", fondoApp: "#F7F4EE", brillo: "rgba(227,189,180,0.55)", App: MarleneScreen,
    resumen: "Una app para una terapeuta y mentora: sus alumnas siguen sus cursos en vivo por Meet y sus pacientes reservan sesiones individuales, todo desde el móvil.",
    descripcion: [
      "Las alumnas se inscriben en el Curso 1 y el Curso 2, entran a cada clase en vivo con un toque y encuentran las grabaciones y el material de cada encuentro. Quien busca una sesión individual elige día y hora, y recibe la confirmación y un recordatorio antes de la cita.",
      "Daiana ve su semana en un panel: las sesiones del día, sus grupos y las inscripciones que tiene que confirmar. La app sigue su marca, con tonos crema, rosa empolvado y melocotón, y se instala en el móvil sin pasar por las tiendas.",
    ],
    portada: { s: "inicio" },
    flujo: [{ p: { s: "inicio" }, toque: ["50%", "68%"] }, { p: { s: "reservar" }, toque: ["50%", "71%"] }, { p: { s: "confirmada" }, toque: ["50%", "79%"] }],
    funciones: [
      { t: "Tu próxima clase", d: "Al abrir la app, cada persona ve su próxima clase o sesión.", p: { s: "inicio" } },
      { t: "Reserva de sesiones", d: "Eligen día y hora entre los huecos libres de Daiana.", p: { s: "reservar" } },
      { t: "Confirmación al instante", d: "La reserva se confirma sola y el enlace de Meet llega por mail.", p: { s: "confirmada" } },
      { t: "Formaciones", d: "Curso 1 y Curso 2, con el estado de cada inscripción.", p: { s: "formaciones" } },
      { t: "Clases en vivo y material", d: "Entran a la clase con un toque y luego tienen la grabación y el PDF.", p: { s: "curso" } },
      { t: "Agenda del mes", d: "Clases y sesiones en un calendario, cada una con su color.", p: { s: "agenda" } },
      { t: "Recordatorios", d: "Avisos antes de cada sesión, de cada clase y cuando hay material nuevo.", p: { s: "avisos" } },
      { t: "Panel de Daiana", d: "Su semana, sus grupos y las inscripciones por confirmar.", p: { s: "panel" } },
    ],
  },
];

function LogoCliente({ c, className = "h-14 w-14" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[18px] shadow-[0_0_0_1px_rgba(17,17,17,0.06),0_10px_24px_-14px_rgba(17,17,17,0.35)] ${className}`} style={{ background: c.logoFondo }}>
      {c.logo ? <img src={c.logo} alt={`Logo de ${c.nombre}`} className="h-full w-full object-contain p-1.5" /> : <span className="text-[18px] font-bold tracking-[-0.02em] text-white" style={c.monogramaFuente ? { color: c.monogramaColor, fontFamily: c.monogramaFuente, fontWeight: 600, fontSize: 22, letterSpacing: 0 } : undefined}>{c.monograma}</span>}
    </span>
  );
}

/* ---------------------------------------------------------------------
   SECCIÓN: Clientes (fichas que abren la página de cada proyecto)
   --------------------------------------------------------------------- */
function ClienteCard({ c, i }) {
  const simple = useSimple();
  return (
    <motion.a href={enlaceCliente(c.slug)} {...ABRE_CLIENTE} aria-label={`Ver el proyecto ${c.nombre}`}
      initial={simple ? false : { y: 44 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease, delay: i * 0.1 }}
      whileHover="hover" className="sombra group flex flex-col overflow-hidden rounded-[30px] bg-white">
      <div className="relative flex h-[360px] justify-center overflow-hidden" style={{ background: c.fondo }}>
        <Blob className="-right-16 -top-16 h-[280px] w-[280px]" color={c.brillo} />
        <motion.div variants={{ hover: { y: -16, rotate: -2 } }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="relative mt-12 origin-top scale-[0.84]">
          <Phone label={`App de ${c.nombre}`}><Pantalla c={c} p={c.portada} /></Phone>
        </motion.div>
        <span className="absolute left-5 top-5"><LogoCliente c={c} className="h-12 w-12" /></span>
      </div>
      <div className="flex items-center justify-between gap-4 p-6">
        <div className="flex min-w-0 flex-col">
          <h3 className="text-[20px] font-bold tracking-[-0.02em]">{c.nombre}</h3>
          <p className="text-[14.5px] text-gris-500">{c.tipo}</p>
        </div>
        <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tinta text-[18px] text-white transition-colors duration-300 group-hover:bg-acento group-hover:text-tinta">↗</span>
      </div>
    </motion.a>
  );
}

function Clientes() {
  return (
    <section id="clientes" aria-labelledby="clientes-title" className="scroll-mt-16 bg-white">
      <div className="container-page flex flex-col gap-12 py-24 md:gap-16 md:py-36">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionTitle id="clientes-title" eyebrow="Clientes" title="Apps que ya se usan cada día." />
          <p className="max-w-[40ch] text-entrada text-gris-500 lg:pb-2">Tres proyectos reales. Ábrelos para ver cómo funcionan y todo lo que hacen.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {CLIENTES.map((c, i) => <ClienteCard key={c.slug} c={c} i={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------
   PÁGINA DE PROYECTO
   --------------------------------------------------------------------- */
// Demostración en bucle: recorre el flujo principal con un toque animado, como un vídeo.
function DemoFlujo({ c }) {
  if (c.demoFija) return <Phone label={`App de ${c.nombre}`}><Pantalla c={c} p={c.portada} /></Phone>;
  return <DemoAnimada c={c} />;
}
function DemoAnimada({ c }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((x) => (x + 1) % c.flujo.length), 3000);
    return () => clearInterval(id);
  }, [c, reduce]);
  const paso = c.flujo[i];
  const [tx, ty] = paso.toque;
  return (
    <div className="relative">
      <Phone label={`Demostración de la app de ${c.nombre}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} className="h-full" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease }}>
            <Pantalla c={c} p={paso.p} />
          </motion.div>
        </AnimatePresence>
        {!reduce && (
          <motion.span key={`t${i}`} aria-hidden="true" className="pointer-events-none absolute z-30 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-tinta/25 shadow-lg"
            style={{ left: tx, top: ty }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1, 0.8, 1.4], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.2, delay: 1.5, times: [0, 0.3, 0.5, 1] }} />
        )}
      </Phone>
      <div className="mx-auto mt-5 flex w-32 gap-1.5" aria-hidden="true">
        {c.flujo.map((_, j) => (
          <span key={j} className="h-[3px] flex-1 overflow-hidden rounded-full bg-tinta/10">
            {j < i && <span className="block h-full w-full bg-tinta/50" />}
            {j === i && <motion.span key={`b${i}`} className="block h-full bg-gradient-to-r from-grad-a to-grad-b" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: reduce ? 0 : 3, ease: "linear" }} />}
          </span>
        ))}
      </div>
    </div>
  );
}

// Funciones de la app: cada función cambia la pantalla con un fundido y un acercamiento
// a la zona que la muestra. En escritorio avanza con el scroll; en móvil, con toques.
function TelefonoFuncion({ c, i, dir = 1 }) {
  const f = c.funciones[i];
  return (
    <div className="relative">
      <motion.div key={`marco-${i}`} initial={{ scale: 0.965, y: 10 * dir }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 160, damping: 18 }}>
        <Phone label={`${f.t}: ${f.d}`}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div key={f.p.img || f.p.s} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }} transition={{ duration: 0.55, ease }}>
              <Pantalla c={c} p={f.p} />
            </motion.div>
          </AnimatePresence>
          {/* barrido de luz en cada cambio */}
          <motion.span key={`luz-${i}`} aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)]"
            initial={{ x: "-120%" }} animate={{ x: "120%" }} transition={{ duration: 0.9, ease }} />
        </Phone>
      </motion.div>
      <motion.span key={`num-${i}`} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="absolute -right-5 -top-4 z-40 rounded-full bg-tinta px-3 py-1.5 text-[12px] font-semibold text-white shadow-lg tnum">
        {i + 1} / {c.funciones.length}
      </motion.span>
    </div>
  );
}

function Etiqueta({ f, activa, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={activa}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold transition-all duration-500 ${activa ? "scale-105 bg-tinta text-white shadow-[0_14px_34px_-14px_rgba(17,17,17,0.55)]" : "glass text-gris-700 shadow-[0_10px_26px_-18px_rgba(17,17,17,0.35),0_0_0_1px_rgba(17,17,17,0.06)] hover:text-tinta"}`}>
      <span className={`h-2 w-2 rounded-full transition-colors duration-500 ${activa ? "bg-acento" : "bg-gris-300"}`} />{f.t}
    </button>
  );
}

function Rotulo({ f, i }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }} className="flex max-w-[34ch] flex-col items-center gap-1 text-center">
        <span className="text-[19px] font-bold tracking-[-0.02em]">{f.t}</span>
        <span className="text-[15px] leading-snug text-gris-500">{f.d}</span>
      </motion.div>
    </AnimatePresence>
  );
}

function FuncionesMovil({ c }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || reduce) return;
    const id = setInterval(() => setI((x) => (x + 1) % c.funciones.length), 3400);
    return () => clearInterval(id);
  }, [auto, reduce, c]);
  return (
    <section aria-labelledby="funciones-title" className="relative overflow-hidden bg-white">
      <Blob className="left-[calc(50%-260px)] top-[12%] h-[520px] w-[520px]" color={c.brillo} />
      <div className="container-page relative flex flex-col items-center gap-8 pb-20 pt-28">
        <SectionTitle center id="funciones-title" eyebrow="Funciones" title="Todo lo que hace la app." />
        <TelefonoFuncion c={c} i={i} />
        <Rotulo f={c.funciones[i]} i={i} />
        <div className="flex flex-wrap justify-center gap-2">
          {c.funciones.map((f, j) => <Etiqueta key={f.t} f={f} activa={j === i} onClick={() => { setI(j); setAuto(false); }} />)}
        </div>
      </div>
    </section>
  );
}

function FuncionesEscritorio({ c }) {
  const ref = useRef(null);
  const n = c.funciones.length;
  const [i, setI] = useState(0);
  const prev = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const k = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setI((x) => { prev.current = x; return k; });
  });
  const barra = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const ir = (j) => {
    const el = ref.current; if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const recorrido = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + recorrido * ((j + 0.5) / n), behavior: "smooth" });
  };
  const mitad = Math.ceil(n / 2);
  const columna = (desde, hasta, lado) => (
    <ul className={`flex flex-col gap-5 ${lado === "izq" ? "items-end" : "items-start"}`}>
      {c.funciones.slice(desde, hasta).map((f, k) => {
        const j = desde + k;
        return (
          <motion.li key={f.t} animate={{ x: j === i ? (lado === "izq" ? -8 : 8) : 0, opacity: j === i ? 1 : 0.55 }} transition={{ duration: 0.45, ease }}
            className={k % 2 ? (lado === "izq" ? "pr-10" : "pl-10") : ""}>
            <Etiqueta f={f} activa={j === i} onClick={() => ir(j)} />
          </motion.li>
        );
      })}
    </ul>
  );
  return (
    <section ref={ref} aria-labelledby="funciones-title" className="relative mt-24 bg-white" style={{ height: `${100 + n * (n > 8 ? 30 : 38)}vh` }}>
      <div className="sticky top-16 flex h-[calc(100vh-64px)] items-center overflow-hidden">
        <Blob className="left-[calc(50%-300px)] top-[18%] h-[600px] w-[600px]" color={c.brillo} />
        <div className="container-page relative flex flex-col items-center gap-6">
          <SectionTitle center id="funciones-title" eyebrow="Funciones" title="Todo lo que hace la app." />
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-10 [@media(max-height:860px)]:-my-10 [@media(max-height:860px)]:scale-[0.86]">
            {columna(0, mitad, "izq")}
            <TelefonoFuncion c={c} i={i} dir={i >= prev.current ? 1 : -1} />
            {columna(mitad, n, "der")}
          </div>
          <div className="flex w-full max-w-[420px] flex-col items-center gap-4">
            <Rotulo f={c.funciones[i]} i={i} />
            <span className="relative h-[3px] w-40 overflow-hidden rounded-full bg-gris-100" aria-hidden="true">
              <motion.span style={{ scaleX: barra }} className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-grad-a to-grad-b" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Telefono3D({ c }) {
  const simple = useSimple();
  return simple ? <FuncionesMovil c={c} /> : <FuncionesEscritorio c={c} />;
}

function Pie() {
  return (
    <footer className="container-page flex flex-col items-center gap-4 border-t border-linea pb-10 pt-10 text-center text-[13px] text-gris-400 md:flex-row md:justify-between md:pb-8 md:pt-8 md:text-left">
      <Logo className="h-4 w-auto" />
      <span>Apps web a medida</span>
      <a href={CONTACTO.gmail} {...EXTERNO} className="select-all font-medium text-tinta transition-colors hover:text-acento-texto">{CONTACTO.email}</a>
      <span>© 2026 PULSE</span>
    </footer>
  );
}

export function Proyecto({ slug }) {
  const c = CLIENTES.find((x) => x.slug === slug) || CLIENTES[0];
  const otros = CLIENTES.filter((x) => x.slug !== c.slug);
  return (
    <>
      <ScrollProgress />
      <header className="glass sticky z-50 shadow-[0_1px_0_rgba(17,17,17,0.06)]" style={{ top: "env(safe-area-inset-top, 0px)" }}>
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <a href={irA("top")} aria-label="PULSE, inicio"><Wordmark className="h-[15px] w-auto md:h-[17px]" /></a>
          <a href={irA("clientes")} className="text-[14px] font-semibold text-gris-500 transition-colors hover:text-tinta">← Volver a clientes</a>
        </div>
      </header>
      <main>
        <section aria-labelledby="proyecto-title" className="relative overflow-hidden" style={{ background: c.fondo }}>
          <Blob className="-right-24 -top-24 h-[520px] w-[520px]" color={c.brillo} />
          <div className="container-page relative flex flex-col gap-14 py-16 md:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
              <div className="order-2 flex justify-center lg:order-1">
                <Tilt max={6}><DemoFlujo c={c} /></Tilt>
              </div>
              <div className="order-1 flex flex-col gap-6 lg:order-2">
                <div className="flex items-center gap-4">
                  <LogoCliente c={c} className="h-16 w-16" />
                  <span className="flex flex-col"><span className="text-[13px] font-medium text-gris-500">Cliente</span><span className="text-[15px] font-semibold">{c.tipo}</span></span>
                </div>
                <h1 id="proyecto-title" className="text-[clamp(2.6rem,6vw,5rem)] font-bold leading-[0.98] tracking-[-0.045em]">{c.nombre}</h1>
                <p className="max-w-[44ch] text-[clamp(1.1rem,1.6vw,1.3rem)] leading-relaxed text-gris-700">{c.resumen}</p>
                <ul className="flex flex-wrap gap-2">
                  {["App web progresiva", "Se instala desde el navegador", "Hecha a medida"].map((x) => <li key={x} className="rounded-full bg-white/80 px-3.5 py-1.5 text-[13px] font-medium text-gris-700 ring-1 ring-tinta/5">{x}</li>)}
                </ul>
              </div>
            </div>
            <div className="grid gap-6 border-t border-tinta/10 pt-10 md:grid-cols-2 md:gap-12">
              {c.descripcion.map((p, i) => <p key={i} className="text-[17px] leading-relaxed text-gris-700">{p}</p>)}
            </div>
          </div>
        </section>

        <Telefono3D c={c} />

        <section aria-labelledby="otros-title" className="bg-papel">
          <div className="container-page flex flex-col gap-8 py-20">
            <h2 id="otros-title" className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold tracking-[-0.03em]">Más proyectos</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {otros.map((o) => (
                <a key={o.slug} href={enlaceCliente(o.slug)} className="sombra group flex items-center gap-5 rounded-[24px] bg-white p-5 transition-transform duration-300 hover:-translate-y-1">
                  <LogoCliente c={o} className="h-14 w-14" />
                  <span className="flex min-w-0 flex-1 flex-col"><span className="text-[18px] font-bold tracking-[-0.02em]">{o.nombre}</span><span className="text-[14px] text-gris-500">{o.tipo}</span></span>
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-tinta text-white transition-colors group-hover:bg-acento group-hover:text-tinta">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="proyecto-cta" className="bg-white">
          <div className="container-page py-10">
            <div className="on-dark relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-[36px] bg-tinta px-6 py-14 text-white md:flex-row md:items-center md:justify-between md:px-14">
              <Blob className="-left-20 -top-28 -z-10 h-[380px] w-[380px]" color="rgba(255,79,0,0.45)" />
              <h2 id="proyecto-cta" className="max-w-[18ch] text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold leading-[1.05] tracking-[-0.04em]">¿Quieres una app así para tu negocio?</h2>
              <Button href={irA("contacto")} variant="accent">Cuéntanos qué necesitas</Button>
            </div>
          </div>
        </section>
      </main>
      <Pie />
    </>
  );
}

/* ---------------------------------------------------------------------
   SECCIÓN: Cómo trabajamos
   Escritorio: los pasos avanzan con el scroll y el móvil fijo cambia de pantalla.
   Móvil: lista simple de pasos.
   --------------------------------------------------------------------- */
function PantallaPaso({ i }) {
  if (i === 0) return <ReunionScreen />;
  if (i === 1) return <WAChat name="PULSE" sub="Cuenta de empresa" msgs={MSGS_NECESIDAD} delayStep={0.35} />;
  if (i === 2) return <PresupuestoScreen />;
  if (i === 3) return <WireframeScreen />;
  if (i === 4) return <FeedbackScreen />;
  return <PilatesScreen />;
}

// Aviso flotante de cada paso. lado: dónde aparece respecto del teléfono.
const AVISOS_PASO = [
  { icon: "cal", app: "Calendario", title: "Reunión con PULSE", body: "Martes 4 · 10:00 · Videollamada", time: "ahora", lado: "der" },
  { icon: "wa", app: "WhatsApp", title: "Laura · Estudio Arrel", body: "Quiero que las alumnas reserven solas.", time: "10:09", lado: "der" },
  { icon: "pulse", app: "PULSE", title: "Presupuesto enviado", body: "Versión 1, hecha a tu medida", time: "ahora", lado: "izq" },
  { icon: "pulse", app: "PULSE", title: "Tu prototipo está listo", body: "Pruébalo desde el móvil y dinos qué cambiarías.", time: "ahora", lado: "der" },
  { icon: "pulse", app: "PULSE", title: "2 cambios aplicados", body: "Botón más grande y lista de espera.", time: "hace 1 min", lado: "der" },
  { icon: "pulse", app: "Arrel Reservas", title: "Primera reserva", body: "Reformer · jueves 9:00", time: "ahora", lado: "izq" },
];

function TrabajamosMovil() {
  return (
    <section id="trabajamos" aria-labelledby="trabajamos-title-m" className="scroll-mt-16 bg-papel">
      <div className="container-page flex flex-col gap-10 py-24">
        <SectionTitle id="trabajamos-title-m" title="¿Cómo trabajamos?" />
        <ol className="flex flex-col gap-3">
          {PASOS.map((p, i) => (
            <li key={p.t} className="flex gap-4 rounded-[22px] bg-white p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-grad-a to-grad-b text-[14px] font-bold text-tinta">{i + 1}</span>
              <span className="flex flex-col gap-1 pt-1">
                <span className="text-[18px] font-bold leading-tight tracking-[-0.02em]">{p.t}</span>
                <span className="text-[15px] leading-relaxed text-gris-500">{p.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Escritorio: la sección queda fija y cada tramo de scroll es un paso con su propio movimiento del teléfono.
function TrabajamosEscritorio() {
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = PASOS.length;
  useMotionValueEvent(p, "change", (v) => setStep(Math.min(n - 1, Math.max(0, Math.floor(v * n)))));

  const sp = { stiffness: 80, damping: 20, mass: 0.7 };
  const at = PASOS.map((_, i) => i / (n - 1));
  const x = useSpring(useTransform(p, at, [0, -150, 150, 0, -120, 0]), sp);
  const y = useSpring(useTransform(p, at, [24, 0, -12, -6, 12, 0]), sp);
  const rot = useSpring(useTransform(p, at, [-3, -8, 7, 0, -5, 0]), sp);
  const sc = useSpring(useTransform(p, at, [0.94, 1, 1, 1.07, 1, 1.03]), sp);
  const bar = useTransform(p, [0, 1], [0, 1]);
  const aviso = AVISOS_PASO[step];

  return (
    <section id="trabajamos" ref={ref} aria-labelledby="trabajamos-title" className="relative h-[300vh] bg-papel">
      <div className="sticky top-16 flex h-[calc(100vh-64px)] items-center overflow-hidden">
        <div className="container-page grid grid-cols-[0.85fr_1.15fr] items-center gap-10">
          <div className="flex min-w-0 flex-col gap-10">
            <SectionTitle id="trabajamos-title" title="¿Cómo trabajamos?" />
            <div className="flex gap-6">
              <div className="relative w-[2px] shrink-0 overflow-hidden rounded-full bg-gris-200" aria-hidden="true">
                <motion.div style={{ scaleY: bar }} className="absolute inset-0 origin-top bg-gradient-to-b from-grad-a to-grad-b" />
              </div>
              <ol className="flex flex-col gap-4">
                {PASOS.map((s, i) => (
                  <li key={s.t} className="flex flex-col gap-1.5">
                    <span className="flex items-baseline gap-3">
                      <motion.span animate={{ color: i <= step ? "#C2410C" : "#B8B8B4" }} transition={{ duration: 0.4 }} className="w-5 shrink-0 text-[14px] font-bold tnum">{i + 1}</motion.span>
                      <motion.span animate={{ color: i === step ? "#111111" : "#B8B8B4" }} transition={{ duration: 0.4 }} className="text-[clamp(1.1rem,1.6vw,1.375rem)] font-bold leading-tight tracking-[-0.025em]">{s.t}</motion.span>
                    </span>
                    <AnimatePresence initial={false}>
                      {i === step && (
                        <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }}
                          className="max-w-[40ch] overflow-hidden pl-8 text-[15.5px] leading-relaxed text-gris-500">
                          {s.d}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="relative flex h-[560px] origin-center scale-[0.8] items-center justify-center lg:scale-[0.9] xl:scale-100">
            <Blob className="left-[calc(50%-260px)] top-[calc(50%-260px)] h-[520px] w-[520px]" color="rgba(255,79,0,0.18)" />
            <motion.div style={{ x, y, rotate: rot, scale: sc }} className="relative z-10">
              <Phone label={`Paso ${step + 1}: ${PASOS[step].t}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={step} className="h-full" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }}>
                    <PantallaPaso i={step} />
                  </motion.div>
                </AnimatePresence>
              </Phone>
              <span className="absolute -right-5 -top-4 rounded-full bg-tinta px-3 py-1.5 text-[12px] font-semibold text-white shadow-lg tnum">{step + 1} / {n}</span>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div key={step} aria-hidden="true"
                initial={{ opacity: 0, x: aviso.lado === "der" ? 30 : -30, y: 10, scale: 0.96 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.97 }} transition={{ duration: 0.45, ease, delay: 0.15 }}
                className={`pointer-events-none absolute z-20 ${aviso.lado === "der" ? "right-0 top-[90px]" : "left-0 bottom-[110px]"}`}>
                <Notif icon={aviso.icon} app={aviso.app} title={aviso.title} body={aviso.body} time={aviso.time} className="w-[270px]" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Trabajamos() {
  const simple = useSimple();
  return simple ? <TrabajamosMovil /> : <TrabajamosEscritorio />;
}

/* ---------------------------------------------------------------------
   SECCIÓN: Integraciones
   --------------------------------------------------------------------- */
function IntegracionTile({ it, align }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3, ease }} className={`vidrio flex items-start gap-4 rounded-[24px] p-5 ${align === "der" ? "lg:flex-row-reverse lg:text-right" : ""}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white text-tinta shadow-[0_0_0_1px_rgba(17,17,17,0.06),0_6px_14px_-8px_rgba(17,17,17,0.25)]"><Glyph kind={it.id} className="h-[22px] w-[22px]" /></span>
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="text-[16px] font-bold tracking-[-0.01em]">{it.n}</h3>
        <p className="text-[14px] leading-snug text-gris-500">{it.d}</p>
      </div>
    </motion.div>
  );
}

function Integraciones() {
  const simple = useSimple();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "center 0.5"] });
  const draw = useTransform(scrollYProgress, [0, 1], [simple ? 1 : 0, 1]);
  const izq = INTEGRACIONES.filter((i) => i.lado === "izq");
  const der = INTEGRACIONES.filter((i) => i.lado === "der");
  const paths = ["M250 67 C 370 67, 390 200, 500 200", "M250 200 L 500 200", "M250 333 C 370 333, 390 200, 500 200", "M750 67 C 630 67, 610 200, 500 200", "M750 200 L 500 200", "M750 333 C 630 333, 610 200, 500 200"];

  return (
    <section id="integraciones" ref={ref} aria-labelledby="int-title" className="relative overflow-hidden bg-white">
      <Blob className="left-[8%] top-[38%] h-[420px] w-[420px]" color="rgba(255,79,0,0.14)" />
      <Blob className="right-[6%] top-[52%] h-[460px] w-[460px]" color="rgba(255,170,120,0.22)" />
      <div className="container-page flex flex-col gap-14 py-24 md:gap-20 md:py-36">
        <SectionTitle as="h3" center id="int-title" eyebrow="Integraciones" title="Se lleva bien con lo que ya usas." lead="Tu app no te obliga a dejar tus herramientas: las conecta y también cobra por ti, para que la información y los pagos pasen solos de un sitio a otro." />

        <div className="relative">
          {!simple && (
            <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
              {paths.map((d, i) => (
                <g key={i}>
                  <motion.path d={d} fill="none" stroke="#D9D9D5" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ pathLength: draw }} />
                  <motion.path d={d} fill="none" stroke={ACENTO.base} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="0.06 1"
                    initial={{ strokeDashoffset: i < 3 ? 0.06 : -1 }} animate={{ strokeDashoffset: i < 3 ? -1 : 0.06 }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }} />
                </g>
              ))}
            </svg>
          )}
          <div className="relative grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-24">
            <div className="order-2 flex flex-col gap-5 lg:order-1 lg:gap-12">{izq.map((it) => <IntegracionTile key={it.id} it={it} align="izq" />)}</div>
            <div className="order-1 flex justify-center lg:order-2">
              <div className="relative flex h-40 w-40 flex-col items-center justify-center gap-3 rounded-[40px] bg-gradient-to-br from-grad-a to-grad-b text-tinta shadow-[0_40px_80px_-30px_rgba(255,79,0,0.7)]">
                {!simple && <motion.span aria-hidden="true" className="absolute inset-0 rounded-[40px] ring-2 ring-[#FF8A3D]" animate={{ scale: [1, 1.12], opacity: [0.5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} />}
                <svg viewBox="0 0 24 24" className="h-12 w-12" aria-hidden="true">
                  <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="#111111" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="#111111" opacity=".35" />
                  <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill="#111111" opacity=".35" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="#111111" />
                </svg>
                <span className="text-[14px] font-semibold">Tu app</span>
              </div>
            </div>
            <div className="order-3 flex flex-col gap-5 lg:gap-12">{der.map((it) => <IntegracionTile key={it.id} it={it} align="der" />)}</div>
          </div>
        </div>
        <p className="text-center text-[14px] text-gris-400">¿Usas otra herramienta? Pregúntanos: si tiene forma de conectarse, la conectamos.</p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------
   SECCIÓN: Asistente de WhatsApp (bot con la API oficial de WhatsApp Business)
   --------------------------------------------------------------------- */
const BOT_FLUJO = {
  inicio: { bot: "Hola Laura, soy el asistente de Estudio Arrel. ¿En qué te ayudo?", opciones: [["Reservar una clase", "reservar"], ["Ver mi bono", "bono"], ["Hablar con alguien", "humano"]] },
  reservar: { bot: "Estas son las clases de mañana con plazas libres:", opciones: [["9:00 · Reformer · 3 libres", "ok:el Reformer de las 9:00"], ["11:30 · Mat suave · 5 libres", "ok:Mat suave de las 11:30"], ["19:30 · Stretching · 6 libres", "ok:Stretching de las 19:30"]] },
  bono: { bot: "Te quedan 6 de tus 10 clases. El bono vence el 31 de diciembre.", opciones: [["Comprar otro bono", "comprar"], ["Volver al inicio", "inicio"]] },
  comprar: { bot: "Te paso el enlace para pagarlo con tarjeta:\narrel.app/bonos\n\nEn cuanto se confirme el pago, las clases se suman a tu cuenta.", opciones: [["Volver al inicio", "inicio"]] },
  humano: { bot: "Te paso con Núria. Ahora está dando clase y te responde en cuanto termine.", sistema: "Conversación asignada a Núria", opciones: [["Volver al inicio", "inicio"]] },
};
function pasoBot(clave) {
  if (clave.startsWith("ok:")) {
    const clase = clave.slice(3);
    return { bot: `Listo, tienes plaza en ${clase}. Te quedan 5 clases en tu bono.\n\nMañana a las 18:00 te mando un recordatorio.`, opciones: [["Volver al inicio", "inicio"]] };
  }
  return BOT_FLUJO[clave];
}
function minutos(n) { const m = 2 + n; return `10:${String(m).padStart(2, "0")}`; }

function WABot() {
  const [msgs, setMsgs] = useState([{ from: "me", text: "Hola!", time: "10:01" }, { from: "them", text: BOT_FLUJO.inicio.bot, time: "10:01" }]);
  const [opciones, setOpciones] = useState(BOT_FLUJO.inicio.opciones);
  const [typing, setTyping] = useState(false);
  const scroller = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, opciones]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const elegir = ([label, clave]) => {
    if (typing) return;
    const t = minutos(msgs.length);
    setMsgs((m) => [...m, { from: "me", text: label, time: t, read: true }]);
    setOpciones([]);
    setTyping(true);
    timer.current = setTimeout(() => {
      const r = pasoBot(clave);
      setTyping(false);
      setMsgs((m) => [...m, ...(r.sistema ? [{ from: "sys", text: r.sistema }] : []), { from: "them", text: r.bot, time: t }]);
      setOpciones(r.opciones);
    }, 850);
  };

  return (
    <div className="flex h-full flex-col font-sys">
      <div className="bg-wa-barra">
        <StatusBar />
        <div className="flex items-center gap-2 px-3 pb-2 pt-1.5">
          <span className="text-[17px] leading-none text-wa-boton" aria-hidden="true">‹</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tinta font-sans text-[13px] font-bold text-white">A</span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-center gap-1 truncate text-[12.5px] font-semibold text-wa-texto">
              Estudio Arrel
              <svg viewBox="0 0 12 12" className="h-3 w-3" aria-label="Cuenta verificada"><circle cx="6" cy="6" r="6" fill="#25D366" /><path d="M3.4 6.2 5.2 8l3.4-3.8" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="truncate text-[9.5px] text-wa-gris">{typing ? "escribiendo…" : "Cuenta de empresa"}</span>
          </span>
        </div>
      </div>
      <div ref={scroller} className="wa-wall no-scrollbar flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3" aria-live="polite">
        <span className="mx-auto mb-1 rounded-[6px] bg-white/90 px-2 py-[3px] text-[9.5px] font-medium text-wa-gris shadow-[0_1px_0.5px_rgba(11,20,26,0.1)]">HOY</span>
        {msgs.map((m, i) =>
          m.from === "sys" ? (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto my-1 rounded-[6px] bg-[#FFF3C4] px-2 py-1 text-center text-[9.5px] text-wa-texto/80">{m.text}</motion.span>
          ) : (
            <Burbuja key={i} from={m.from} time={m.time} read={m.read !== false}>{m.text}</Burbuja>
          )
        )}
        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-1 self-start rounded-[9px] rounded-tl-[2px] bg-white px-3 py-2.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]" aria-label="El asistente está escribiendo">
              {[0, 1, 2].map((d) => <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-wa-gris" animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />)}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {opciones.length > 0 && (
            <motion.div key={opciones[0][1]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} className="flex w-[82%] flex-col gap-1 self-start">
              {opciones.map((o) => (
                <button key={o[1]} type="button" onClick={() => elegir(o)}
                  className="flex items-center justify-center gap-1.5 rounded-[9px] bg-white px-2 py-2 text-[11.5px] font-medium text-[#027EB5] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] transition-colors hover:bg-[#F7F8FA] active:bg-[#EEF1F4]">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true"><path d="M6 4 2 8l4 4M2.5 8H10a4 4 0 0 1 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {o[0]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-1.5 bg-wa-barra px-2 py-2">
        <span className="flex-1 rounded-full bg-white px-3 py-1.5 text-[11px] text-wa-gris">Mensaje</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-wa-boton text-white" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.1A7 7 0 0 0 19 12Z" fill="currentColor" /></svg>
        </span>
      </div>
    </div>
  );
}

const BOT_PUNTOS = [
  ["Responde al momento", "A cualquier hora, también de noche y en fin de semana."],
  ["Reserva, cambia y cancela", "Con los mismos datos que tu app: si no hay plaza, no la da."],
  ["Consulta bonos, pedidos o stock", "Tus clientes preguntan y el asistente contesta con la información real."],
  ["Te pasa la conversación", "Si no sabe algo o piden hablar con alguien, te avisa a ti o a tu equipo."],
];

function Asistente() {
  const simple = useSimple();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const k = simple ? 0 : 1;
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [80 * k, -80 * k]), { stiffness: 90, damping: 24 });
  const rot = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [4 * k, 0, -3 * k]), { stiffness: 90, damping: 24 });
  return (
    <section id="asistente" ref={ref} aria-labelledby="bot-title" className="bg-white">
      <div className="container-page grid items-center gap-12 py-24 md:py-36 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="flex min-w-0 flex-col gap-10">
          <SectionTitle as="h3" id="bot-title" eyebrow="Asistente de WhatsApp" title="Tus clientes escriben. Tu app contesta." lead="Un asistente que responde por WhatsApp con la información de tu app: reserva, consulta y te pasa la conversación cuando hace falta una persona." />
          <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {BOT_PUNTOS.map(([t, d]) => (
              <li key={t} className="flex flex-col gap-1.5 border-t border-linea pt-4">
                <span className="text-[16px] font-bold tracking-[-0.01em]">{t}</span>
                <span className="text-[14.5px] leading-snug text-gris-500">{d}</span>
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-papel px-3.5 py-2 text-[13px] text-gris-700">
            <span className="h-2 w-2 rounded-full bg-wa-verde" />
            Funciona con la API oficial de WhatsApp Business
          </span>
        </div>
        <div className="relative flex min-h-[600px] items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFEFE6] via-[#FBF6F2] to-papel px-6 py-12">
          <Blob className="-right-24 -top-24 h-[400px] w-[400px]" color="rgba(255,79,0,0.2)" />
          <Blob className="-bottom-24 -left-16 h-[360px] w-[360px]" color="rgba(255,170,120,0.28)" />
          <motion.div style={{ y, rotate: rot }} className="relative">
            <Phone label="Asistente de WhatsApp de un estudio de pilates"><WABot /></Phone>
          </motion.div>
          <span className="absolute bottom-4 right-5 font-mono text-[11px] uppercase tracking-[0.1em] text-gris-400">Pruébalo: toca una opción</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------
   SECCIÓN: Ventajas
   --------------------------------------------------------------------- */
function Marca({ v }) {
  if (v === "✓") return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-tinta" aria-label="Sí"><svg viewBox="0 0 12 12" className="w-3"><path d="M2.5 6.3 5 8.6 9.5 3.4" fill="none" stroke={ACENTO.claro} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
  if (v === "~") return <span className="inline-flex h-6 items-center rounded-full bg-papel px-2.5 text-[12px] font-medium text-gris-500" aria-label="A medias">a medias</span>;
  return <span className="inline-flex h-6 w-6 items-center justify-center text-[15px] text-gris-300" aria-label="No">—</span>;
}

// Iconos de la comparativa
function Cruz() {
  return (
    <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gris-100" aria-label="En contra">
      <svg viewBox="0 0 12 12" className="w-2.5"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" fill="none" stroke="#8A8A86" strokeWidth="1.7" strokeLinecap="round" /></svg>
    </span>
  );
}
function CheckPulse() {
  return (
    <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-grad-a to-grad-b shadow-[0_4px_12px_-4px_rgba(255,79,0,0.8)]" aria-label="A favor">
      <svg viewBox="0 0 12 12" className="w-3"><path d="M2.5 6.3 5 8.6 9.5 3.4" fill="none" stroke="#111111" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

// Comparativa en móvil: se elige la alternativa y cada fila queda como tarjeta
function ComparativaMovil() {
  const [alt, setAlt] = useState(0);
  const op = COMPARATIVA.alt[alt];
  return (
    <div className="flex flex-col gap-3 md:hidden">
      <div className="sombra flex flex-col gap-2.5 rounded-[22px] bg-white p-4">
        <span className="text-[13px] font-medium text-gris-500">Comparar PULSE con:</span>
        <div role="tablist" aria-label="Alternativa a comparar" className="grid grid-cols-2 gap-1 rounded-full bg-papel p-1">
          {COMPARATIVA.alt.map((o, i) => (
            <button key={o.t} type="button" role="tab" aria-selected={alt === i} onClick={() => setAlt(i)}
              className={`relative rounded-full py-2 text-[13px] font-semibold transition-colors ${alt === i ? "text-tinta" : "text-gris-500"}`}>
              {alt === i && <motion.span layoutId="comp-movil" className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(17,17,17,0.12)]" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
              <span className="relative">{o.corto}</span>
            </button>
          ))}
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {COMPARATIVA.rows.map((r) => (
          <li key={r.t} className="sombra flex flex-col gap-3 rounded-[22px] bg-white p-4">
            <h4 className="text-[17px] font-bold tracking-[-0.015em]">{r.t}</h4>
            <motion.div key={`${alt}-${r.t}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease }} className="flex gap-2.5 rounded-[14px] bg-papel p-3">
              <Cruz />
              <span className="flex flex-col gap-0.5">
                <span className="text-[12px] font-semibold text-gris-400">{op.corto}</span>
                <span className="text-[14px] leading-snug text-gris-500">{alt === 0 ? r.a : r.b}</span>
              </span>
            </motion.div>
            <div className="flex gap-2.5 rounded-[14px] bg-tinta p-3 shadow-[0_14px_30px_-18px_rgba(255,79,0,0.6)]">
              <CheckPulse />
              <span className="flex flex-col gap-1.5">
                <Logo tone="dark" className="h-[11px] w-auto self-start" />
                <span className="text-[14px] font-medium leading-snug text-white">{r.p}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComparativaEscritorio() {
  return (
    <div className="relative hidden md:block">
      <Blob className="-right-24 -top-16 h-[420px] w-[420px]" color="rgba(255,79,0,0.18)" />
      <div className="sombra relative overflow-hidden rounded-[28px] bg-white">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup><col className="w-[20%]" /><col className="w-[26%]" /><col className="w-[26%]" /><col className="w-[28%]" /></colgroup>
          <thead>
            <tr>
              <th scope="col" className="p-6 align-bottom text-[13px] font-semibold text-gris-400">Qué necesitas</th>
              {COMPARATIVA.alt.map((o) => (
                <th key={o.t} scope="col" className="p-6 align-bottom">
                  <span className="flex flex-col gap-1">
                    <span className="text-[16px] font-bold leading-tight tracking-[-0.01em] text-tinta">{o.t}</span>
                    <span className="text-[13px] font-medium text-gris-400">{o.sub}</span>
                  </span>
                </th>
              ))}
              <th scope="col" className="relative bg-tinta p-6 align-bottom text-white">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-grad-a to-grad-b" />
                <span className="flex flex-col gap-2">
                  <Logo tone="dark" className="h-[18px] w-auto self-start" />
                  <span className="text-[13px] font-medium text-white/60">App a medida</span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARATIVA.rows.map((r) => (
              <motion.tr key={r.t} whileHover={{ backgroundColor: "rgba(244,244,242,0.55)" }} className="border-t border-linea">
                <th scope="row" className="p-6 align-top text-[15px] font-bold leading-snug">{r.t}</th>
                {[r.a, r.b].map((txt, i) => (
                  <td key={i} className="p-6 align-top"><span className="flex gap-3 text-[14.5px] leading-relaxed text-gris-500"><Cruz />{txt}</span></td>
                ))}
                <td className="border-t border-white/10 bg-tinta p-6 align-top">
                  <span className="flex gap-3 text-[14.5px] font-medium leading-relaxed text-white"><CheckPulse />{r.p}</span>
                </td>
              </motion.tr>
            ))}
            <tr className="border-t border-linea">
              <td colSpan={3} aria-hidden="true" />
              <td className="border-t border-white/10 bg-tinta p-6"><Button href={CONTACTO.gmail} variant="accent" className="w-full">Quiero mi app</Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Bloques interactivos de Ventajas ---
// 1. Tu proceso, en tu orden: los pasos se reordenan solos (o con un toque).
function VisualProceso() {
  const t = useTick(2400);
  const [extra, setExtra] = useState(0);
  const orden = [["Reserva", "Pago", "Recordatorio", "Factura"], ["Pago", "Reserva", "Factura", "Recordatorio"], ["Reserva", "Recordatorio", "Pago", "Factura"]][(t + extra) % 3];
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {orden.map((x, i) => (
          <motion.span layout key={x} transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] font-semibold ${i === 0 ? "bg-tinta text-white" : "bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.06)]"}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] tnum ${i === 0 ? "bg-acento text-tinta" : "bg-papel"}`}>{i + 1}</span>{x}
          </motion.span>
        ))}
      </div>
      <button type="button" onClick={() => setExtra((e) => e + 1)} className="rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-gris-700 ring-1 ring-linea transition hover:ring-tinta">Cambiar el orden</button>
    </div>
  );
}

// 2. Todo en un solo sitio: las herramientas sueltas se juntan en tu app.
function VisualJunto() {
  const t = useTick(2600);
  const [hover, setHover] = useState(false);
  const junto = hover || t % 2 === 1;
  const tools = [["cal", "Calendario", -110, -46], ["sheets", "Excel", 104, -52], ["wa", "WhatsApp", -98, 50], ["note", "Libreta", 112, 44]];
  return (
    <div onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)} onPointerLeave={() => setHover(false)} className="relative flex h-[170px] w-full items-center justify-center">
      {tools.map(([k, l, x, y]) => (
        <motion.span key={k} animate={junto ? { x: 0, y: 0, scale: 0.4, opacity: 0 } : { x, y, scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="absolute flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold shadow-[0_0_0_1px_rgba(17,17,17,0.06),0_8px_18px_-10px_rgba(17,17,17,0.3)]">
          <Glyph kind={k} className="h-4 w-4" />{l}
        </motion.span>
      ))}
      <motion.span animate={{ scale: junto ? 1 : 0.55, opacity: junto ? 1 : 0.35 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-[24px] bg-gradient-to-br from-grad-a to-grad-b text-[12px] font-bold text-tinta shadow-[0_20px_40px_-18px_rgba(255,79,0,0.8)]">
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="#111111" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="#111111" opacity=".35" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill="#111111" opacity=".35" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="#111111" /></svg>
        Tu app
      </motion.span>
    </div>
  );
}

// 3. Tu marca: elige un color y la app se viste con él.
const COLORES_MARCA = [["Naranja", "#FF4F00"], ["Violeta", "#4B3AD6"], ["Verde", "#2F7D63"], ["Terracota", "#D9704A"]];
function VisualMarca() {
  const t = useTick(2200);
  const [elegido, setElegido] = useState(null);
  const i = elegido ?? t % COLORES_MARCA.length;
  const [nombre, color] = COLORES_MARCA[i];
  return (
    <div className="flex w-full items-center justify-center gap-6">
      <div className="w-[150px] overflow-hidden rounded-[18px] bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.06),0_14px_30px_-16px_rgba(17,17,17,0.35)]">
        <motion.div animate={{ backgroundColor: color }} transition={{ duration: 0.4 }} className="flex h-12 items-end px-3 pb-2"><span className="text-[12px] font-bold text-white">Tu negocio</span></motion.div>
        <div className="flex flex-col gap-1.5 p-3">
          <span className="h-2 w-3/4 rounded-full bg-gris-100" /><span className="h-2 w-1/2 rounded-full bg-gris-100" />
          <motion.span animate={{ backgroundColor: color }} transition={{ duration: 0.4 }} className="mt-1.5 rounded-full py-1.5 text-center text-[10.5px] font-bold text-white">Reservar</motion.span>
        </div>
      </div>
      <div role="radiogroup" aria-label="Color de tu marca" className="flex flex-col gap-2">
        {COLORES_MARCA.map(([n, c], j) => (
          <button key={n} type="button" role="radio" aria-checked={j === i} aria-label={n} onClick={() => setElegido(j)}
            className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${j === i ? "ring-2 ring-tinta ring-offset-2" : ""}`} style={{ background: c }} />
        ))}
        <span className="sr-only" aria-live="polite">{nombre}</span>
      </div>
    </div>
  );
}

// 4. Sin cuotas por usuario: suma personas y compara.
function VisualUsuarios() {
  const [n, setN] = useState(5);
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="ventajas-personas" className="text-[13px] font-semibold">Personas en tu equipo</label>
        <span className="rounded-full bg-tinta px-2.5 py-0.5 text-[13px] font-bold text-white tnum">{n}</span>
      </div>
      <input id="ventajas-personas" type="range" min={1} max={15} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full accent-[#FF4F00]" />
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-medium text-gris-500">Apps que cobran por usuario</span>
          <span className="h-3 overflow-hidden rounded-full bg-gris-100"><motion.span className="block h-full rounded-full bg-gris-300" animate={{ width: `${Math.min(100, 8 + n * 6.1)}%` }} transition={{ duration: 0.35, ease }} /></span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold">Tu app de PULSE</span>
          <span className="h-3 overflow-hidden rounded-full bg-gris-100"><span className="block h-full w-[14%] rounded-full bg-gradient-to-r from-grad-a to-grad-b" /></span>
        </div>
      </div>
      <span className="text-[13px] text-gris-500">Con {n} {n === 1 ? "persona" : "personas"}, tu app cuesta lo mismo.</span>
    </div>
  );
}

const VISUAL_VENTAJA = [VisualProceso, VisualJunto, VisualMarca, VisualUsuarios];
const SPAN_VENTAJA = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

function Ventajas() {
  const simple = useSimple();
  return (
    <section id="ventajas" aria-labelledby="ventajas-title" className="relative overflow-hidden bg-white">
      <Blob className="-left-32 top-[18%] h-[520px] w-[520px]" color="rgba(255,79,0,0.12)" />
      <Blob className="-right-24 top-[34%] h-[460px] w-[460px]" color="rgba(255,170,120,0.2)" />
      <div className="container-page relative flex flex-col gap-14 py-24 md:gap-20 md:py-36">
        <SectionTitle as="h3" id="ventajas-title" eyebrow="Ventajas" title="Por qué una app propia." lead="Pruébalo tú: toca, cambia y compara." />

        <div className="grid gap-4 lg:grid-cols-12">
          {BENEFICIOS.map((b, i) => {
            const V = VISUAL_VENTAJA[i];
            return (
              <motion.article key={b.t}
                initial={simple ? false : { y: 50, rotate: i % 2 ? 1.5 : -1.5, opacity: 0.4 }} whileInView={{ y: 0, rotate: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease, delay: (i % 2) * 0.12 }}
                onPointerMove={spot} whileHover={simple ? undefined : { y: -6 }}
                className={`vidrio foco relative flex flex-col gap-6 rounded-[30px] p-5 md:p-7 ${SPAN_VENTAJA[i]}`}>
                <div className="flex min-h-[210px] items-center justify-center rounded-[22px] bg-gradient-to-br from-papel to-[#FBF3EE] px-4 py-6">
                  <V />
                </div>
                <div className="flex flex-col gap-2 px-1">
                  <h4 className="text-[clamp(1.3rem,2vw,1.6rem)] font-bold leading-tight tracking-[-0.03em]">{b.t}</h4>
                  <p className="max-w-[46ch] text-[15.5px] leading-relaxed text-gris-500">{b.d}</p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h4 className="text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-tight tracking-[-0.03em]">PULSE frente a las alternativas</h4>
            <p className="max-w-[60ch] text-[16px] leading-relaxed text-gris-500">Tu app es una app web progresiva: se abre con un enlace, se instala en el móvil como cualquier otra y funciona en todos los dispositivos.</p>
          </div>
          <ComparativaMovil />
          <ComparativaEscritorio />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------
   SECCIÓN: Preguntas frecuentes
   --------------------------------------------------------------------- */
function FaqItem({ f, open, onToggle, i }) {
  const id = `faq-${i}`;
  return (
    <div className="border-b border-linea">
      <h3>
        <button type="button" id={`${id}-btn`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 py-6 text-left text-[clamp(1.05rem,1.6vw,1.2rem)] font-semibold tracking-[-0.015em]">
          {f.q}
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease }} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[18px] font-light leading-none transition-colors ${open ? "bg-tinta text-white" : "bg-papel text-tinta"}`} aria-hidden="true">+</motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
            <p className="max-w-prose pb-7 pr-12 text-[16px] leading-relaxed text-gris-500">{f.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function Preguntas() {
  const [open, setOpen] = useState(0);
  return (
    <section id="preguntas" aria-labelledby="faq-title" className="scroll-mt-16 bg-white">
      <div className="container-page grid gap-12 py-24 md:py-36 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          <SectionTitle id="faq-title" title="Preguntas frecuentes" />
          <p className="max-w-[36ch] text-[15px] text-gris-500">¿Tienes otras consultas? Escríbenos y nos pondremos en contacto en menos de 24 horas hábiles.</p>
          <div><Button href={CONTACTO.gmail} variant="light">Escríbenos</Button></div>
        </div>
        <div className="border-t border-linea">
          {FAQS.map((f, i) => <FaqItem key={f.q} f={f} i={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------
   SECCIÓN: Contacto (formulario + email) y pie
   --------------------------------------------------------------------- */
function Campo({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-white/80">{label}</label>
      {children}
      {error && <span id={`${id}-error`} className="text-[12.5px] font-medium text-[#FFB27A]">{error}</span>}
    </div>
  );
}
const CAMPO = "w-full rounded-[14px] bg-white/[0.07] px-4 py-3 text-[16px] text-white ring-1 ring-inset ring-white/15 transition placeholder:text-white/35 focus:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]";

function FormContacto() {
  const [estado, setEstado] = useState("idle"); // idle | enviando | ok | error
  const [errores, setErrores] = useState({});

  async function enviar(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    if (d.get("_honey")) return; // bot
    const nombre = String(d.get("nombre") || "").trim();
    const email = String(d.get("email") || "").trim();
    const mensaje = String(d.get("mensaje") || "").trim();
    const next = {};
    if (!nombre) next.nombre = "Escribe tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Escribe un email válido, por ejemplo nombre@tunegocio.com.";
    if (!mensaje) next.mensaje = "Cuéntanos en pocas palabras qué necesitas.";
    if (!d.get("acepto")) next.acepto = "Necesitamos tu permiso para responderte.";
    setErrores(next);
    if (Object.keys(next).length) {
      form.querySelector(`#contacto-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setEstado("enviando");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Nombre: nombre,
          Email: email,
          Negocio: String(d.get("negocio") || "").trim() || "—",
          Mensaje: mensaje,
          _subject: `Nuevo contacto desde la web: ${nombre}`,
          _replyto: email,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === "false") throw new Error();
      setEstado("ok");
      form.reset();
    } catch {
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} role="status"
        className="flex flex-col items-start gap-4 rounded-[28px] bg-white/[0.06] p-8 ring-1 ring-inset ring-white/10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-grad-a to-grad-b"><svg viewBox="0 0 12 12" className="w-5"><path d="M2.5 6.3 5 8.6 9.5 3.4" fill="none" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        <span className="text-[22px] font-bold tracking-[-0.02em]">Mensaje enviado</span>
        <span className="text-[15.5px] leading-relaxed text-white/70">Gracias. Te respondemos en menos de 24 horas hábiles.</span>
        <button type="button" onClick={() => setEstado("idle")} className="text-[14px] font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Enviar otro mensaje</button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4 rounded-[28px] bg-white/[0.04] p-6 ring-1 ring-inset ring-white/10 backdrop-blur md:p-8">
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="contacto-nombre" label="Nombre" error={errores.nombre}>
          <input id="contacto-nombre" name="nombre" type="text" autoComplete="name" placeholder="Tu nombre" aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? "contacto-nombre-error" : undefined} className={CAMPO} />
        </Campo>
        <Campo id="contacto-email" label="Email" error={errores.email}>
          <input id="contacto-email" name="email" type="email" autoComplete="email" placeholder="nombre@tunegocio.com" aria-invalid={!!errores.email} aria-describedby={errores.email ? "contacto-email-error" : undefined} className={CAMPO} />
        </Campo>
      </div>
      <Campo id="contacto-negocio" label="Tu negocio (opcional)">
        <input id="contacto-negocio" name="negocio" type="text" autoComplete="organization" placeholder="Por ejemplo, estudio de pilates" className={CAMPO} />
      </Campo>
      <Campo id="contacto-mensaje" label="¿Qué te gustaría organizar?" error={errores.mensaje}>
        <textarea id="contacto-mensaje" name="mensaje" rows={4} placeholder="Reservas, stock, citas… Cuéntanos cómo lo haces hoy." aria-invalid={!!errores.mensaje} aria-describedby={errores.mensaje ? "contacto-mensaje-error" : undefined} className={`${CAMPO} resize-y`} />
      </Campo>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contacto-acepto" className="flex items-start gap-3 text-[13.5px] leading-snug text-white/70">
          <input id="contacto-acepto" name="acepto" type="checkbox" aria-invalid={!!errores.acepto} className="mt-0.5 h-4 w-4 shrink-0 accent-[#FF4F00]" />
          <span>Acepto que PULSE use estos datos solo para responder a mi consulta. <a href="/privacidad" className="font-semibold text-white underline decoration-white/30 underline-offset-2 hover:decoration-white">Política de privacidad</a></span>
        </label>
        {errores.acepto && <span className="text-[12.5px] font-medium text-[#FFB27A]">{errores.acepto}</span>}
      </div>
      {estado === "error" && (
        <p role="alert" className="rounded-[14px] bg-[#FF4F00]/15 px-4 py-3 text-[14px] leading-snug text-white">
          No se pudo enviar el mensaje. Prueba de nuevo o escríbenos a <a href={CONTACTO.gmail} {...EXTERNO} className="font-semibold underline underline-offset-2">{CONTACTO.email}</a>.
        </p>
      )}
      <button type="submit" disabled={estado === "enviando"}
        className="mt-1 inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-grad-a to-grad-b px-6 text-[15px] font-semibold text-tinta shadow-[0_12px_32px_-12px_rgba(255,79,0,0.75)] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70">
        {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}

function Contacto() {
  const simple = useSimple();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const draw = useTransform(scrollYProgress, [0, 1], [simple ? 1 : 0, 1]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [simple ? 1 : 0.94, 1]), { stiffness: 90, damping: 24 });
  const radius = useTransform(scrollYProgress, [0, 1], [simple ? 32 : 64, 40]);
  const d = "M0 120 H1600"; // línea de proceso (antes, pulso)
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(CONTACTO.email); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    catch (e) {
      const el = document.getElementById("contacto-email-texto");
      const r = document.createRange(); r.selectNodeContents(el);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
  };
  return (
    <section id="contacto" ref={ref} aria-labelledby="contacto-title" className="scroll-mt-16 bg-white">
      <div className="container-page pb-10">
        <motion.div style={{ scale, borderRadius: radius }} className="on-dark relative isolate overflow-hidden bg-tinta px-5 py-16 text-white md:px-14 md:py-24">
          <div className="dot-grid absolute inset-0 -z-10" aria-hidden="true" />
          <Blob className="-left-24 -top-32 -z-10 h-[460px] w-[460px]" color="rgba(255,79,0,0.5)" />
          <Blob className="-bottom-40 -right-20 -z-10 h-[520px] w-[520px]" color="rgba(255,138,61,0.35)" />
          <svg className="pointer-events-none absolute inset-x-0 top-[22%] -z-10 h-[220px] w-full" viewBox="0 0 1600 240" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d={d} fill="none" stroke="#FF4F00" strokeOpacity="0.3" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: draw }} />
            {!simple && (
              <motion.path d={d} pathLength={1} fill="none" stroke="#FF8A3D" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray="0.1 2"
                initial={{ strokeDashoffset: 0.1 }} animate={{ strokeDashoffset: -1 }} transition={{ duration: 4.5, ease: "linear", repeat: Infinity, delay: 1 }} />
            )}
          </svg>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <div className="flex min-w-0 flex-col gap-7">
              <Eyebrow dark>Contacto</Eyebrow>
              <h2 id="contacto-title" className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.05em]">
                <span className="bg-gradient-to-r from-[#FF4F00] to-[#FFB27A] bg-clip-text text-transparent">Hablemos</span>
              </h2>
              <p className="max-w-[40ch] text-entrada text-white/70">Cuéntanos qué te gustaría organizar. Te decimos si una app lo resuelve y te respondemos en menos de 24 horas hábiles.</p>
              <div className="flex flex-col gap-2 border-t border-white/15 pt-6">
                <span className="text-[13px] font-medium text-white/50">O escríbenos directamente</span>
                <div className="flex flex-wrap items-center gap-3">
                  <a id="contacto-email-texto" href={CONTACTO.gmail} {...EXTERNO} className="break-all text-[clamp(1.1rem,2vw,1.4rem)] font-semibold text-white underline decoration-white/20 underline-offset-4 transition hover:decoration-[#FF8A3D]">{CONTACTO.email}</a>
                  <button type="button" onClick={copy} className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-white/20">{copied ? "Copiado" : "Copiar"}</button>
                </div>
              </div>
            </div>
            <FormContacto />
          </div>
        </motion.div>
      </div>
      <Pie />
    </section>
  );
}

/* --------------------------------------------------------------------- */
function ScrollProgress() {
  const simple = useSimple();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  if (simple) return null;
  return <motion.div style={{ scaleX, top: "env(safe-area-inset-top, 0px)" }} className="fixed inset-x-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-grad-a to-grad-b" aria-hidden="true" />;
}

export default function Landing() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-white focus:px-4 focus:py-3 focus:font-semibold">Saltar al contenido</a>
      <main id="contenido">
        <Hero />
        <Soluciones />
        <Integraciones />
        {/* Asistente de WhatsApp: oculto por ahora. El componente <Asistente /> sigue en este archivo para activarlo más adelante. */}
        <Ventajas />
        <Casos />
        <Clientes />
        <Trabajamos />
        <Preguntas />
        <Contacto />
      </main>
    </>
  );
}

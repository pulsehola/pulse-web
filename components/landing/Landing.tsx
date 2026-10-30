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
  { t: "Reservas", d: "Tus clientes reservan solos, a cualquier hora, y ven las plazas libres al momento." },
  { t: "Citas", d: "Confirmaciones y recordatorios automáticos para que nadie se olvide de venir." },
  { t: "Agendas", d: "El día de cada persona del equipo en una pantalla, sin choques ni dobles reservas." },
  { t: "Stock", d: "Entradas, salidas y un aviso antes de que algo se agote." },
  { t: "Presupuestos", d: "Prepara y envía presupuestos en minutos, con tu marca." },
  { t: "Datos", d: "Clientes, pedidos e historial ordenados en un solo sitio, siempre a mano." },
  { t: "Dashboards", d: "Los números de tu negocio de un vistazo: reservas, ventas y ocupación." },
  { t: "Análisis", d: "Qué se vende más, qué horarios se llenan y dónde puedes mejorar." },
  { t: "Soporte", d: "Seguimos a tu lado después de la entrega, para resolver dudas y hacer ajustes." },
];

// Lo que hace cada integración, dicho tal cual. TODO: confirmar alcance técnico antes de publicar.
const INTEGRACIONES = [
  { id: "wa", n: "WhatsApp", d: "Recordatorios automáticos y un asistente que contesta por ti.", lado: "izq" },
  { id: "ig", n: "Instagram", d: "Un enlace para reservar o pedir desde tu bio y tus historias.", lado: "izq" },
  { id: "sheets", n: "Excel y Google Sheets", d: "Importas lo que ya tienes y exportas cuando quieras.", lado: "der" },
  { id: "cal", n: "Google Calendar", d: "Cada cita aparece en tu calendario de siempre.", lado: "der" },
];

const BENEFICIOS = [
  { t: "Funciona como trabajas tú", d: "No te adaptas a pantallas pensadas para otro negocio. La app sigue tus pasos, en tu orden." },
  { t: "Todo en un solo sitio", d: "Reservas, clientes, stock y números juntos, en vez de cinco herramientas que no se hablan." },
  { t: "Tu marca y tus datos", d: "La app lleva tu nombre y tus colores. La información de tu negocio es tuya." },
  { t: "Sin cuotas por usuario", d: "Sumar a una persona más a tu equipo no te cuesta nada extra, como pasa con las apps que cobran por usuario." },
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

const ISO_POINTS = "0,12 12,12 16,3 21,21 26,8 29,12 44,12";
const WORDMARK_PATH = "M1.54 0V-15.84H8.23Q8.46 -15.84 8.85 -15.82Q9.24 -15.81 9.55 -15.75Q10.97 -15.53 11.87 -14.82Q12.78 -14.1 13.21 -13.02Q13.64 -11.93 13.64 -10.6Q13.64 -9.27 13.21 -8.19Q12.77 -7.11 11.86 -6.39Q10.96 -5.68 9.55 -5.46Q9.24 -5.41 8.84 -5.39Q8.45 -5.37 8.23 -5.37H4.53V0ZM4.53 -8.16H8.1Q8.33 -8.16 8.6 -8.18Q8.88 -8.21 9.11 -8.27Q9.71 -8.44 10.04 -8.83Q10.37 -9.22 10.5 -9.7Q10.63 -10.17 10.63 -10.6Q10.63 -11.03 10.5 -11.51Q10.37 -11.99 10.04 -12.38Q9.71 -12.77 9.11 -12.94Q8.88 -13 8.6 -13.02Q8.33 -13.05 8.1 -13.05H4.53Z M26.25 0.33Q24.33 0.33 22.88 -0.45Q21.43 -1.22 20.61 -2.63Q19.8 -4.04 19.8 -5.94V-15.82L22.84 -15.84V-5.96Q22.84 -5.18 23.1 -4.54Q23.36 -3.9 23.83 -3.44Q24.3 -2.98 24.92 -2.73Q25.54 -2.49 26.25 -2.49Q26.97 -2.49 27.59 -2.74Q28.21 -2.99 28.68 -3.45Q29.14 -3.92 29.4 -4.55Q29.66 -5.19 29.66 -5.96V-15.84H32.69V-5.94Q32.69 -4.04 31.88 -2.63Q31.06 -1.22 29.61 -0.45Q28.16 0.33 26.25 0.33Z M39.95 0V-15.84H42.94V-2.79H49.76V0Z M61.58 0.33Q59.82 0.33 58.4 -0.29Q56.99 -0.91 56.08 -2.07Q55.18 -3.23 54.93 -4.84L58.06 -5.3Q58.39 -3.94 59.42 -3.2Q60.46 -2.46 61.78 -2.46Q62.51 -2.46 63.21 -2.69Q63.9 -2.93 64.34 -3.38Q64.79 -3.83 64.79 -4.49Q64.79 -4.73 64.72 -4.96Q64.65 -5.18 64.48 -5.38Q64.32 -5.58 64.01 -5.75Q63.71 -5.93 63.25 -6.07L59.14 -7.28Q58.67 -7.41 58.06 -7.66Q57.45 -7.9 56.88 -8.35Q56.31 -8.8 55.93 -9.54Q55.55 -10.29 55.55 -11.42Q55.55 -13.01 56.35 -14.07Q57.16 -15.12 58.5 -15.64Q59.84 -16.16 61.47 -16.15Q63.11 -16.13 64.39 -15.59Q65.68 -15.05 66.55 -14.02Q67.42 -12.99 67.8 -11.51L64.57 -10.96Q64.39 -11.73 63.92 -12.25Q63.45 -12.78 62.79 -13.06Q62.14 -13.33 61.42 -13.35Q60.72 -13.38 60.1 -13.16Q59.48 -12.95 59.09 -12.54Q58.7 -12.13 58.7 -11.57Q58.7 -11.05 59.01 -10.73Q59.33 -10.41 59.82 -10.21Q60.3 -10.01 60.81 -9.88L63.56 -9.13Q64.17 -8.96 64.92 -8.7Q65.67 -8.43 66.36 -7.95Q67.04 -7.47 67.49 -6.69Q67.94 -5.91 67.94 -4.71Q67.94 -3.43 67.4 -2.48Q66.87 -1.53 65.97 -0.91Q65.06 -0.29 63.93 0.02Q62.79 0.33 61.58 0.33Z M74.32 0V-15.84H84.66V-13.05H77.31V-9.66H83.34V-6.86H77.31V-2.79H84.66V0Z";

function Logo({ className = "h-6 w-auto", tone = "light" }) {
  return (
    <svg viewBox="0 0 143 24" className={className} role="img" aria-label="PULSE">
      <polyline transform="translate(1.25 0)" points={ISO_POINTS} fill="none" stroke={LOGO_NARANJA} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path transform="translate(57.25 19.92)" fill={tone === "dark" ? "#FFFFFF" : "#111111"} d={WORDMARK_PATH} />
    </svg>
  );
}
function Iso({ className = "w-5", stroke = ACENTO.base, width = 4 }) {
  return (
    <svg viewBox="0 0 44 24" className={className} aria-hidden="true">
      <polyline points={ISO_POINTS} fill="none" stroke={stroke} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
const BEAT = [[0, 0], [12 / 44, 0], [16 / 44, -9 / 12], [21 / 44, 9 / 12], [26 / 44, -4 / 12], [29 / 44, 0], [1, 0]];
function pulsePath(width, y, amp, beats, flatStart = 0) {
  const w = (width - flatStart) / beats;
  let d = `M0 ${y} L${flatStart} ${y}`;
  for (let b = 0; b < beats; b++) {
    const x0 = flatStart + b * w;
    for (const [px, py] of BEAT.slice(1)) d += ` L${(x0 + px * w).toFixed(1)} ${(y + py * amp).toFixed(1)}`;
  }
  return d;
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
      <Iso className="w-5" width={4} />{children}
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
function StatusBar({ light }) {
  return (
    <div className={`flex items-center justify-between px-6 pt-[11px] font-sys text-[11px] font-semibold tnum ${light ? "text-white" : "text-tinta"}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1" aria-hidden="true">
        <span className="flex items-end gap-[1.5px]"><span className="h-[4px] w-[2.5px] rounded-[1px] bg-current" /><span className="h-[6px] w-[2.5px] rounded-[1px] bg-current" /><span className="h-[8px] w-[2.5px] rounded-[1px] bg-current" /><span className="h-[10px] w-[2.5px] rounded-[1px] bg-current" /></span>
        <span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-current/60 p-[1.5px]"><span className="block h-full w-4/5 rounded-[1.5px] bg-current" /></span>
      </span>
    </div>
  );
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
        {icon === "pulse" && <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-tinta"><Iso className="w-3.5" width={5} stroke={ACENTO.claro} /></span>}
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
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tinta"><Iso className="w-4" width={5} stroke={ACENTO.claro} /></span>
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
      <AppHeader eyebrow="Calendario · martes 4" title="Reunión con PULSE" />
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
   SECCIÓN: Soluciones (frase que se escribe con el scroll + listado)
   --------------------------------------------------------------------- */
function Word({ children, progress, range }) {
  const reduce = useReducedMotion();
  const color = useTransform(progress, range, reduce ? ["#111111", "#111111"] : ["#CFCFCB", "#111111"]);
  return <motion.span style={{ color }}>{children} </motion.span>;
}
function Soluciones() {
  const simple = useSimple();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const text = "Diseñamos la herramienta exacta que tu negocio necesita hoy. Y la hacemos crecer al ritmo que cambia tu día a día.";
  const words = text.split(" ");
  return (
    <section id="soluciones" aria-labelledby="soluciones-title" className="relative overflow-hidden bg-white">
      <Blob className="-right-40 top-0 h-[420px] w-[420px]" color="rgba(255,79,0,0.12)" />
      <div className="container-page relative flex flex-col gap-16 py-24 md:gap-24 md:py-36">
        <div ref={ref} className="flex flex-col gap-6">
          <Eyebrow>Soluciones</Eyebrow>
          <h2 id="soluciones-title" className="max-w-[22ch] text-[clamp(2rem,5vw,4.2rem)] font-bold leading-[1.06] tracking-[-0.04em]">
            {words.map((w, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
          </h2>
        </div>
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUCIONES.map((x, i) => (
            <motion.li key={x.t} initial={{ y: simple ? 0 : 28 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease, delay: (i % 3) * 0.08 }}
              className="group flex flex-col gap-2 border-t-[1.5px] border-tinta pb-10 pt-6">
              <span className="flex items-center justify-between gap-4">
                <h3 className="text-[clamp(1.4rem,2.2vw,1.75rem)] font-bold tracking-[-0.03em]">{x.t}</h3>
                <Iso className="w-8 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" width={3.5} />
              </span>
              <p className="max-w-[36ch] text-[15.5px] leading-relaxed text-gris-500">{x.d}</p>
            </motion.li>
          ))}
        </ul>
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
        <a href="#top" aria-label="PULSE, inicio"><Logo className="h-[18px] w-auto md:h-5" /></a>
        <nav className="hidden items-center gap-8 text-[14px] font-medium text-gris-500 lg:flex">
          <a href="#soluciones" className="transition-colors hover:text-tinta">Soluciones</a>
          <a href="#ejemplos" className="transition-colors hover:text-tinta">Ejemplos</a>
          <a href="#trabajamos" className="transition-colors hover:text-tinta">Cómo trabajamos</a>
          <a href="#preguntas" className="transition-colors hover:text-tinta">Preguntas</a>
        </nav>
        <a href="#contacto" className="rounded-full bg-tinta px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#2a2a2a]">Hablemos</a>
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

function Trabajamos() {
  const [step, setStep] = useState(0);
  return (
    <section id="trabajamos" aria-labelledby="trabajamos-title" className="relative scroll-mt-16 bg-papel">
      <div className="container-page grid gap-12 py-24 md:py-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-10 lg:gap-0">
          <div className="lg:pb-16">
            <SectionTitle id="trabajamos-title" title="¿Cómo trabajamos?" lead="Cada negocio es distinto, pero el camino es siempre el mismo: primero escuchamos, después diseñamos." />
          </div>
          <ol className="relative flex flex-col gap-4 lg:gap-0">
            <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 hidden w-[2px] rounded-full bg-gris-200 lg:block" />
            <motion.span aria-hidden="true" className="absolute left-[19px] top-6 hidden w-[2px] origin-top rounded-full bg-gradient-to-b from-grad-a to-grad-b lg:block"
              animate={{ height: `calc((100% - 3rem) * ${step / (PASOS.length - 1)})` }} transition={{ duration: 0.5, ease }} />
            {PASOS.map((p, i) => (
              <motion.li key={p.t} onViewportEnter={() => setStep(i)} viewport={{ margin: "-45% 0px -45% 0px" }}
                className={`relative flex gap-5 rounded-[22px] bg-white p-5 transition-opacity duration-500 lg:min-h-[42vh] lg:items-center lg:bg-transparent lg:p-0 ${i === step ? "" : "lg:opacity-35"}`}>
                <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold transition-colors duration-500 bg-gradient-to-br from-grad-a to-grad-b text-tinta ${i <= step ? "" : "lg:bg-none lg:bg-white lg:text-gris-500 lg:ring-1 lg:ring-gris-200"}`}>{i + 1}</span>
                <span className="flex flex-col gap-1.5 pt-1.5 lg:pt-0">
                  <span className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold leading-tight tracking-[-0.03em]">{p.t}</span>
                  <span className="max-w-[42ch] text-[16px] leading-relaxed text-gris-500">{p.d}</span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
        <div className="relative hidden lg:block">
          <div className="sticky top-24 flex h-[calc(100vh-8rem)] items-center justify-center">
            <Blob className="left-[calc(50%-240px)] top-[calc(50%-240px)] h-[480px] w-[480px]" color="rgba(255,79,0,0.18)" />
            <div className="relative">
              <Phone label={`Paso ${step + 1}: ${PASOS[step].t}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={step} className="h-full" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }}>
                    <PantallaPaso i={step} />
                  </motion.div>
                </AnimatePresence>
              </Phone>
              <span className="absolute -right-6 -top-4 rounded-full bg-tinta px-3 py-1.5 text-[12px] font-semibold text-white shadow-lg tnum">{step + 1} / {PASOS.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
  const paths = ["M250 95 C 370 95, 390 200, 500 200", "M250 305 C 370 305, 390 200, 500 200", "M750 95 C 630 95, 610 200, 500 200", "M750 305 C 630 305, 610 200, 500 200"];

  return (
    <section id="integraciones" ref={ref} aria-labelledby="int-title" className="relative overflow-hidden bg-white">
      <Blob className="left-[8%] top-[38%] h-[420px] w-[420px]" color="rgba(255,79,0,0.14)" />
      <Blob className="right-[6%] top-[52%] h-[460px] w-[460px]" color="rgba(255,170,120,0.22)" />
      <div className="container-page flex flex-col gap-14 py-24 md:gap-20 md:py-36">
        <SectionTitle as="h3" center id="int-title" eyebrow="Integraciones" title="Se lleva bien con lo que ya usas." lead="Tu app no te obliga a dejar tus herramientas. Las conecta, para que la información pase sola de un sitio a otro." />

        <div className="relative">
          {!simple && (
            <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
              {paths.map((d, i) => (
                <g key={i}>
                  <motion.path d={d} fill="none" stroke="#D9D9D5" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ pathLength: draw }} />
                  <motion.path d={d} fill="none" stroke={ACENTO.base} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="0.06 1"
                    initial={{ strokeDashoffset: i < 2 ? 0.06 : -1 }} animate={{ strokeDashoffset: i < 2 ? -1 : 0.06 }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }} />
                </g>
              ))}
            </svg>
          )}
          <div className="relative grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-24">
            <div className="order-2 flex flex-col gap-5 lg:order-1 lg:gap-24">{izq.map((it) => <IntegracionTile key={it.id} it={it} align="izq" />)}</div>
            <div className="order-1 flex justify-center lg:order-2">
              <div className="relative flex h-40 w-40 flex-col items-center justify-center gap-3 rounded-[40px] bg-gradient-to-br from-grad-a to-grad-b text-tinta shadow-[0_40px_80px_-30px_rgba(255,79,0,0.7)]">
                {!simple && <motion.span aria-hidden="true" className="absolute inset-0 rounded-[40px] ring-2 ring-[#FF8A3D]" animate={{ scale: [1, 1.12], opacity: [0.5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} />}
                <Iso className="w-14" width={3.2} stroke="#111111" />
                <span className="text-[14px] font-semibold">Tu app</span>
              </div>
            </div>
            <div className="order-3 flex flex-col gap-5 lg:gap-24">{der.map((it) => <IntegracionTile key={it.id} it={it} align="der" />)}</div>
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
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tinta"><Iso className="w-4" width={5} stroke={ACENTO.claro} /></span>
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
   Botón flotante de WhatsApp
   --------------------------------------------------------------------- */
function WhatsAppFlotante() {
  const simple = useSimple();
  const [tip, setTip] = useState(false);
  const [cerrado, setCerrado] = useState(false);
  useEffect(() => {
    if (simple) return;
    const t = setTimeout(() => setTip(true), 3500);
    return () => clearTimeout(t);
  }, [simple]);
  const externo = CONTACTO.whatsapp.startsWith("http");
  return (
    <div className="fixed z-[80] flex items-end gap-3" style={{ right: "calc(20px + env(safe-area-inset-right, 0px))", bottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}>
      <AnimatePresence>
        {tip && !cerrado && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.4, ease }}
            className="glass relative mb-1 hidden w-[250px] flex-col gap-0.5 rounded-[18px] py-3 pl-4 pr-9 shadow-[0_18px_50px_-18px_rgba(17,17,17,0.3),0_0_0_1px_rgba(17,17,17,0.05)] sm:flex">
            <button type="button" onClick={() => setCerrado(true)} aria-label="Cerrar aviso" className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-[15px] leading-none text-gris-400 hover:bg-papel hover:text-tinta">×</button>
            <span className="text-[14px] font-semibold">¿Hablamos por WhatsApp?</span>
            <span className="text-[13px] text-gris-500">Te respondemos en menos de 24 h hábiles.</span>
          </motion.div>
        )}
      </AnimatePresence>
      <a href={CONTACTO.whatsapp} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})} aria-label="Escríbenos por WhatsApp"
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-wa-verde text-white shadow-[0_14px_30px_-10px_rgba(37,211,102,0.75)] transition-transform duration-200 hover:scale-105 active:scale-95">
        {!simple && <motion.span aria-hidden="true" className="absolute inset-0 rounded-full bg-wa-verde" animate={{ scale: [1, 1.4], opacity: [0.4, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} />}
        <Glyph kind="wa" className="relative h-7 w-7" />
      </a>
    </div>
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

function Ventajas() {
  const simple = useSimple();
  return (
    <section id="ventajas" aria-labelledby="ventajas-title" className="relative overflow-hidden bg-white">
      <Blob className="-left-32 top-[18%] h-[520px] w-[520px]" color="rgba(255,79,0,0.12)" />
      <Blob className="-right-24 top-[34%] h-[460px] w-[460px]" color="rgba(255,170,120,0.2)" />
      <div className="container-page flex flex-col gap-14 py-24 md:gap-20 md:py-36">
        <SectionTitle as="h3" id="ventajas-title" eyebrow="Ventajas" title="Por qué una app propia." lead="Frente a seguir con papeles y mensajes, o pagar una herramienta pensada para todos a la vez." />

        <div className="grid gap-4 sm:grid-cols-2">
          {BENEFICIOS.map((b, i) => (
            <motion.div key={b.t} initial={{ y: simple ? 0 : 36 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease, delay: (i % 2) * 0.12 }}
              onPointerMove={spot} whileHover={simple ? undefined : { y: -6 }}
              className="vidrio foco relative flex flex-col gap-10 rounded-[28px] p-7 md:p-9">
              <Iso className="w-9" width={3} />
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[clamp(1.35rem,2.2vw,1.75rem)] font-bold leading-tight tracking-[-0.03em]">{b.t}</h3>
                <p className="max-w-[44ch] text-[16px] leading-relaxed text-gris-500">{b.d}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-tight tracking-[-0.03em]">PULSE frente a las alternativas</h3>
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
const CAMPO = "w-full rounded-[14px] bg-white/[0.07] px-4 py-3 text-[15px] text-white ring-1 ring-inset ring-white/15 transition placeholder:text-white/35 focus:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]";

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
  const d = pulsePath(1600, 120, 80, 3, 260);
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
      <footer className="container-page flex flex-col items-center gap-4 border-t border-linea pb-28 pt-10 text-center text-[13px] text-gris-400 md:flex-row md:justify-between md:pb-8 md:pt-8 md:text-left">
        <Logo className="h-4 w-auto" />
        <span>Apps web a medida</span>
        <a href={CONTACTO.gmail} {...EXTERNO} className="select-all font-medium text-tinta transition-colors hover:text-acento-texto">{CONTACTO.email}</a>
        <span>© 2026 PULSE</span>
      </footer>
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
        <Asistente />
        <Ventajas />
        <Casos />
        <Trabajamos />
        <Preguntas />
        <Contacto />
      </main>
      <WhatsAppFlotante />
    </>
  );
}

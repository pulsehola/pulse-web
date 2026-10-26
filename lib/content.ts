// Todo el texto de la web vive acá. Para pasar el sitio de vos a tú (mercado España),
// alcanza con editar este archivo: los componentes no tienen copy propio.
// Los valores entre [CORCHETES] son datos que faltan y hay que completar antes de publicar.

export const site = {
  meta: {
    title: "PULSE — Estrategia, diseño y desarrollo de productos digitales",
    description:
      "Estudio digital independiente. Diseñamos y desarrollamos webs, PWAs y piezas creativas para marcas que quieren crecer.",
  },

  contact: {
    email: "[hola@tudominio.com]",
    // Formato internacional sin "+" ni espacios, p. ej. 34600000000
    whatsapp: "[34600000000]",
    whatsappMessage: "Hola, quiero contarles sobre un proyecto.",
    city: "Barcelona",
  },

  nav: [
    { label: "Servicios", href: "#servicios" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Proyectos", href: "#proyectos" },
    { label: "Contacto", href: "#contacto" },
  ],
  navCta: "Agendá una llamada",

  marquee: ["Desarrollo web", "PWA", "Redes sociales", "UX/UI", "Prototipos", "Next.js"],
  marqueeAlt: ["Estrategia", "Diseño", "Código", "Lanzamiento", "Iteración"],

  hero: {
    eyebrow: "Estudio digital independiente",
    // La última palabra del título se resalta con el bloque naranja.
    meta: { location: "Barcelona — 41.39°N 2.17°E", status: "Agenda abierta · Q1", scroll: "Scroll" },
    title: "Estrategia, diseño y desarrollo de productos digitales que escalan.",
    subtitle: "Diseñamos soluciones web, PWAs avanzadas y piezas creativas para potenciar tu marca.",
    primaryCta: { label: "Ver nuestros proyectos", href: "#proyectos" },
    secondaryCta: { label: "Agendá una llamada", href: "#contacto" },
    // Dejá el video en /public/video/. Si no existe, el hero muestra la línea de pulso animada.
    video: {
      mp4: "/video/hero.mp4",
      webm: "/video/hero.webm",
      poster: "/video/hero-poster.jpg",
      enabled: false, // pasalo a true cuando subas los archivos
    },
  },

  services: {
    eyebrow: "01 — Servicios",
    title: "Nuestras soluciones digitales",
    lead: "Cuatro servicios que se combinan según lo que necesite tu proyecto. Empezamos por entender el problema; la tecnología viene después.",
    items: [
      {
        id: "web",
        number: "01",
        title: "Desarrollo web y plataformas a medida",
        summary: "Sitios rápidos, bien posicionados y preparados para crecer sin rehacerlos.",
        wide: true,
        points: [
          "Optimizados para SEO y Core Web Vitals desde el primer día",
          "Next.js y CMS headless: tu equipo edita contenidos sin tocar código",
          "Arquitectura lista para sumar secciones, idiomas o tienda",
        ],
      },
      {
        id: "pwa",
        number: "02",
        title: "Aplicaciones web progresivas (PWA)",
        summary:
          "Apps que se instalan desde el navegador en el móvil o la computadora, sin pasar por las tiendas de apps.",
        points: [
          "Funcionan sin conexión y responden como una app nativa",
          "Notificaciones push para avisos y recordatorios",
          "Cargan rápido y consumen menos datos",
          "Un solo desarrollo para iOS, Android y web",
          "Experiencia fluida, pensada para usarse con una mano",
        ],
        featured: true,
        wide: true,
      },
      {
        id: "rrss",
        number: "03",
        title: "Creatividad y estrategia para redes",
        summary: "Sistemas visuales y piezas para que tu marca se reconozca en el feed.",
        points: [
          "Reels, carruseles y banners con una línea visual coherente",
          "Plantillas editables para que tu equipo publique sin depender de nadie",
          "Identidades dinámicas que funcionan en cada formato",
        ],
      },
      {
        id: "ux",
        number: "04",
        title: "Diseño UX/UI y prototipado",
        summary: "Interfaces claras, pensadas para que la gente haga lo que vino a hacer.",
        points: [
          "Research con usuarios reales antes de diseñar",
          "Prototipos interactivos para validar antes de programar",
          "Diseño orientado a conversión, medido con datos",
        ],
      },
    ],
  },

  about: {
    eyebrow: "02 — Nosotros",
    title: "Precisión técnica y criterio visual, en el mismo equipo.",
    statement:
      "Unimos la precisión técnica con la estética visual. Procesos ágiles, código limpio y diseños que resuelven problemas reales.",
    body: [
      "Nacimos como un estudio digital independiente enfocado en unir la precisión técnica con la estética visual.",
      "Creemos en los procesos ágiles, el código limpio y los diseños que solucionan problemas reales. Acompañamos a marcas y emprendedores a transformar ideas complejas en productos digitales memorables.",
    ],
    principles: [
      { n: "01", title: "Primero entendemos", text: "Una llamada de descubrimiento antes de proponer nada." },
      { n: "02", title: "Versión 1, rápido", text: "Algo que funcione en tus manos en semanas, no en meses." },
      { n: "03", title: "Mejoramos con datos", text: "Cada iteración sale de cómo se usa de verdad." },
    ],
  },

  projects: {
    eyebrow: "03 — Proyectos",
    title: "Trabajo seleccionado",
    lead: "Filtrá por tipo de proyecto.",
    filters: [
      { id: "all", label: "Todos" },
      { id: "web", label: "Webs" },
      { id: "pwa", label: "PWAs" },
      { id: "rrss", label: "RRSS" },
    ],
    // IMPORTANTE: son marcadores. Reemplazalos por proyectos reales (con permiso del cliente)
    // antes de publicar. No inventes clientes ni métricas.
    items: [
      { id: "p1", category: "pwa", title: "[Nombre del proyecto]", client: "[Cliente · rubro]", year: "2026", tags: ["PWA", "Reservas"] },
      { id: "p2", category: "web", title: "[Nombre del proyecto]", client: "[Cliente · rubro]", year: "2026", tags: ["Next.js", "SEO"] },
      { id: "p3", category: "rrss", title: "[Nombre del proyecto]", client: "[Cliente · rubro]", year: "2026", tags: ["Carruseles", "Reels"] },
      { id: "p4", category: "web", title: "[Nombre del proyecto]", client: "[Cliente · rubro]", year: "2025", tags: ["Headless CMS"] },
      { id: "p5", category: "pwa", title: "[Nombre del proyecto]", client: "[Cliente · rubro]", year: "2025", tags: ["PWA", "Push"] },
      { id: "p6", category: "rrss", title: "[Nombre del proyecto]", client: "[Cliente · rubro]", year: "2025", tags: ["Sistema visual"] },
    ] as Project[],
    placeholderNote: "Proyecto de ejemplo · reemplazar por caso real",
  },

  contact_section: {
    eyebrow: "04 — Contacto",
    title: "Contanos qué tenés en mente.",
    lead: "Contanos en dos minutos qué necesitás. Te respondemos en menos de 24 horas hábiles.",
    needsLabel: "¿Qué necesitás?",
    needs: [
      { id: "web", label: "Web o plataforma" },
      { id: "pwa", label: "PWA" },
      { id: "rrss", label: "Redes sociales" },
      { id: "ux", label: "UX/UI" },
      { id: "nose", label: "Todavía no sé" },
    ],
    timelineLabel: "¿Para cuándo?",
    timelines: ["Lo antes posible", "En 1–3 meses", "Más adelante", "Sin fecha"],
    fields: {
      name: "Nombre",
      email: "Email",
      company: "Marca o empresa (opcional)",
      message: "Contanos el proyecto",
      messagePlaceholder: "Qué hacés, qué querés resolver y si ya tenés algo armado.",
    },
    consent: "Acepto que PULSE use estos datos solo para responder a mi consulta.",
    privacyLink: { label: "Política de privacidad", href: "/privacidad" },
    submit: "Enviar brief",
    sending: "Enviando…",
    success: "Listo. Te escribimos en menos de 24 horas hábiles.",
    error: "No pudimos enviar el formulario. Probá de nuevo o escribinos por WhatsApp.",
    errors: {
      name: "Falta tu nombre.",
      email: "Revisá el email: lo necesitamos para responderte.",
      needs: "Elegí al menos una opción.",
      consent: "Necesitamos tu permiso para responderte.",
    },
    bigTitle: "Hablemos.",
    directTitle: "¿Preferís ir directo?",
    whatsappCta: "Escribinos por WhatsApp",
    emailCta: "Mandanos un email",
  },

  footer: {
    cta: "¿Arrancamos?",
    ctaLink: "Contanos tu idea",
    backToTop: "Volver arriba",
    tagline: "Producto digital · Apps a medida",
    rights: "Todos los derechos reservados.",
  },
};

export type Project = {
  id: string;
  category: "web" | "pwa" | "rrss";
  title: string;
  client: string;
  year: string;
  tags: string[];
  image?: string; // /projects/p1.jpg, 4:3
};

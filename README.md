# PULSE — Web

Next.js 15 (App Router) · Tailwind CSS 3.4 · Framer Motion 11 · TypeScript.
Basada en el Manual de marca PULSE v1.0.

## Arrancar

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

Se despliega tal cual en Vercel.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| **Todo el texto** (titulares, servicios, formulario, errores) | `lib/content.ts` |
| Colores, tipografía, radios (tokens del manual) | `tailwind.config.ts` |
| Secciones | `components/` (Hero, Services, About, Projects, Contact, Header, Footer) |
| Animación de entrada al scroll | `components/ui/Reveal.tsx` |
| Endpoint del formulario | `app/api/contact/route.ts` |
| Fuentes autoalojadas (Manrope, IBM Plex Mono, SIL OFL 1.1) | `app/fonts/` |

## Antes de publicar

- [ ] **Video del hero**: subí `hero.mp4`, `hero.webm` y `hero-poster.jpg` a `public/video/` y poné `hero.video.enabled: true` en `lib/content.ts`. Recomendado: 10–20 s en loop, sin audio, 1920×1080, menos de 4 MB, poco movimiento (el texto va encima). Sin video se ve la línea de pulso animada.
- [ ] **Proyectos**: los 6 son marcadores. Reemplazalos por casos reales con permiso del cliente (imagen 4:3 en `public/projects/`, campo `image`). Si todavía no hay casos, sacá la sección de `app/page.tsx` y el link del menú.
- [ ] **Contacto**: email y número de WhatsApp en `lib/content.ts` (`[CORCHETES]`).
- [ ] **Formulario**: `app/api/contact/route.ts` hoy solo valida y registra en el log. Conectalo a un proveedor de email (Resend, Postmark) o a tu CRM.
- [ ] **Política de privacidad** (`app/privacidad`): texto legal RGPD/LOPDGDD pendiente.
- [ ] **Tratamiento**: el sitio está en voseo. Si el público es España, cambiá el copy a tú en `lib/content.ts` (los componentes no tienen texto propio).

## Decisiones de diseño

- Sin gradientes decorativos ni "glows": el manual de marca los excluye. El único degradado es el overlay del hero, que está para que el texto se lea sobre el video.
- Botón primario naranja con texto en tinta (5,7:1). Nunca texto blanco sobre naranja (3,3:1).
- Animaciones cortas (300–700 ms), una sola vez por elemento, y se desactivan si el sistema tiene "reducir movimiento".
- Formulario accesible: labels reales, errores asociados a cada campo, foco al primer error, honeypot anti-spam y consentimiento RGPD.

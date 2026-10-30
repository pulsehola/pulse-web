import type { Config } from "tailwindcss";

// Tokens del Manual de marca PULSE v1.0. No agregar colores fuera de esta lista.
// Excepción: los tokens marcados "Landing" se sumaron para la portada de apps a medida y están pendientes de entrar al manual.
const config: Config = {
  // En pantallas táctiles los estilos hover no se quedan "pegados" después de tocar.
  future: { hoverOnlyWhenSupported: true },
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        naranja: {
          DEFAULT: "#FF4F00", // naranja-pulse: rellenos, isotipo, estado activo. Nunca texto sobre claro.
          texto: "#C2410C", // naranja-texto: texto de acento sobre blanco/papel.
        },
        tinta: "#111111",
        papel: "#F4F4F2",
        gris: {
          100: "#EFEFEC", // landing: fondos de pista y separadores finos
          200: "#D0D0D0",
          300: "#B8B8B8",
          400: "#8A8A86", // landing: texto terciario
          500: "#5C5C5C",
          700: "#3D3D3D",
        },
        // --- Landing "Apps a medida" (pendiente de sumar al manual) ---
        acento: { DEFAULT: "#FF4F00", texto: "#C2410C", suave: "#FFF1EA", claro: "#FF4F00" }, // alias del naranja
        grad: { a: "#FF4F00", b: "#FF8A3D" }, // degradado naranja → melocotón. Texto encima siempre tinta.
        aviso: { DEFAULT: "#F59E0B", texto: "#B45309", suave: "#FFF4E5" }, // estado "stock bajo", no es acento
        linea: "#E7E7E4",
        // Colores de interfaz de WhatsApp, solo dentro de los mockups
        wa: { verde: "#25D366", boton: "#00A884", out: "#D9FDD3", fondo: "#EFEAE2", barra: "#F0F2F5", gris: "#667781", texto: "#111B21", tick: "#53BDEB" },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
        sys: ["-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "Helvetica", "Arial", "sans-serif"], // interfaz de los mockups
      },
      fontSize: {
        // Escala web expresiva (hero y titulares de sección). Propuesta para sumar al manual.
        hero: ["clamp(3rem, 7.2vw, 7.25rem)", { lineHeight: "0.92", letterSpacing: "-0.045em", fontWeight: "700" }],
        mega: ["clamp(3.5rem, 13vw, 13rem)", { lineHeight: "0.85", letterSpacing: "-0.05em", fontWeight: "700" }],
        statement: ["clamp(1.75rem, 4.2vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "700" }],
        display: ["clamp(2.5rem, 6vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "700" }],
        h1: ["clamp(2rem, 4.5vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        h2: ["clamp(1.625rem, 3.5vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        h3: ["clamp(1.375rem, 2.5vw, 1.625rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        lead: ["1.0625rem", { lineHeight: "1.6" }],
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.1em" }],
        // Landing "Apps a medida"
        portada: ["clamp(2.5rem, 6.4vw, 6rem)", { lineHeight: "1", letterSpacing: "-0.05em", fontWeight: "700" }],
        titulo: ["clamp(2rem, 4.4vw, 3.6rem)", { lineHeight: "1.04", letterSpacing: "-0.04em", fontWeight: "700" }],
        entrada: ["1.125rem", { lineHeight: "1.6" }],
      },
      borderRadius: { sm: "2px", DEFAULT: "4px", md: "4px" },
      borderWidth: { regla: "1.5px" },
      maxWidth: { lead: "520px", entrada: "560px", prose: "640px", page: "1200px" },
    },
  },
  plugins: [],
};

export default config;

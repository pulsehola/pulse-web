import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/fx/Cursor";
import { ScrollProgress } from "@/components/fx/ScrollProgress";

export default function Home() {
  return (
    <>
      <span id="top" />
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-white focus:px-4 focus:py-3 focus:font-semibold">
        Saltar al contenido
      </a>
      <ScrollProgress />
      <Cursor />
      <Header />
      <main id="contenido">
        <Hero />
        <Marquee />
        <Services />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

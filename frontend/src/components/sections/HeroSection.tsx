import { ArrowUpRight } from "lucide-react";
import { HeroGlobeBackground } from "@/components/sections/HeroGlobeBackground";

export function HeroSection() {
  return (
    <section id="inicio" className="relative isolate overflow-hidden pt-16 md:pt-24">
      <HeroGlobeBackground className="pointer-events-none absolute inset-0 -z-20 [mask-image:linear-gradient(to_bottom,black_0%,black_72%,transparent_100%)]" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_36%,rgb(0_229_255_/_0.10),transparent_44%),linear-gradient(90deg,rgb(8_12_21_/_0.68)_0%,rgb(8_12_21_/_0.34)_42%,rgb(8_12_21_/_0)_84%)] [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]" />

      <div className="section-shell grid min-h-[620px] gap-10 pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-14">
        <div className="space-y-8">
          <p className="inline-flex rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Camara argentina de empresarios
          </p>

          <div className="space-y-4">
            <h1 className="section-heading text-4xl font-semibold text-text-main md:text-6xl">
              Camara Argentina de Empresarios: productores e inversores hacia mercados internacionales.
            </h1>
            <p className="max-w-2xl text-base text-text-muted md:text-lg">
              CEAP, como camara de empresarios en Argentina, diseña estructuras comerciales y acuerdos B2B
              para transformar capacidad productiva e inversion en operaciones reales de comercio exterior.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#formulario"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              Solicitar diagnóstico
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#mapa"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-text-main transition-colors hover:border-accent/50 hover:text-accent"
            >
              Ver nodos estratégicos
            </a>
          </div>
        </div>

        <aside className="glass-card rounded-2xl p-6 md:p-8">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-gold">Foco inicial</p>
          <div className="mt-4 space-y-5">
            <div>
              <p className="text-3xl font-semibold text-text-main">Chile + Argentina</p>
              <p className="mt-1 text-sm text-text-muted">Primer tramo operativo del corredor B2B.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-2xl font-semibold text-accent">8+</p>
                <p className="text-xs text-text-muted">Sectores</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-2xl font-semibold text-accent">2</p>
                <p className="text-xs text-text-muted">Perfiles</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-2xl font-semibold text-accent">1</p>
                <p className="text-xs text-text-muted">Ruta</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

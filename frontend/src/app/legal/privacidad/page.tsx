import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidad | CEAP",
};

export default function PrivacyPage() {
  return (
    <main className="section-shell py-14">
      <article className="glass-card rounded-2xl p-6 md:p-8">
        <h1 className="section-heading text-3xl font-semibold">Política de Privacidad</h1>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          CEAP (Camara Argentina de Empresarios del Pacífico) recopila y procesa datos de contacto y
          calificacion comercial exclusivamente para analisis de oportunidades B2B, seguimiento comercial y coordinacion de servicios de comercio
          exterior.
        </p>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          El titular de los datos puede solicitar acceso, actualización o eliminación escribiendo a
          ceapargentina@proton.me.
        </p>
      </article>
    </main>
  );
}

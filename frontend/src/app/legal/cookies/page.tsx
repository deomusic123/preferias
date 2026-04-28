import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | Alliance 2.0",
};

export default function CookiesPage() {
  return (
    <main className="section-shell py-14">
      <article className="glass-card rounded-2xl p-6 md:p-8">
        <h1 className="section-heading text-3xl font-semibold">Política de Cookies</h1>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          Este sitio utiliza cookies técnicas para funcionamiento básico y podrá incorporar cookies de
          analítica y conversión cuando se habiliten herramientas como GTM y Meta Pixel.
        </p>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          Al continuar navegando, aceptas el uso de cookies conforme a esta política y a la normativa
          aplicable.
        </p>
      </article>
    </main>
  );
}

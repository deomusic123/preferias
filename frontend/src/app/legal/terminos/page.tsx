import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | CEAP Argentina",
};

export default function TermsPage() {
  return (
    <main className="section-shell py-14">
      <article className="glass-card rounded-2xl p-6 md:p-8">
        <h1 className="section-heading text-3xl font-semibold">Términos y Condiciones</h1>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          La información presentada en este sitio es de carácter comercial e informativo y no constituye
          garantía de resultados financieros ni recomendación de inversión.
        </p>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          Toda relación comercial se formaliza mediante acuerdos específicos entre las partes y está sujeta
          a validaciones legales, técnicas y regulatorias según jurisdicción.
        </p>
      </article>
    </main>
  );
}

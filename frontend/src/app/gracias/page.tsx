import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gracias | Alliance 2.0",
  description:
    "Tu solicitud fue enviada. Nuestro equipo comercial revisará tu perfil para avanzar con el diagnóstico.",
};

export default function ThankYouPage() {
  return (
    <main className="section-shell flex min-h-[72vh] items-center justify-center py-20">
      <article className="glass-card w-full max-w-2xl rounded-2xl p-8 text-center md:p-10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" aria-hidden="true" />
        <p className="mt-5 font-display text-xs uppercase tracking-[0.18em] text-gold">Solicitud recibida</p>
        <h1 className="section-heading mt-3 text-3xl font-semibold md:text-4xl">
          Gracias por aplicar a Alliance 2.0.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-text-muted md:text-base">
          Revisaremos tu perfil y te contactaremos para compartir una ruta de acción inicial según tu
          capacidad productiva o rango de inversión.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
            Volver al inicio
          </Link>
          <a
            href="mailto:contacto@turquesanegro.com"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-text-main transition hover:border-accent/50 hover:text-accent"
          >
            Contacto directo
          </a>
        </div>
      </article>
    </main>
  );
}

export function ClosingCtaSection() {
  return (
    <section className="mt-20 md:mt-28" aria-label="Cierre comercial">
      <div className="section-shell">
        <div className="glass-card rounded-2xl px-6 py-10 text-center md:px-10">
          <p className="font-display text-xs uppercase tracking-[0.18em] text-gold">Siguiente paso</p>
          <h2 className="section-heading mt-3 text-3xl font-semibold md:text-4xl">
            Integra tu producción o inversión a una estrategia internacional con ejecución real.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-text-muted md:text-base">
            Completa el formulario y nuestro equipo comercial te contactará con una ruta de acción
            priorizada según tu perfil.
          </p>
          <a
            href="#formulario"
            className="btn-secondary mt-7 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
          >
            Aplicar ahora
          </a>
        </div>
      </div>
    </section>
  );
}

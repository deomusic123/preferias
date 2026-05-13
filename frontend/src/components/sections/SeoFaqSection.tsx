const FAQ_ITEMS = [
  {
    question: "Que es la Camara Argentina de Empresarios?",
    answer:
      "La Camara Argentina de Empresarios (CEAP) es una plataforma B2B que conecta productores e inversores con oportunidades de expansion comercial y convenios internacionales.",
  },
  {
    question: "Como funciona CEAP para productores?",
    answer:
      "Los productores completan un diagnostico comercial y CEAP evalua rubro, capacidad y mercados de interes para estructurar una ruta de crecimiento exportador.",
  },
  {
    question: "Como funciona CEAP para inversores?",
    answer:
      "Los inversores registran su perfil, rango y horizonte de inversion. CEAP califica oportunidades y presenta alternativas alineadas al objetivo de retorno y riesgo.",
  },
  {
    question: "Que diferencia a CEAP de otras camaras de empresarios?",
    answer:
      "CEAP combina calificacion comercial, inteligencia de mercados y ejecucion operativa para convertir contactos en oportunidades reales y medibles.",
  },
] as const;

export function SeoFaqSection() {
  return (
    <section id="faq-camara" className="mt-20 md:mt-28" aria-label="Preguntas frecuentes de la Camara Argentina de Empresarios">
      <div className="section-shell">
        <div className="mb-10 space-y-3">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-gold">FAQ estrategico</p>
          <h2 className="section-heading text-3xl font-semibold md:text-4xl">
            Camara Argentina de Empresarios: preguntas frecuentes
          </h2>
          <p className="max-w-3xl text-text-muted">
            Respuestas claras sobre como CEAP Argentina conecta productores, inversores y oportunidades de comercio exterior.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {FAQ_ITEMS.map((item) => (
            <article key={item.question} className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold text-text-main">{item.question}</h3>
              <p className="mt-3 text-sm leading-6 text-text-muted">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function getFaqItems() {
  return FAQ_ITEMS;
}

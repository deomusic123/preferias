"use client";

import { motion } from "framer-motion";
import { VALUE_CARDS } from "@/lib/constants";

export function ValueSection() {
  return (
    <section id="valor" className="mt-20 md:mt-28">
      <div className="section-shell">
        <div className="mb-10 space-y-3">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-gold">Propuesta de valor</p>
          <h2 className="section-heading text-3xl font-semibold md:text-4xl">
            Diseño comercial, operacional y estratégico para convertir oportunidades en convenios.
          </h2>
          <p className="max-w-3xl text-text-muted">
            Turquesa Negro combina inteligencia comercial, conexión internacional y calificación de
            oportunidades para acelerar decisiones de negocio.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {VALUE_CARDS.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="glass-card rounded-2xl p-6 transition-all duration-200 hover:border-accent/50 hover:shadow-[0_0_28px_rgb(0_229_255_/_0.14)]"
            >
              <h3 className="font-display text-xl font-semibold text-text-main">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-text-muted">{card.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

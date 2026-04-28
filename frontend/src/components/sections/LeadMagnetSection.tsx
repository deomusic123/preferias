"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function LeadMagnetSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [highlightButton, setHighlightButton] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          setHighlightButton(false);
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          return;
        }

        timer = setTimeout(() => {
          setHighlightButton(true);
        }, 3000);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="mt-20 md:mt-28" aria-label="Lead magnet">
      <div className="section-shell">
        <div className="rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/12 to-gold/10 px-6 py-10 md:px-10">
          <p className="font-display text-xs uppercase tracking-[0.18em] text-gold">Lead magnet</p>
          <h2 className="section-heading mt-3 text-3xl font-semibold md:text-4xl">
            Solicita tu diagnóstico de viabilidad para convenios internacionales.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-text-muted md:text-base">
            En menos de 48 horas, nuestro equipo revisa tu perfil productivo o de inversión y te entrega
            una ruta inicial de oportunidades reales de comex.
          </p>

          <div className="mt-7">
            <a
              href="#formulario"
              className={cn(
                "btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold",
                highlightButton && "ring-4 ring-accent/30",
              )}
            >
              Quiero mi diagnóstico
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

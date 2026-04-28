"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent transition-all duration-200",
        isScrolled && "border-white/10 bg-bg/90 backdrop-blur-xl",
      )}
    >
      <div className="section-shell flex h-25 items-center justify-between">
        <a href="#inicio" className="flex items-center gap-3">
          <Image src="/ceap-white.png" alt="CEAP" width={220} height={50} priority />
          <span className="sr-only">CEAP</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-text-muted transition-colors hover:text-text-main"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#formulario"
          className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        >
          Aplicar
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}

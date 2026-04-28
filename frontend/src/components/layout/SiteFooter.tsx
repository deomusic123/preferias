import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 py-10 md:mt-28" id="legal">
      <div className="section-shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Image src="/ceap-white.png" alt="CEAP" width={100} height={30} />
            <span className="sr-only">CEAP</span>
          </div>
          <p className="text-sm text-text-muted">
            Plataforma B2B para convenios internacionales de comercio exterior.
          </p>
        </div>

        <nav aria-label="Enlaces legales" className="flex flex-wrap items-center gap-5 text-sm text-text-muted">
          <a href="/legal/privacidad" className="transition-colors hover:text-text-main">
            Privacidad
          </a>
          <a href="/legal/terminos" className="transition-colors hover:text-text-main">
            Términos
          </a>
          <a href="/legal/cookies" className="transition-colors hover:text-text-main">
            Cookies
          </a>
        </nav>
      </div>
    </footer>
  );
}

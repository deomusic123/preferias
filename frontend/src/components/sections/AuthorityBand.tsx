import { AUTHORITY_LOGOS } from "@/lib/constants";

const repeatedLogos = [...AUTHORITY_LOGOS, ...AUTHORITY_LOGOS];

export function AuthorityBand() {
  return (
    <section aria-label="Banda de confianza" className="mt-16 border-y border-white/10 py-5">
      <div className="overflow-hidden">
        <ul className="logo-track flex min-w-max items-center gap-4 px-4">
          {repeatedLogos.map((logo, index) => (
            <li
              key={`${logo.name}-${index}`}
              className="flex min-h-[44px] items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-2 text-xs font-medium tracking-wider text-white/65 transition"
            >
              {logo.src ? (
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-8 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                  loading="lazy"
                />
              ) : (
                <span className="grayscale transition hover:grayscale-0 hover:text-text-main">{logo.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

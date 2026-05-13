import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { AuthorityBand } from "@/components/sections/AuthorityBand";
import { ClosingCtaSection } from "@/components/sections/ClosingCtaSection";
import { HeroSection } from "@/components/sections/HeroSection";
import InteractiveMapSection from "@/components/sections/InteractiveMapSection";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { LeadMagnetSection } from "@/components/sections/LeadMagnetSection";
import { getFaqItems, SeoFaqSection } from "@/components/sections/SeoFaqSection";
import { ValueSection } from "@/components/sections/ValueSection";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://ceapargentina.com";

export const metadata: Metadata = {
  title: "Camara Argentina de Empresarios del Pacífico (CEAP) | Camara de Empresarios en Argentina",
  description:
    "Camara Argentina de Empresarios del Pacífico (CEAP): plataforma para productores e inversores que buscan convenios internacionales, expansion comercial y oportunidades reales de comercio exterior.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const faqItems = getFaqItems();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Camara Argentina de Empresarios del Pacífico",
    alternateName: "CEAP",
    url: SITE_URL,
    logo: `${SITE_URL}/ceap.png`,
    sameAs: [SITE_URL],
    description:
      "Camara Argentina de Empresarios del Pacífico orientada a conectar productores e inversores con oportunidades de comercio exterior.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CEAP",
    url: SITE_URL,
    inLanguage: "es-AR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <StickyHeader />
      <main className="pb-16">
        <HeroSection />
        <AuthorityBand />
        <ValueSection />
        <InteractiveMapSection />
        <LeadMagnetSection />
        <LeadFormSection />
        <ClosingCtaSection />
        <SeoFaqSection />
      </main>
      <SiteFooter />
    </>
  );
}

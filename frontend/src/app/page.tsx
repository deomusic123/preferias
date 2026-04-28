import { SiteFooter } from "@/components/layout/SiteFooter";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { AuthorityBand } from "@/components/sections/AuthorityBand";
import { ClosingCtaSection } from "@/components/sections/ClosingCtaSection";
import { HeroSection } from "@/components/sections/HeroSection";
import InteractiveMapSection from "@/components/sections/InteractiveMapSection";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { LeadMagnetSection } from "@/components/sections/LeadMagnetSection";
import { ValueSection } from "@/components/sections/ValueSection";

export default function Home() {
  return (
    <>
      <StickyHeader />
      <main className="pb-16">
        <HeroSection />
        <AuthorityBand />
        <ValueSection />
        <InteractiveMapSection />
        <LeadMagnetSection />
        <LeadFormSection />
        <ClosingCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}

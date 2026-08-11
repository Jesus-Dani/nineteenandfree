import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";

export default function TransparencyPage() {
  return (
    <div data-accent={PAGE_ACCENTS.transparency} className="mx-auto w-full max-w-3xl px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-4 text-4xl">Where Your Giving Goes</h1>
        <p className="mb-8 text-charcoal/90">
          We believe in being open, honest, and faithful stewards of every gift.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Card variant="outline" className="mb-6">
          <h2 className="mb-2 text-xl">Designated giving</h2>
          <p className="text-sm text-charcoal/80">
            When you give to a specific Wishlist item, that gift is tracked and reported only against
            that item or category — it is used only for what you chose to support.
          </p>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <Card variant="outline">
          <h2 className="mb-2 text-xl">General Outreach Fund</h2>
          <p className="text-sm text-charcoal/80">
            Gifts to the General Outreach Fund cover approved overall outreach costs — food, drinks,
            transportation, activities, printing, materials, logistics, and packaging.
          </p>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p className="mt-10 text-sm text-charcoal/70">
          The Final Impact Report will be linked here once the outreach concludes and figures are
          confirmed.
        </p>
      </ScrollReveal>
    </div>
  );
}

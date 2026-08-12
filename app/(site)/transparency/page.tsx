import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";
import { formatNaira } from "@/lib/format";
import { getTransparencyTotals } from "@/lib/transparency-totals";

export const revalidate = 45;

export default async function TransparencyPage() {
  const totals = await getTransparencyTotals();

  return (
    <div data-accent={PAGE_ACCENTS.transparency} className="mx-auto w-full max-w-3xl px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-4 text-4xl">Where Your Giving Goes</h1>
        <p className="mb-8 text-charcoal/90">
          We believe in being open, honest, and faithful stewards of every gift.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card variant="fill" className="text-center">
            <p className="text-2xl">{formatNaira(totals.overallTotal)}</p>
            <p className="text-xs">Total raised</p>
          </Card>
          <Card variant="outline" className="text-center">
            <p className="text-2xl">{formatNaira(totals.designatedTotal)}</p>
            <p className="text-xs text-charcoal/70">Designated giving</p>
          </Card>
          <Card variant="outline" className="text-center">
            <p className="text-2xl">{formatNaira(totals.generalTotal)}</p>
            <p className="text-xs text-charcoal/70">General Outreach Fund</p>
          </Card>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Card variant="outline" className="mb-6">
          <h2 className="mb-2 text-xl">Designated giving</h2>
          <p className="text-sm text-charcoal/80">
            When you give to a specific item from What they need, that gift is tracked and reported
            only against that item or category. It is used only for what you chose to support.
          </p>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <Card variant="outline">
          <h2 className="mb-2 text-xl">General Outreach Fund</h2>
          <p className="text-sm text-charcoal/80">
            Gifts to the General Outreach Fund cover approved overall outreach costs: food, drinks,
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

import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";

export default function ImpactPage() {
  return (
    <div data-accent={PAGE_ACCENTS.impact} className="mx-auto w-full max-w-3xl px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-4 text-4xl">Impact &amp; Updates</h1>
        <p className="mb-8 text-charcoal/90">
          Every act of kindness creates ripples of hope. Here&apos;s how your support made a
          difference.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Card variant="fill">
          <p className="text-sm">
            This page is populated after the outreach event with real tallies (Bibles, books, meals,
            packs, and more, sourced from actual procurement, never estimates), photos, and a short
            narrative of what happened.
          </p>
        </Card>
      </ScrollReveal>
    </div>
  );
}

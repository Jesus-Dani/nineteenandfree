import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";

export default function GivePage() {
  return (
    <div data-accent={PAGE_ACCENTS.give} className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
      <ScrollReveal>
        <h1 className="mb-4 text-4xl">Give</h1>
        <p className="mb-8 text-charcoal/90">
          Your generosity fuels hope and transforms lives. No minimum amount, and every gift is
          tracked transparently.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Card variant="outline">
          <p className="text-sm text-charcoal/70">
            The full Give flow — choosing a Wishlist item or the General Outreach Fund, picking an
            amount, and paying securely via Paystack — arrives in Phase 2. No refunds; all gifts are
            final.
          </p>
        </Card>
      </ScrollReveal>
    </div>
  );
}

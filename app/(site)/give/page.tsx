import Link from "next/link";
import { Card } from "@/components/Card";
import { CtaButton } from "@/components/CtaButton";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";
import { formatNaira } from "@/lib/format";
import { getWishlistCatalogue } from "@/lib/wishlist";
import { getGiveFlowEnabled } from "@/lib/site-settings";

export const revalidate = 45;

export default async function GivePage() {
  const [catalogue, giveFlowEnabled] = await Promise.all([
    getWishlistCatalogue(),
    getGiveFlowEnabled(),
  ]);
  const allItems = [...catalogue.values()].flat();

  if (!giveFlowEnabled) {
    return (
      <div data-accent={PAGE_ACCENTS.give} className="mx-auto w-full max-w-2xl px-6 py-16 text-center">
        <ScrollReveal>
          <h1 className="mb-4 text-4xl">Giving has closed</h1>
          <Card variant="outline">
            <p className="text-sm text-charcoal/70">
              Thank you to everyone who gave. The outreach&apos;s Give flow is no longer accepting
              new gifts. Visit Impact and Transparency to see what your generosity made possible.
            </p>
          </Card>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div data-accent={PAGE_ACCENTS.give} className="mx-auto w-full max-w-2xl px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-4 text-center text-4xl">Give</h1>
        <p className="mb-10 text-center text-charcoal/90">
          Your generosity fuels hope and transforms lives. No minimum amount, and every gift is
          tracked transparently.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <h2 className="mb-3 text-xl">Support a specific need</h2>
        {allItems.length === 0 ? (
          <Card variant="outline" className="mb-8">
            <p className="text-sm text-charcoal/70">
              Items are being added to What they need. Check back soon, or support the General
              Outreach Fund below in the meantime.
            </p>
          </Card>
        ) : (
          <div className="mb-8 flex flex-col gap-3">
            {allItems.map((item) => (
              <Link
                key={item.id}
                href={`/give/amount?item=${item.id}`}
                className="card-shape flex items-center justify-between border-2 bg-cream px-5 py-4 text-charcoal"
                style={{ borderColor: "var(--accent)" }}
              >
                <span>
                  {item.name} <span className="text-charcoal/50">({item.category})</span>
                </span>
                <span className="text-sm text-charcoal/60">{formatNaira(item.unitCost)}/unit →</span>
              </Link>
            ))}
          </div>
        )}
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2 className="mb-3 text-xl">Or support the outreach overall</h2>
        <Card variant="fill" className="flex flex-col items-start gap-4">
          <p className="text-sm">
            The General Outreach Fund covers food, drinks, transportation, activities, printing,
            materials, logistics, and packaging for the event.
          </p>
          <CtaButton href="/give/amount?fund=general">Give to the General Fund</CtaButton>
        </Card>
      </ScrollReveal>
    </div>
  );
}

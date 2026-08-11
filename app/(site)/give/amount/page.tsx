import Link from "next/link";
import { Card } from "@/components/Card";
import { GiveAmountForm } from "@/components/GiveAmountForm";
import { PhotoFrame } from "@/components/PhotoFrame";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";
import { formatNaira } from "@/lib/format";
import { getWishlistItemById } from "@/lib/wishlist";
import { getGiveFlowEnabled } from "@/lib/site-settings";

type SearchParams = Promise<{ item?: string; fund?: string; mode?: string }>;

export default async function GiveAmountPage({ searchParams }: { searchParams: SearchParams }) {
  const { item: itemId, fund, mode } = await searchParams;

  if (!(await getGiveFlowEnabled())) {
    return (
      <div data-accent={PAGE_ACCENTS.give} className="mx-auto w-full max-w-lg px-6 py-16 text-center">
        <Card variant="outline">
          <p className="text-sm text-charcoal/70">
            Giving has closed. Thank you to everyone who supported this outreach.
          </p>
          <Link href="/" className="mt-4 inline-block underline">
            Back to Home
          </Link>
        </Card>
      </div>
    );
  }

  if (!itemId && fund !== "general") {
    return (
      <div data-accent={PAGE_ACCENTS.give} className="mx-auto w-full max-w-lg px-6 py-16 text-center">
        <Card variant="outline">
          <p className="text-sm text-charcoal/70">
            Please choose what you&apos;d like to support first.
          </p>
          <Link href="/give" className="mt-4 inline-block underline">
            Back to Give
          </Link>
        </Card>
      </div>
    );
  }

  if (itemId) {
    const item = await getWishlistItemById(itemId);

    if (!item) {
      return (
        <div data-accent={PAGE_ACCENTS.give} className="mx-auto w-full max-w-lg px-6 py-16 text-center">
          <Card variant="outline">
            <p className="text-sm text-charcoal/70">
              This item is no longer available. Please choose another.
            </p>
            <Link href="/give" className="mt-4 inline-block underline">
              Back to Give
            </Link>
          </Card>
        </div>
      );
    }

    return (
      <div data-accent={PAGE_ACCENTS.give} className="mx-auto w-full max-w-lg px-6 py-16">
        <ScrollReveal>
          {item.imageUrl && (
            <PhotoFrame
              src={item.imageUrl}
              alt={item.name}
              width={480}
              height={320}
              className="mb-6 aspect-[3/2]"
            />
          )}
          <h1 className="mb-2 text-3xl">{item.name}</h1>
          <p className="mb-8 text-sm text-charcoal/70">
            {formatNaira(item.nextUnitRemaining)} still needed to fund the next unit
            {" "}({formatNaira(item.unitCost)} per unit).
          </p>
          <GiveAmountForm
            kind="item"
            itemId={item.id}
            nextUnitRemaining={item.nextUnitRemaining}
            defaultToFullUnit={mode === "unit"}
          />
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div data-accent={PAGE_ACCENTS.give} className="mx-auto w-full max-w-lg px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-2 text-3xl">General Outreach Fund</h1>
        <p className="mb-8 text-sm text-charcoal/70">
          Covers food, drinks, transportation, activities, printing, materials, logistics, and
          packaging.
        </p>
        <GiveAmountForm kind="general" />
      </ScrollReveal>
    </div>
  );
}

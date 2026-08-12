import Link from "next/link";
import { Card } from "@/components/Card";
import { CtaButton } from "@/components/CtaButton";
import { PhotoFrame } from "@/components/PhotoFrame";
import { ProgressBar } from "@/components/ProgressBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";
import { formatNaira } from "@/lib/format";
import { getWishlistCatalogue } from "@/lib/wishlist";

// Wishlist and progress figures are cached briefly rather than queried fresh
// on every request (TRD Section 4 — ~30-60s window).
export const revalidate = 45;

const CANONICAL_CATEGORIES = [
  "Bibles",
  "Children's Books",
  "Teen/Young Adult Books",
  "Educational Materials",
  "Overall Outreach",
];

export default async function WishlistPage() {
  const catalogue = await getWishlistCatalogue();
  const categories = new Set([...CANONICAL_CATEGORIES, ...catalogue.keys()]);

  return (
    <div data-accent={PAGE_ACCENTS.wishlist} className="mx-auto w-full max-w-6xl px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-4 text-4xl">What they need</h1>
        <p className="mb-12 max-w-2xl text-charcoal/90">
          These items and needs will help us reach the children with Bibles, books, and educational
          resources. Fund a full unit, or give any amount toward the next one. Every gift counts
          toward real, live progress.
        </p>
      </ScrollReveal>

      <div className="flex flex-col gap-10">
        {[...categories].map((category, i) => {
          const items = catalogue.get(category) ?? [];
          return (
            <ScrollReveal key={category} delay={i * 0.05}>
              <section>
                <h2 className="mb-4 text-2xl">{category}</h2>
                {items.length === 0 ? (
                  <Card variant="outline">
                    <p className="text-sm text-charcoal/70">
                      No items in this category yet. Check back soon.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {items.map((item) => (
                      <Card key={item.id} variant="outline" className="flex flex-col gap-4">
                        {item.imageUrl && (
                          <PhotoFrame
                            src={item.imageUrl}
                            alt={item.name}
                            width={480}
                            height={320}
                            className="aspect-[3/2]"
                          />
                        )}
                        <div>
                          <h3 className="text-lg">{item.name}</h3>
                          {item.description && (
                            <p className="mt-1 text-sm text-charcoal/70">{item.description}</p>
                          )}
                          <p className="mt-1 text-xs text-charcoal/50">
                            {formatNaira(item.unitCost)} per unit
                          </p>
                        </div>
                        <ProgressBar progress={item} />
                        <div className="flex flex-wrap gap-3">
                          <CtaButton href={`/give/amount?item=${item.id}&mode=unit`}>
                            Fund a full unit
                          </CtaButton>
                          <Link
                            href={`/give/amount?item=${item.id}`}
                            className="button-shape inline-flex items-center justify-center border-2 px-6 py-3 text-sm text-charcoal"
                            style={{ borderColor: "var(--accent)" }}
                          >
                            Give a custom amount
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}

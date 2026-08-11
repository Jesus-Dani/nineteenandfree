import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";

const CATEGORIES = [
  "Bibles",
  "Children's Books",
  "Teen/Young Adult Books",
  "Educational Materials",
  "Overall Outreach",
];

export default function WishlistPage() {
  return (
    <div data-accent={PAGE_ACCENTS.wishlist} className="mx-auto w-full max-w-6xl px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-4 text-4xl">The Wishlist</h1>
        <p className="mb-12 max-w-2xl text-charcoal/90">
          These items and needs will help us reach the children with Bibles, books, and educational
          resources. Fund a full unit, or give any amount toward the next one — every gift counts
          toward real, live progress.
        </p>
      </ScrollReveal>

      <div className="flex flex-col gap-10">
        {CATEGORIES.map((category, i) => (
          <ScrollReveal key={category} delay={i * 0.05}>
            <section>
              <h2 className="mb-4 text-2xl">{category}</h2>
              <Card variant="outline">
                <p className="text-sm text-charcoal/70">
                  Real items with live pricing and progress will appear here once the admin adds them
                  to the catalogue (Phase 2). Nothing is hard-coded — this list is fully admin-managed.
                </p>
              </Card>
            </section>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";

export default function LettersOfLovePage() {
  return (
    <div data-accent={PAGE_ACCENTS.lettersOfLove} className="mx-auto w-full max-w-3xl px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-4 text-4xl">Letters of Love</h1>
        <p className="mb-8 text-charcoal/90">
          Write a message of encouragement for the children — with or without a gift. Your message
          may be displayed on this page and printed in a physical keepsake for the children and
          library.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Card variant="outline">
          <p className="text-sm text-charcoal/70">
            The submission form and the public wall of approved messages arrive in Phase 3, alongside
            rate limiting and moderation. Every message can be submitted anonymously, and once
            approved, appears here and in the keepsake — one commitment, not two separate opt-ins.
          </p>
        </Card>
      </ScrollReveal>
    </div>
  );
}

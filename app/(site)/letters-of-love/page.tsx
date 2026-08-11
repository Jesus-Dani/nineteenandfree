import { Card } from "@/components/Card";
import { CtaButton } from "@/components/CtaButton";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";
import { getApprovedMessages } from "@/lib/messages";

export const revalidate = 45;

export default async function LettersOfLovePage() {
  const messages = await getApprovedMessages();

  return (
    <div data-accent={PAGE_ACCENTS.lettersOfLove} className="mx-auto w-full max-w-3xl px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-4 text-4xl">Letters of Love</h1>
        <p className="mb-4 text-charcoal/90">
          Write a message of encouragement for the children — with or without a gift. Your message
          may be displayed on this page and printed in a physical keepsake for the children and
          library.
        </p>
        <CtaButton href="/letters-of-love/write">Write a Letter of Love</CtaButton>
      </ScrollReveal>

      <div className="mt-12 flex flex-col gap-5">
        {messages.length === 0 ? (
          <ScrollReveal delay={0.1}>
            <Card variant="outline">
              <p className="text-sm text-charcoal/70">
                No messages have been approved yet — be the first to write one.
              </p>
            </Card>
          </ScrollReveal>
        ) : (
          messages.map((message, i) => (
            <ScrollReveal key={message.id} delay={Math.min(i * 0.05, 0.4)}>
              <Card variant="outline">
                <p className="whitespace-pre-wrap text-charcoal/90">{message.messageText}</p>
                <p className="mt-3 text-sm text-charcoal/50">
                  — {message.isAnonymous || !message.displayName ? "Anonymous" : message.displayName}
                </p>
              </Card>
            </ScrollReveal>
          ))
        )}
      </div>
    </div>
  );
}

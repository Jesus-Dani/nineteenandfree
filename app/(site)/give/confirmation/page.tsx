import Link from "next/link";
import { Card } from "@/components/Card";
import { CtaButton } from "@/components/CtaButton";
import { ScrollReveal } from "@/components/ScrollReveal";
import { LetterOfLoveForm } from "@/components/LetterOfLoveForm";
import { BraceletForm } from "@/components/BraceletForm";
import { PAGE_ACCENTS } from "@/lib/theme";
import { confirmContributionPayment } from "@/lib/confirm-contribution";

type SearchParams = Promise<{ reference?: string }>;

export default async function GiveConfirmationPage({ searchParams }: { searchParams: SearchParams }) {
  const { reference } = await searchParams;

  let body: React.ReactNode;
  let postPayment: React.ReactNode = null;

  if (!reference) {
    body = (
      <Card variant="outline">
        <p className="text-sm text-charcoal/70">We couldn&apos;t find a payment reference for this page.</p>
      </Card>
    );
  } else {
    const result = await confirmContributionPayment(reference);

    switch (result.status) {
      case "paid":
      case "already-paid":
        body = (
          <Card variant="fill" className="text-center">
            <p className="font-script mb-2 text-3xl">Thank you.</p>
            <p className="text-sm">
              Your gift has been received. A receipt has been sent to your email by Paystack.
            </p>
          </Card>
        );
        // Design doc Section 11 steps 6b-6c: both prompts are optional and
        // skippable — nothing after the thank-you above is required.
        postPayment = (
          <div className="mt-10 flex flex-col gap-10">
            <section>
              <h2 className="mb-4 text-xl">Write a Letter of Love (optional)</h2>
              <LetterOfLoveForm contributionId={result.contributionId} />
            </section>
            <section>
              <h2 className="mb-4 text-xl">Commemorative bracelet (optional)</h2>
              <BraceletForm contributionId={result.contributionId} />
            </section>
          </div>
        );
        break;
      case "pending":
        body = (
          <Card variant="outline" className="text-center">
            <p className="text-sm text-charcoal/70">
              We&apos;re still confirming your payment with Paystack. This can take a moment —
              refresh this page shortly, or check back later.
            </p>
          </Card>
        );
        break;
      case "failed":
        body = (
          <Card variant="outline" className="text-center">
            <p className="mb-4 text-sm text-charcoal/70">
              This payment wasn&apos;t completed. No charge was made.
            </p>
            <CtaButton href="/give">Try again</CtaButton>
          </Card>
        );
        break;
      case "mismatch":
        body = (
          <Card variant="outline" className="text-center">
            <p className="text-sm text-charcoal/70">
              We found a mismatch while confirming this payment. Please contact us at{" "}
              <a href="mailto:anokwudaniella@gmail.com" className="underline">
                anokwudaniella@gmail.com
              </a>{" "}
              with your payment reference so we can look into it.
            </p>
          </Card>
        );
        break;
      case "not-found":
      default:
        body = (
          <Card variant="outline" className="text-center">
            <p className="text-sm text-charcoal/70">
              We couldn&apos;t find a matching contribution for this reference.
            </p>
          </Card>
        );
        break;
    }
  }

  return (
    <div data-accent={PAGE_ACCENTS.give} className="mx-auto w-full max-w-lg px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-6 text-center text-3xl">Give</h1>
        {body}
        {postPayment}
        <p className="mt-8 text-center text-sm">
          <Link href="/" className="underline">
            Back to Home
          </Link>
        </p>
      </ScrollReveal>
    </div>
  );
}

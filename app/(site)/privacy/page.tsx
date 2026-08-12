import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata = {
  title: "Privacy Policy: Nineteenandfree",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-8 text-4xl">Privacy Policy: Nineteenandfree</h1>
        <div className="flex flex-col gap-5 text-charcoal/90">
          <p className="italic">
            This site is run by Anokwu Chiaza Daniella for the Nineteenandfree birthday outreach. We
            collect only what we need to run this campaign, and we don&apos;t sell or share your
            information beyond what&apos;s described here.
          </p>

          <div>
            <h2 className="mb-1 text-xl">What we collect</h2>
            <p>
              If you give: your email (via Paystack) and payment details, handled directly by
              Paystack; we never see or store card details ourselves. If you write a Letter of Love:
              your name (optional, can be anonymous) and your message. If you request a bracelet (RUN
              students only): name, phone number, WhatsApp number, size, gender.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-xl">Why we collect it</h2>
            <p>
              To process donations and send confirmations; to display approved messages on Letters of
              Love and print them in the physical keepsake; to contact bracelet recipients directly
              for campus pickup.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-xl">Who we share it with</h2>
            <p>
              Paystack (payment processing) and Supabase (our database provider). We do not sell data
              or share it with advertisers.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-xl">How long we keep it</h2>
            <p>
              Contribution and message records are kept for the duration of the outreach and its
              reporting period, then archived or deleted once the campaign concludes.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-xl">Your rights</h2>
            <p>
              You can ask to see, correct, or delete your information by contacting{" "}
              <a href="mailto:anokwudaniella@gmail.com" className="underline">
                anokwudaniella@gmail.com
              </a>{" "}
              or 09133999279. Anonymous submissions cannot be individually identified or removed
              after the fact.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

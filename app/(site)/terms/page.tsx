import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata = {
  title: "Terms of Use: Nineteenandfree",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <ScrollReveal>
        <h1 className="mb-8 text-4xl">Terms of Use: Nineteenandfree</h1>
        <div className="flex flex-col gap-5 text-charcoal/90">
          <p className="italic">
            By using this site or making a contribution, you agree to the following:
          </p>

          <div>
            <h2 className="mb-1 text-xl">About this campaign</h2>
            <p>
              Nineteenandfree is a one-time birthday outreach campaign, not a registered charity or
              ongoing organization. It closes once the outreach event and its reporting are complete.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-xl">Giving</h2>
            <p>
              All gifts are final: no refunds, including for changed minds, duplicate payments, or
              mistaken amounts (contact us for genuine payment errors, though resolution isn&apos;t
              guaranteed). Designated gifts are used only for their specified item; General Outreach
              Fund gifts support approved overall costs. A Transparency report shows fund usage.
              Payments are processed via Paystack; we never see or store card details.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-xl">Letters of Love</h2>
            <p>
              Anything submitted may be displayed publicly and printed in a physical keepsake. This
              is understood at submission, not a separate request. Anonymous submissions omit the
              name in both digital and print. Submissions are reviewed (automatic + manual check)
              before publishing; inappropriate, spam, or unrelated content may be declined. Limit: one
              message per hour.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-xl">Bracelets</h2>
            <p>
              Available only to Redeemers University students, as a thank-you gesture (not a
              purchase). It is not guaranteed and not tied to any gift amount. Distributed in person
              on campus.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-xl">Use of the site</h2>
            <p>
              Don&apos;t attempt to disrupt, spam, or misuse the site or its features. Terms/site may
              be updated as needed during the campaign.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-xl">Contact</h2>
            <p>
              <a href="mailto:anokwudaniella@gmail.com" className="underline">
                anokwudaniella@gmail.com
              </a>{" "}
              · 09133999279
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

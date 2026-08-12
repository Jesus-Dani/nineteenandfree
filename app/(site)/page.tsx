import { CtaButton } from "@/components/CtaButton";
import { Card } from "@/components/Card";
import { PhotoFrame } from "@/components/PhotoFrame";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PAGE_ACCENTS } from "@/lib/theme";

const CORE_THEMES = [
  {
    name: "Identity",
    accent: "soft-roses",
    body: "Who God says we are.",
  },
  {
    name: "Redemption",
    accent: "eucalyptus",
    body: "Our past does not have the final word.",
  },
  {
    name: "Hope",
    accent: "lavender",
    body: "Our circumstances do not determine our future.",
  },
  {
    name: "Purpose",
    accent: "tulip-stems",
    body: "Every child has dreams, gifts, and potential.",
  },
] as const;

export default function HomePage() {
  return (
    <div data-accent={PAGE_ACCENTS.home}>
      {/* Hero */}
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 pt-6 pb-20 md:flex-row md:pt-16">
        <div className="flex flex-1 flex-col gap-6 text-center md:text-left">
          <ScrollReveal>
            <h1 className="text-5xl leading-tight md:text-6xl">
              nineteen<span className="font-script text-pink-tulips"> &amp; </span>free
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-lg text-charcoal/90">
              A faith-filled birthday giving initiative celebrating 19 years of God&apos;s grace and
              extending love to others — Bibles, books, and support for children, given in celebration
              of Christ&apos;s redemption.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex justify-center md:justify-start">
              <CtaButton href="/give">Give Now</CtaButton>
            </div>
          </ScrollReveal>
        </div>
        <div className="flex flex-1 justify-center">
          <ScrollReveal delay={0.15}>
            <div className="relative w-64 md:w-80">
              <PhotoFrame
                src="/images/daniella-hero.jpeg"
                alt="Daniella"
                width={480}
                height={600}
                priority
                className="aspect-[4/5] w-full"
              />
              <span className="font-script text-pink-tulips absolute -bottom-4 -right-2 text-6xl">19</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Anchor scripture */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-20">
        <ScrollReveal>
          <Card variant="fill" className="text-center">
            <p className="font-script mb-2 text-3xl">You are loved.</p>
            <p className="text-base">
              &ldquo;There is therefore now no condemnation for those who are in Christ Jesus.&rdquo;
            </p>
            <p className="mt-1 text-sm text-charcoal/70">Romans 8:1</p>
          </Card>
        </ScrollReveal>
      </section>

      {/* About / core message */}
      <section id="about" className="mx-auto w-full max-w-3xl px-6 pb-20">
        <ScrollReveal>
          <h2 className="mb-6 text-center text-3xl">About the Outreach</h2>
          <div className="flex flex-col gap-5 text-charcoal/90">
            <p>
              This is my 19th birthday, and for a while I honestly wasn’t excited about it. I
              couldn’t figure out why until I realized it was because I couldn’t celebrate my life
              without giving something back first. In Hebrew, 19 carries the weight of God’s
              perfect judgment, and my name Daniella means “God is my Judge,” so I started thinking
              about what that actually means. And what it means is this: the judgment God has
              already passed over us isn’t condemnation, it’s redemption. Because of what Jesus did
              on the cross, our shame and our guilt and everything in our past don’t get to have
              the final say over who we are.
            </p>
            <p>
              So for my birthday this year, I’m taking that truth to a free Christian library in
              Ajegunle that serves children who don’t have much. We’re going to sit and eat
              together, cut cake, hear about their dreams, and pray with them. I want the children
              and teenagers to walk away knowing who they are in Christ, not who their
              circumstances have told them they are. And more than anything, I want to lead them to
              Him.
            </p>
            <p>
              Every Bible, every book, every gift someone gives here goes toward that day.
              There’s no condemnation in this. Only redemption. That’s what turning 19 means to me.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Core themes */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <ScrollReveal>
          <h2 className="mb-8 text-center text-3xl">How your gift creates impact</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {CORE_THEMES.map((theme, i) => (
            <ScrollReveal key={theme.name} delay={i * 0.08}>
              <div data-accent={theme.accent}>
                <Card variant="outline">
                  <h3 className="mb-2 text-xl">{theme.name}</h3>
                  <p className="text-sm text-charcoal/80">{theme.body}</p>
                </Card>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 text-center">
        <ScrollReveal>
          <h2 className="mb-4 text-3xl">Together, we make a difference</h2>
          <p className="mb-8 text-charcoal/90">
            Every gift, every prayer, and every word of encouragement helps spread love and hope.
          </p>
          <CtaButton href="/give">Give Now</CtaButton>
        </ScrollReveal>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-charcoal/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-charcoal/80 md:flex-row md:items-center md:justify-between">
        <Logo />
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/wishlist">What They Need</Link>
          <Link href="/letters-of-love">Letters of Love</Link>
          <Link href="/impact">Impact</Link>
          <Link href="/transparency">Transparency</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
        </nav>
        <div className="flex flex-col gap-1">
          <a href="mailto:anokwudaniella@gmail.com">anokwudaniella@gmail.com</a>
          <a href="tel:+2349133999279">09133999279</a>
        </div>
      </div>
      <p className="mx-auto w-full max-w-6xl px-6 pb-8 text-xs text-charcoal/60">
        &copy; {new Date().getFullYear()} Nineteenandfree. A one-time birthday outreach campaign, not a registered charity or ongoing organization.
      </p>
    </footer>
  );
}

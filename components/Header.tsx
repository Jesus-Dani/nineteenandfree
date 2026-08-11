import Link from "next/link";
import { Logo } from "./Logo";
import { CtaButton } from "./CtaButton";
import { MobileNav } from "./MobileNav";
import { NAV_LINKS } from "@/lib/nav-links";

export function Header() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Logo />
      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-charcoal/90 hover:text-charcoal">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="hidden md:block">
        <CtaButton href="/give">Give Now</CtaButton>
      </div>
      <MobileNav />
    </header>
  );
}

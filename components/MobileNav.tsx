"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { NAV_LINKS } from "@/lib/nav-links";

/** Hand-drawn hamburger icon (three simple lines) opening a cream slide-in panel (Design doc Section 7). */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center"
      >
        <svg width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden="true">
          <path d="M2 3c6 0 16-1 22 0" stroke="var(--color-charcoal)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M2 10c8-0.5 15 0.5 22 0" stroke="var(--color-charcoal)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M2 17c6 0.5 16-0.5 22 0" stroke="var(--color-charcoal)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-charcoal/30"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute top-0 right-0 flex h-full w-72 max-w-[80vw] flex-col gap-6 rounded-l-[var(--radius-card)] bg-cream p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-2xl leading-none text-charcoal"
              >
                &times;
              </button>
            </div>
            <ul className="flex flex-col gap-4 text-lg">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setOpen(false)} className="text-charcoal">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/give"
              onClick={() => setOpen(false)}
              className="button-shape mt-auto inline-flex items-center justify-center bg-pink-tulips px-6 py-3 text-center text-charcoal shadow-[var(--shadow-soft)]"
            >
              Give Now
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import type { ComponentProps } from "react";

type CtaButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">;

/**
 * Primary CTA — always Pink Tulips, regardless of page accent (PRD Section 8.2,
 * Design doc Section 2 rule 3). Use for "Give Now," "Submit," "Confirm."
 */
export function CtaButton({ href, children, className = "", ...props }: CtaButtonProps) {
  return (
    <Link
      href={href}
      className={`button-shape inline-flex items-center justify-center bg-pink-tulips px-6 py-3 text-base text-charcoal shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03] ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

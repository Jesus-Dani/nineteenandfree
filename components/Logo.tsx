import Link from "next/link";

/**
 * Text wordmark + small hand-drawn heart icon (Design doc Section 9 —
 * mockup-confirmed update from the original text-only decision).
 */
export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-1.5 text-xl leading-none text-charcoal"
      aria-label="Nineteenandfree — home"
    >
      <span className="whitespace-nowrap">nineteen and free</span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 28 28"
        fill="none"
        stroke="var(--color-pink-tulips)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 23c-4-3-9-7-9-12 0-3 2-5 5-5 2 0 3.5 1 4 2.5C14.5 6.5 16 5.5 18 5.5c3 0 5 2 5 5 0 5-5 9-9 12.5z" />
      </svg>
    </Link>
  );
}

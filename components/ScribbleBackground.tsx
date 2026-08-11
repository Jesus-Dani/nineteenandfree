const PHRASES: { text: string; top: string; left: string; rotate: number; color: string; size: string }[] = [
  { text: "Happy 19th Birthday", top: "4%", left: "8%", rotate: -6, color: "var(--color-soft-roses)", size: "1.1rem" },
  { text: "You are loved", top: "3%", left: "62%", rotate: 4, color: "var(--color-charcoal)", size: "1.3rem" },
  { text: "Romans 8:1", top: "11%", left: "38%", rotate: -3, color: "var(--color-eucalyptus)", size: "1rem" },
  { text: "No condemnation", top: "9%", left: "82%", rotate: 5, color: "var(--color-lavender)", size: "1rem" },
  { text: "Jesus loves you", top: "18%", left: "3%", rotate: 3, color: "var(--color-tulip-stems)", size: "1.1rem" },
  { text: "Grace", top: "22%", left: "72%", rotate: -8, color: "var(--color-charcoal)", size: "1.4rem" },
  { text: "Free from condemnation", top: "27%", left: "27%", rotate: 2, color: "var(--color-eucalyptus)", size: "1rem" },
  { text: "Chosen", top: "33%", left: "88%", rotate: -4, color: "var(--color-soft-roses)", size: "1.3rem" },
  { text: "Redeemed", top: "38%", left: "10%", rotate: 5, color: "var(--color-lavender)", size: "1.2rem" },
  { text: "Purpose", top: "44%", left: "55%", rotate: -3, color: "var(--color-tulip-stems)", size: "1.2rem" },
  { text: "You are seen", top: "48%", left: "78%", rotate: 4, color: "var(--color-charcoal)", size: "1rem" },
  { text: "Hope", top: "54%", left: "18%", rotate: -5, color: "var(--color-eucalyptus)", size: "1.4rem" },
  { text: "New every morning", top: "58%", left: "42%", rotate: 3, color: "var(--color-soft-roses)", size: "1rem" },
  { text: "Beloved", top: "63%", left: "68%", rotate: -6, color: "var(--color-lavender)", size: "1.3rem" },
  { text: "Romans 8:1", top: "69%", left: "6%", rotate: 4, color: "var(--color-charcoal)", size: "1rem" },
  { text: "Grace", top: "74%", left: "85%", rotate: -3, color: "var(--color-tulip-stems)", size: "1.1rem" },
  { text: "You are loved", top: "79%", left: "30%", rotate: 5, color: "var(--color-eucalyptus)", size: "1.1rem" },
  { text: "Hope", top: "84%", left: "60%", rotate: -4, color: "var(--color-soft-roses)", size: "1.2rem" },
  { text: "Chosen", top: "89%", left: "12%", rotate: 3, color: "var(--color-lavender)", size: "1rem" },
  { text: "Purpose", top: "93%", left: "75%", rotate: -5, color: "var(--color-charcoal)", size: "1.1rem" },
];

const DOODLES: { kind: "heart" | "cross" | "star" | "swirl"; top: string; left: string; rotate: number; color: string }[] = [
  { kind: "heart", top: "7%", left: "48%", rotate: -10, color: "var(--color-soft-roses)" },
  { kind: "cross", top: "16%", left: "20%", rotate: 6, color: "var(--color-eucalyptus)" },
  { kind: "star", top: "24%", left: "60%", rotate: 0, color: "var(--color-lavender)" },
  { kind: "swirl", top: "31%", left: "6%", rotate: -8, color: "var(--color-tulip-stems)" },
  { kind: "heart", top: "41%", left: "82%", rotate: 12, color: "var(--color-lavender)" },
  { kind: "star", top: "51%", left: "32%", rotate: -4, color: "var(--color-soft-roses)" },
  { kind: "cross", top: "61%", left: "90%", rotate: 8, color: "var(--color-charcoal)" },
  { kind: "swirl", top: "71%", left: "50%", rotate: 5, color: "var(--color-eucalyptus)" },
  { kind: "heart", top: "87%", left: "40%", rotate: -6, color: "var(--color-tulip-stems)" },
  { kind: "star", top: "96%", left: "88%", rotate: 3, color: "var(--color-eucalyptus)" },
];

function Doodle({ kind, color }: { kind: "heart" | "cross" | "star" | "swirl"; color: string }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 28 28",
    fill: "none",
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (kind) {
    case "heart":
      return (
        <svg {...common}>
          <path d="M14 23c-4-3-9-7-9-12 0-3 2-5 5-5 2 0 3.5 1 4 2.5C14.5 6.5 16 5.5 18 5.5c3 0 5 2 5 5 0 5-5 9-9 12.5z" />
        </svg>
      );
    case "cross":
      return (
        <svg {...common}>
          <path d="M14 3v22M4 12h20" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M14 3l2.4 7.2L23 12l-6.6 2.1L14 21l-2.4-6.9L5 12l6.6-1.8z" />
        </svg>
      );
    case "swirl":
      return (
        <svg {...common}>
          <path d="M6 16c0-6 5-10 10-8s6 8 2 10-9-1-8-6 6-7 9-4" />
        </svg>
      );
  }
}

/**
 * One consistent, low-opacity scribble layer reused identically on every page
 * (Design doc Section 4). Positions are fixed/hand-placed, not runtime-random,
 * so the layout never reshuffles or hydration-mismatches. Rendered once from
 * the root layout so it persists across client-side navigation.
 */
export function ScribbleBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.11]"
    >
      {PHRASES.map((p, i) => (
        <span
          key={`phrase-${i}`}
          className="font-script absolute whitespace-nowrap"
          style={{
            top: p.top,
            left: p.left,
            transform: `rotate(${p.rotate}deg)`,
            color: p.color,
            fontSize: p.size,
          }}
        >
          {p.text}
        </span>
      ))}
      {DOODLES.map((d, i) => (
        <div
          key={`doodle-${i}`}
          className="absolute"
          style={{ top: d.top, left: d.left, transform: `rotate(${d.rotate}deg)` }}
        >
          <Doodle kind={d.kind} color={d.color} />
        </div>
      ))}
    </div>
  );
}

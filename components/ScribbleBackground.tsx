const TILE_SIZE = 480;

const PHRASES: { text: string; x: number; y: number; rotate: number; color: string; size: number }[] = [
  { text: "Grace", x: 95, y: 70, rotate: -8, color: "var(--color-charcoal)", size: 30 },
  { text: "You are loved", x: 330, y: 55, rotate: 5, color: "var(--color-soft-roses)", size: 22 },
  { text: "Hope", x: 75, y: 190, rotate: 6, color: "var(--color-eucalyptus)", size: 28 },
  { text: "Romans 8:1", x: 270, y: 165, rotate: -4, color: "var(--color-lavender)", size: 20 },
  { text: "Chosen", x: 370, y: 235, rotate: 4, color: "var(--color-tulip-stems)", size: 24 },
  { text: "Redeemed", x: 150, y: 305, rotate: -6, color: "var(--color-eucalyptus)", size: 24 },
  { text: "Beloved", x: 340, y: 350, rotate: 5, color: "var(--color-charcoal)", size: 26 },
  { text: "Purpose", x: 100, y: 425, rotate: -3, color: "var(--color-soft-roses)", size: 24 },
];

const DOODLES: { kind: "heart" | "cross" | "star" | "swirl"; x: number; y: number; rotate: number; color: string }[] = [
  { kind: "heart", x: 235, y: 45, rotate: -10, color: "var(--color-soft-roses)" },
  { kind: "cross", x: 400, y: 130, rotate: 6, color: "var(--color-eucalyptus)" },
  { kind: "star", x: 190, y: 260, rotate: 0, color: "var(--color-lavender)" },
  { kind: "swirl", x: 300, y: 435, rotate: -8, color: "var(--color-tulip-stems)" },
];

function DoodlePath({ kind }: { kind: "heart" | "cross" | "star" | "swirl" }) {
  switch (kind) {
    case "heart":
      return <path d="M14 23c-4-3-9-7-9-12 0-3 2-5 5-5 2 0 3.5 1 4 2.5C14.5 6.5 16 5.5 18 5.5c3 0 5 2 5 5 0 5-5 9-9 12.5z" />;
    case "cross":
      return <path d="M14 3v22M4 12h20" />;
    case "star":
      return <path d="M14 3l2.4 7.2L23 12l-6.6 2.1L14 21l-2.4-6.9L5 12l6.6-1.8z" />;
    case "swirl":
      return <path d="M6 16c0-6 5-10 10-8s6 8 2 10-9-1-8-6 6-7 9-4" />;
  }
}

/**
 * One consistent, seamlessly-tiling scribble pattern reused identically on
 * every page (Design doc Section 4). An inline SVG <pattern> — not a CSS
 * background-image — so the <text> elements can use the page's already
 * loaded Caveat font via font-family: var(--font-caveat); an external/data-URI
 * SVG wouldn't inherit that. Tiling keeps phrase density constant no matter
 * how tall a page is, which a single fixed/viewport-sized layer can't do.
 */
export function ScribbleBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.22]"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="scribble-pattern"
          width={TILE_SIZE}
          height={TILE_SIZE}
          patternUnits="userSpaceOnUse"
        >
          {PHRASES.map((p, i) => (
            <text
              key={`phrase-${i}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              transform={`rotate(${p.rotate} ${p.x} ${p.y})`}
              className="font-script"
              fill={p.color}
              fontSize={p.size}
            >
              {p.text}
            </text>
          ))}
          {DOODLES.map((d, i) => (
            <g
              key={`doodle-${i}`}
              transform={`translate(${d.x - 14} ${d.y - 14}) rotate(${d.rotate} 14 14)`}
              fill="none"
              stroke={d.color}
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <DoodlePath kind={d.kind} />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#scribble-pattern)" />
    </svg>
  );
}

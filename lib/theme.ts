/**
 * Per-page accent assignment — PRD Section 8.2 / Design doc Section 2.
 * Wishlist and Letters of Love are locked directly in the docs. Home/About,
 * Impact, Transparency, and Give were left as "finalize during build" in the
 * Design doc and were confirmed with the project owner during Phase 0/1 planning:
 * Home/About -> Eucalyptus, Impact -> Lavender, Transparency -> Eucalyptus (reused),
 * Give -> Pink Tulips (PRD 2 maps the "Giving" theme itself to Pink Tulips).
 */
export const PAGE_ACCENTS = {
  home: "eucalyptus",
  wishlist: "tulip-stems",
  lettersOfLove: "soft-roses",
  impact: "lavender",
  transparency: "eucalyptus",
  give: "pink-tulips",
} as const;

export type AccentKey = (typeof PAGE_ACCENTS)[keyof typeof PAGE_ACCENTS];

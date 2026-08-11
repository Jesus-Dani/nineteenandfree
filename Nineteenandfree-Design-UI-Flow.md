# Nineteenandfree — Design System & UI Flow Specification

**Version:** 1.1 — Locked, reconciled against reference mockup
**Purpose:** A standalone, exact reference for visual design and user flow — everything a designer or developer needs without cross-referencing the PRD/TRD.

**Reference mockup note:** A visual reference mockup (see `Nineteenandfree-Reference-Mockup.png`, included alongside this document) was reviewed and partially adopted. Confirmed changes from that review: (1) the logo now includes a small hand-drawn heart icon beside the wordmark, updating the earlier text-only decision; (2) the hero image will use Daniella's own photograph rather than a stock/generated image; (3) background scribble text must use the exact approved phrase list in Section 4, not placeholder text. Explicitly NOT adopted from that mockup: gold coloring on the Wishlist page (green/Tulip Stems stands), flat/line icon style (hand-drawn/doodle stands), and a "monthly gift" recurring donation toggle (out of scope — one-time campaign only).

---

## 1. TYPOGRAPHY

**Primary typeface (body text, most headlines):** Shantell Sans
- A handwritten-style Google Font, chosen specifically because it stays legible at body-text size while still reading as "softly handwritten"
- Use for: all body copy, form labels, navigation, most headlines, button text

**Accent typeface (script, limited use only):** Caveat
- A casual, loose handwriting font — closer to an actual scribbled note
- Use ONLY for: the "19" numeral treatment, Scripture pull-quotes, the "You Are Loved" keepsake phrase, and the background scribble texture (Section 4)
- NEVER use for: body copy, form fields, navigation, or anything requiring sustained reading

Both are free, actively maintained Google Fonts with full weight ranges — load via standard Google Fonts embedding.

---

## 2. COLOR PALETTE — EXACT HEX CODES

| Name | Hex | Role |
|---|---|---|
| Soft Roses | `#FAC1B5` | Theme accent — Identity (Letters of Love) |
| Eucalyptus | `#98B8B9` | Theme accent — Redemption |
| Tulip Stems | `#C6C870` | Theme accent — Purpose (Wishlist) |
| Lavender | `#C59FBE` | Theme accent — Hope |
| Pink Tulips | `#F283AE` | Universal CTA color — every "Give Now" / primary action button, site-wide, unchanging |
| Base cream | `#FBF3E9` | Page background — constant on every page |
| Charcoal | `#3F3A34` | All body text — constant on every page |

**Reserved/unused:** the original "Flower Box" (`#EDD9BE`) tan was tested for the Hope theme and dropped — it failed a contrast check against the cream base. Lavender replaced it. Do not reintroduce Flower Box.

### Application rule — apply identically on every page, no exceptions:
1. **Fills / badges** → theme accent color as background, Charcoal (`#3F3A34`) text on top
2. **Borders / icons / underlines** → theme accent color at full value
3. **Primary CTA buttons ("Give Now," "Submit," "Confirm")** → always Pink Tulips (`#F283AE`), regardless of which page/theme you're on
4. **Body text** → always Charcoal. Never render text in any pastel accent color — none of the pastels hold sufficient contrast against the cream base to be used as text color

### Per-page theme accent assignment:
- Letters of Love → Soft Roses
- Wishlist → Tulip Stems (confirmed — a reference mockup showed gold/tan here, but the locked green assignment stands)
- (Assign Eucalyptus and Lavender to remaining pages — e.g. About/Redemption content → Eucalyptus; Impact or Transparency → Lavender — finalize per-page mapping during build if not already assigned elsewhere)

---

## 3. SHAPE, DEPTH & ICONOGRAPHY

- **Corner radius:** soft rounded corners on all cards and buttons. Not sharp/square, not fully pill-shaped — a gentle, friendly rounding.
- **Shadows:** soft, subtle shadow on cards and elevated elements — a gentle lift, not flat/paperlike, not heavy/dramatic.
- **Icons:** hand-drawn/doodle style throughout, matching the scribble background aesthetic. Do not use a generic geometric line-icon set (e.g. Feather, Material Icons) as-is.

---

## 4. BACKGROUND TEXTURE — EXACT SPECIFICATION

- **Placement:** identical across every page (Home, About, Wishlist, Letters of Love, Impact, Transparency, Give flow) — same asset reused everywhere, never reshuffled or page-specific
- **Opacity:** 8–15%
- **Typeface:** Caveat, rendered as if hand-scribbled
- **"Hand" consistency:** must read as ONE consistent handwriting style throughout — not mixed styles
- **Line weight:** thin, delicate — not bold or marker-like
- **Color:** muted tones pulled from the palette (Section 2) — never high-contrast or saturated
- **Content — scatter irregularly, mixing phrases and small doodles, not gridded/repeating:**
  - "Happy 19th Birthday"
  - "Free from condemnation"
  - "Jesus loves you"
  - "No condemnation"
  - "Romans 8:1"
  - "You are loved"
  - "Redeemed"
  - "Grace"
  - "Purpose"
  - "Hope"
  - "Chosen"
  - "You are seen"
  - "New every morning"
  - "Beloved"
  - Small doodle elements: hearts, tiny crosses, stars, swirls

---

## 5. PHOTOGRAPHY TREATMENT

Every photo on the site uses the same frame component:
- Rounded corners matching the card corner radius (Section 3)
- A thin border, ~3–4px, in the current page's theme accent color (Section 2)
- The same soft shadow used on cards

---

## 6. MOTION

- Gentle fade/slide-in as content enters on scroll
- No bounce, no wobble, no attention-grabbing animation
- Applied consistently as one reusable scroll-trigger pattern, not custom per section

---

## 7. NAVIGATION (MOBILE)

- Simple hamburger menu icon — hand-drawn style, three simple lines (not a sterile geometric icon)
- Opens as a slide-in panel from the side
- Panel background: cream (`#FBF3E9`, same as page base)
- Nav item text: Shantell Sans

---

## 8. LAYOUT INSPIRATION (REFERENCE POINT)

Structural inspiration from modern nonprofit sites like charity: water — large real photography, generous white space, bold/simple presentation of numbers — but **softened** to this site's pastel palette. Do NOT replicate charity: water's actual bold/high-contrast look; only borrow the structural clarity and confidence.

---

## 9. LOGO

- Text wordmark: **"nineteenandfree"** set in Shantell Sans, paired with a small heart icon beside the text (updated decision — original direction was text-only with no icon; a reference mockup introduced the heart and it was adopted)
- Heart icon should follow the same hand-drawn/doodle style as the rest of the site's iconography (Section 3), not a flat/solid heart glyph

---

## 10. SITE MAP / PAGE STRUCTURE

1. **Home → About the Outreach** — single continuous scroll (no click required to move from the emotional intro into "why" content)
2. **The Wishlist** — separate page (Bibles / Children's Books / Teen-YA Books / Educational Materials / Overall Outreach, plus any further admin-added categories)
3. **Letters of Love** — separate page
4. **Impact / Updates** — separate page (populated post-event)
5. **Transparency** ("Where Your Giving Goes") — separate page
6. **Give flow** — triggered via CTA buttons throughout the site, not a standalone nav item
7. **Admin** — private, password-protected, not in public navigation

**Rationale:** the emotional narrative works best as one continuous scroll; functional pages that grow over time (Wishlist, Letters of Love) or need focus (Give flow) stay separate so they don't create unmanageable scroll length and remain individually shareable.

---

## 11. UI FLOW — GIVE FLOW (step by step)

1. Visitor lands on Home, reads the mission (Home→About scroll)
2. Taps a "Give Now" CTA (Pink Tulips button) — from Home, or from a specific Wishlist item
3. **Choice screen:** a specific Wishlist item OR the General Outreach Fund
4. **Amount screen:**
   - If a specific item: option to fund the full remaining unit cost, or enter a custom partial amount
   - If General Fund: suggested amount buttons — ₦2,000 / ₦5,000 / ₦10,000 / ₦20,000 — plus a custom "enter amount" field
5. **Payment:** redirect to Paystack checkout (email captured here automatically, required by Paystack)
6. **Post-payment, in sequence:**
   a. On-screen "thank you" confirmation appears immediately
   b. Optional: prompt to write a Letter of Love (clear upfront note: *"Your message may be printed in a physical keepsake for the children and library"*)
   c. Optional (only if user indicates RUN student status): bracelet interest step
   d. Email receipt sent separately to the address captured at checkout
7. Visitor can leave at any point after step 6a — nothing after that is required

**No minimum donation amount. No refunds — stated clearly near the payment step. No recurring/monthly giving option — this is a one-time campaign only; the Give flow does not include a "make this a monthly gift" toggle or any subscription/recurring payment handling.**

---

## 12. UI FLOW — BRACELET STEP (exact fields, in order)

Shown only after payment, only if relevant; always shows the note: *"This option is only available for students at Redeemers University."*

1. **Interested?** — Yes / No (binary choice)
2. **If No:** flow ends immediately, no further fields
3. **If Yes, show in order:**
   - Name
   - Phone number
   - WhatsApp number (if different from phone)
   - Size — Small / Medium / Large
   - Gender — Male / Female
4. No delivery address, no email — bracelets are handed out in person on campus

---

## 13. UI FLOW — LETTERS OF LOVE (standalone submission, independent of giving)

1. Accessible directly from its own nav page, not gated behind the Give flow
2. **Form fields:**
   - Name (optional)
   - Message (required)
   - Anonymous toggle (Yes/No)
3. **Upfront notice shown before/at submission** (not a checkbox, just stated plainly): *"Your message may be displayed on this page and printed in a physical keepsake for the children and library."*
4. On submit: automatic profanity/appropriateness filter runs first
5. Admin performs final manual review/approval afterward
6. Once approved: appears publicly on the Letters of Love page AND is included in the physical keepsake — one commitment, not two separate opt-ins
7. **On-screen "thank you" confirmation** appears immediately upon submission (regardless of approval status) — no email sent (none collected in this flow)
8. **Rate limit:** max 1 submission per device per hour, tracked by IP address — no CAPTCHA

---

## 14. CONFIRMATION BEHAVIOR SUMMARY

| Scenario | On-screen confirmation | Email |
|---|---|---|
| Successful payment | Yes | Yes — sent to email captured via Paystack checkout |
| Letters of Love submitted, no payment | Yes | No — no email was collected |

---

## 15. ADMIN-SIDE UI NOTES

- Login: simple password only, no email/magic-link
- Wishlist items: add/edit/archive/remove directly, no code changes required
- Contributions table includes a **"Download as CSV"** button (opens in Excel/Sheets) as a manual data backup safety net
- Letters of Love moderation queue: shows filtered (auto-flagged) and unflagged submissions for manual approval

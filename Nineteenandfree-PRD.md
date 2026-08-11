# Nineteenandfree — Product Requirements Document (PRD)

**Site name:** Nineteenandfree
**Version:** 1.0 — Locked Scope
**Status:** All decisions below were confirmed in chat prior to document creation, per project instruction.

---

## 1. Product Summary

Nineteenandfree is a purpose-built Christian birthday outreach platform for Daniella's 19th birthday evangelistic outreach. It enables visitors to support specific books, Bibles, and educational resources, or contribute to the overall outreach fund — while participating through prayer, encouragement, and (for Redeemers University students) an optional commemorative bracelet — with transparent, admin-managed fundraising and post-outreach impact reporting.

This is a single-purpose campaign site, not a general charity platform, gift registry, ongoing organization, or e-commerce store. The Give flow shuts down once the outreach concludes.

## 2. Purpose & Central Message

**Anchor Scripture:** Romans 8:1 — "There is therefore now no condemnation for those who are in Christ Jesus."

**Core message:** Our past, mistakes, circumstances, shame and guilt do not have final authority to define us. In Christ, there is redemption and no condemnation. This is a celebration of God's grace, not simply a birthday fundraiser.

**Core themes (each mapped to a visual accent color — see Section 8):**
- Identity — who God says we are — *Soft Roses (pink)*
- Redemption — our past does not have the final word — *Eucalyptus (blue-teal)*
- Hope — our circumstances do not determine our future — *Lavender*
- Purpose — every child has dreams, gifts and potential — *Tulip Stems (green)*
- Giving — celebrating life by giving to others — expressed through the universal action color, Pink Tulips, used consistently on every "Give Now" / primary CTA site-wide

The "19" ties to Daniella's personal story (her name meaning "God is my Judge") and is framed as personal symbolism, not established doctrine. The theological foundation rests on Scripture, especially Romans 8:1.

## 3. What the Product Is NOT

- A general charity website or permanent fundraising organization
- A personal birthday gift registry or unrestricted personal donation platform
- A social-media-style community
- A complex e-commerce store
- An indefinitely-running platform — the Give flow closes after the outreach event

## 4. User Personas

| Persona | Motivation | Primary Action |
|---|---|---|
| Close friend/family | Personal support for Daniella | Give + write a Letter of Love |
| Church community member | Ministry/mission alignment | Give to a specific wishlist item |
| Casual supporter (social share) | Saw a post, wants to help | Small general fund contribution |
| Redeemers University student | Personal support + campus connection | Give + opt into commemorative bracelet |
| Daniella / organizer | Runs the campaign | Admin dashboard |

## 5. Feature Requirements

### 5.1 The Wishlist
- Categories: Bibles, Children's Books, Teen/Young Adult Books, Educational Materials, Overall Outreach — with room for further category types (e.g. General Knowledge, Christian Fiction) as the admin adds them
- Each item: name, description, category, full unit cost, quantity funded (live, derived), progress display, contribution CTA
- **Unit-based, rolling funding model:** items are not capped at a single fixed goal. As donations accumulate, the system continuously recalculates how many full units the total can purchase. Any amount beyond a whole unit shows as live progress toward the *next* unit (e.g. "3 copies funded — 4th copy: ₦500 / ₦6,500"), rather than stopping at a fixed target or requiring manual admin resets.
- Contribution modes: fund a full unit, or contribute a custom partial amount
- **Fully admin-managed catalogue** — items are added, edited, archived, or removed by the admin directly through the admin dashboard, with no code changes or developer involvement required. This was a deliberate requirement so the real book/Bible catalogue (sourced from actual procurement research, e.g. Jumia pricing) can be entered progressively rather than hard-coded pre-launch.

### 5.2 General Outreach Fund
- Covers non-item costs: food, drinks, cake, transportation, activities, printing, event materials, logistics, packaging, other approved outreach expenses
- **Suggested amount buttons:** ₦2,000 / ₦5,000 / ₦10,000 / ₦20,000, plus a custom "enter amount" field
- No minimum donation amount anywhere on the site

### 5.3 Fund Allocation Rule
- Designated donations (to a specific wishlist item) are tracked and reported only against that item/category
- General Outreach Fund donations are tracked against the overall approved outreach budget
- This distinction is enforced at the data layer (not just in copy) and is summarized publicly in the Transparency section

### 5.4 Progress Tracking
- Live per-item, per-category, and site-wide progress displays
- All figures computed from real contribution data — never manually typed or hard-coded

### 5.5 Letters of Love (formerly "Prayer Wall")
- Public page displaying approved prayers and encouragement messages for the children
- **Can be submitted with or without a financial contribution** — participation is not gated behind giving
- Submission fields: Name (optional), Message (required), Anonymous toggle
- **No separate "include in keepsake" consent.** Every submitted message is, by default, understood to be included in the physical keepsake (banner and/or book) as well as displayed on the digital Letters of Love page. This is communicated to the person upfront at submission — it is one commitment covering both outputs, not two separate decisions.
- Anonymity (if selected) applies consistently across both the digital page and the physical keepsake — no name printed either way
- Admin moderation queue exists for appropriateness (spam/inappropriate content), not for keepsake permission, since permission is assumed at submission

### 5.6 Physical Keepsake
- Every approved Letters of Love submission is printed in a physical keepsake for the library/children — a banner ("You Are Loved") and/or a keepsake book
- This is a downstream, later-stage output built from the same message data — not a feature the live website itself needs to produce, beyond storing and exporting the message data cleanly

### 5.7 Bracelet System
- **Available only to Redeemers University (RUN) students.** A visible note on the bracelet step states: *"This option is only available for students at Redeemers University."*
- The flow is a simple two-step choice:
  1. **Interested / Not interested**
  2. If **Interested**, the person provides: **Name**, **Phone number**, **WhatsApp number (if different)**, **Size** (Small / Medium / Large), **Gender** (Male / Female)
  3. If **Not interested**, no further fields — done
- **No delivery address or email is collected.** Bracelets are handed out in person on campus, so only contact details needed to reach the person directly (phone/WhatsApp) are required — no shipping logistics.
- The bracelet step is visually and structurally subordinate — never the primary CTA. Hierarchy across the whole site: (1) Support the mission → (2) Choose what to support → (3) Write a Letter of Love → (4) Optional bracelet (RUN students only)

### 5.8 Give Flow
1. Visitor arrives, understands the mission
2. Clicks Give Now
3. Chooses: a specific wishlist item, or the General Outreach Fund
4. Chooses: full unit amount, a suggested amount, or a custom amount
5. Pays via Paystack — **email address is captured at this step as part of Paystack's own checkout requirement** (Paystack requires an email to process any transaction), not as a separate field the site adds
6. Optionally writes a Letter of Love (with upfront understanding it will be printed in the physical keepsake)
7. If eligible (RUN student), optionally requests a bracelet, or opts out
8. Receives a **lightweight on-screen "thank you" confirmation**, plus an **email receipt** sent to the address captured in step 5
9. Can return anytime to see live progress, and later, impact

**The Give flow is closed once the outreach event concludes** — the site does not remain open for indefinite ongoing giving.

### 5.8a Confirmation Behavior (applies across both giving and non-giving participation)
- **After a successful payment:** on-screen "thank you" confirmation + email receipt (sent to the email captured via Paystack checkout)
- **After a Letter of Love submission with no accompanying payment:** on-screen "thank you" confirmation only — no email, since none was collected in this path (Letters of Love can be submitted independent of giving, per Section 5.5)

### 5.9 Impact & Updates (post-event)
- "What We Gave" — real tallies (Bibles, books, meals, packs, etc.) sourced from actual procurement, not estimates
- "What Happened" — short narrative + photos
- **Photo consent is collected verbally at the event** (not via a formal written consent process)
- Final Impact Report, tied back to Transparency section figures

### 5.10 Transparency Section
- Plain-language explanation of Designated vs. General giving
- Links to/embeds the Final Impact Report once available post-event

### 5.11 Admin Dashboard (private, single-user)
- **Login: simple password only** (no email-based or magic-link auth needed — single admin, low complexity acceptable)
- **Contributions view:** contributor, amount, date, category, item, payment status, bracelet requested, delivery info
- **Wishlist management:** add/edit/archive/remove items; category, price, unit; live raised/remaining figures
- **Messages (Letters of Love) view:** name (or anonymous), message text, approval status
- **Outreach Fund ledger:** total raised, total spent, remaining balance

## 6. Site Map

1. Home → About the Outreach (single continuous narrative scroll — no click required to move from Home into the "why" of the outreach)
2. The Wishlist (Bibles / Children's Books / Teen/YA Books / Educational Materials / Overall Outreach, and any further admin-added categories)
3. Letters of Love
4. Impact / Updates (populated post-event)
5. Transparency ("Where Your Giving Goes")
6. Give flow (triggered from CTAs throughout, not a standalone nav destination)
7. Admin (private, password-protected, not in public navigation)

**Structural rationale:** the emotional narrative (Home/About) works as one continuous scroll, but functional pages that will grow over time (Wishlist, Letters of Love) or need to stay focused (Give flow) are kept as separate pages rather than folded into a single long page — this avoids unmanageable scroll length as content accumulates and keeps each page shareable individually.

## 7. Content Dependency

The real wishlist catalogue is sourced from actual procurement research (e.g. real Jumia pricing), not invented figures. Because the wishlist is fully admin-managed, this catalogue can be populated progressively after launch rather than blocking the build — the admin simply adds real items as pricing and titles are confirmed.

## 8. Visual Direction (Locked Design System)

### 8.1 Typography
- **Shantell Sans** — primary typeface for body text and most headlines. A real, purpose-built handwritten-style Google Font that stays legible at body-text sizes, chosen specifically to satisfy "softly handwritten and clear" without sacrificing readability.
- **Caveat** — accent script typeface, used sparingly for: the "19" numeral treatment, Scripture pull-quotes, the "You Are Loved" keepsake phrase, and the site-wide background scribble text (see 8.4). Never used for body copy or anything requiring sustained reading.

### 8.2 Color Palette

Sourced from a real floral reference palette, mapped intentionally to the core themes:

| Theme | Color name | Hex | Usage |
|---|---|---|---|
| Identity | Soft Roses | `#FAC1B5` | Page accent (Letters of Love) |
| Redemption | Eucalyptus | `#98B8B9` | Page accent |
| Purpose | Tulip Stems | `#C6C870` | Page accent (Wishlist) |
| Hope | Lavender | `#C59FBE` | Page accent |
| Giving (universal action) | Pink Tulips | `#F283AE` | Every primary CTA / "Give Now" button, site-wide, unchanging regardless of page theme |
| Base background | Warm cream | `#FBF3E9` | Constant across every page |
| Body text | Soft charcoal | `#3F3A34` | Constant across every page — never pastel-colored text |

**Consistent application rule (no exceptions, applied identically on every page):**
- Fills/badges → theme accent color + dark charcoal text on top
- Borders/icons/underlines → theme accent color at full value
- Primary CTA buttons → Pink Tulips, always, regardless of the page's theme accent

*(Note: an earlier palette direction using a "Flower Box" cream/tan accent for Hope was tested and dropped — it failed a contrast check against the cream base and was replaced with Lavender, which passes cleanly. This resolved the palette to one consistent rule with no special-cased exceptions.)*

### 8.3 Shape, Depth & Iconography
- **Corners:** soft rounded corners on all cards and buttons (not sharp, not fully pill-shaped)
- **Depth:** soft, subtle shadows — a gentle lift, not flat/paperlike and not heavy
- **Icons:** hand-drawn/doodle style throughout, matching the scribble background aesthetic — no generic line-icon sets

### 8.4 Background Texture
- A single, consistent, low-opacity (roughly 8–15%) background applied identically across every page (not reshuffled per page) — this was a deliberate choice to preserve a sense of one continuous space as a visitor moves between pages
- Content: an irregular scatter of short affirming phrases rendered in Caveat, including but not restricted to "Happy 19th Birthday," "Free from condemnation," "Jesus loves you," "No condemnation," "Romans 8:1," "You are loved," "Redeemed," "Grace," "Purpose," "Hope," "Chosen," "You are seen," "New every morning," "Beloved" — mixed with small hand-drawn doodle elements (hearts, tiny crosses, stars, swirls)
- **One consistent "hand":** the entire scribble background reads as though written by a single person — not mixed handwriting styles — using thin, delicate line weight throughout
- Rendered in muted tones from the palette, never in high-contrast/bold colors

### 8.5 Motion
- Gentle fade/slide-in animation as content enters on scroll — nothing bouncy, nothing attention-grabbing

### 8.6 Photography Treatment
- Consistent frame treatment on every photo: soft rounded corners (matching cards), a thin (~3–4px) border in that page's theme accent color, and the same soft shadow used elsewhere — ties photography into the same visual family as the rest of the site rather than letting it sit apart

### 8.7 Navigation (Mobile)
- Simple hamburger menu — hand-drawn-style icon (three simple lines, not a sterile geometric mark)
- Opens as a slide-in panel from the side, cream background matching the site base, nav items set in Shantell Sans

### 8.8 Layout Inspiration
- The clarity and confidence of modern nonprofit sites (e.g. charity: water's use of large real photography, generous white space, and bold simple numbers) — softened to match this site's pastel palette rather than charity: water's own bold/high-contrast look

### 8.9 Logo
- Simple text wordmark reading "nineteenandfree," styled in Shantell Sans — no icon or symbol mark

## 9. Legal & Policy Requirements

### 9.1 Privacy Policy (required — Nigeria Data Protection Act applies)
The site collects personal data (names, phone/WhatsApp numbers, payment-related email) from Nigerian individuals, which brings it under the NDPA regardless of the campaign's small scale. A plain-language Privacy Policy page is required at launch, covering: what's collected, why, who it's shared with (Paystack, Supabase), retention, and data subject rights. Full locked text:

> **Privacy Policy — Nineteenandfree**
>
> *This site is run by Anokwu Chiaza Daniella for the Nineteenandfree birthday outreach. We collect only what we need to run this campaign, and we don't sell or share your information beyond what's described here.*
>
> **What we collect:** If you give — your email (via Paystack) and payment details, handled directly by Paystack; we never see or store card details ourselves. If you write a Letter of Love — your name (optional, can be anonymous) and your message. If you request a bracelet (RUN students only) — name, phone number, WhatsApp number, size, gender.
>
> **Why we collect it:** To process donations and send confirmations; to display approved messages on Letters of Love and print them in the physical keepsake; to contact bracelet recipients directly for campus pickup.
>
> **Who we share it with:** Paystack (payment processing) and Supabase (our database provider). We do not sell data or share it with advertisers.
>
> **How long we keep it:** Contribution and message records are kept for the duration of the outreach and its reporting period, then archived or deleted once the campaign concludes.
>
> **Your rights:** You can ask to see, correct, or delete your information by contacting anokwudaniella@gmail.com or 09133999279. Anonymous submissions cannot be individually identified or removed after the fact.

### 9.2 Terms of Use (required)
Full locked text:

> **Terms of Use — Nineteenandfree**
>
> *By using this site or making a contribution, you agree to the following:*
>
> **About this campaign:** Nineteenandfree is a one-time birthday outreach campaign, not a registered charity or ongoing organization. It closes once the outreach event and its reporting are complete.
>
> **Giving:** All gifts are final — no refunds, including for changed minds, duplicate payments, or mistaken amounts (contact us for genuine payment errors, though resolution isn't guaranteed). Designated gifts are used only for their specified item; General Outreach Fund gifts support approved overall costs. A Transparency report shows fund usage. Payments are processed via Paystack — we never see or store card details.
>
> **Letters of Love:** Anything submitted may be displayed publicly and printed in a physical keepsake — this is understood at submission, not a separate request. Anonymous submissions omit the name in both digital and print. Submissions are reviewed (automatic + manual check) before publishing; inappropriate, spam, or unrelated content may be declined. Limit: one message per hour.
>
> **Bracelets:** Available only to Redeemers University students, as a thank-you gesture (not a purchase) — not guaranteed and not tied to any gift amount. Distributed in person on campus.
>
> **Use of the site:** Don't attempt to disrupt, spam, or misuse the site or its features. Terms/site may be updated as needed during the campaign.
>
> **Contact:** anokwudaniella@gmail.com · 09133999279

### 9.3 Refund Policy
No refunds — all gifts are final. Stated clearly near the payment step, not just buried in Terms.

### 9.4 Content Moderation
Two-layer approach for Letters of Love submissions: (1) automatic profanity/inappropriate-content filter runs first, (2) the admin performs a final manual review and approval before anything is published on the site or included in the physical keepsake. Nothing bypasses manual review before print.

### 9.5 Photo Consent
Verbal consent collected at the event for any photos used in Impact/Updates — no formal written consent process required for this campaign's scale.

## 10. Analytics & Sharing

- **Analytics:** Vercel Analytics — built into the existing hosting platform, no extra account/script, cookie-free (avoids needing a separate cookie-consent banner)
- **Social sharing:** each page has its own Open Graph preview (image, title, description) rather than one shared across the whole site — so Home, Wishlist, and Letters of Love each look distinct and intentional when shared on WhatsApp/Instagram/Facebook, reusing that page's accent color identity

## 11. Success Criteria for Launch

- A visitor understands the mission within roughly 10 seconds on Home
- A visitor can give to a specific item or the General Outreach Fund in under 3 steps
- Every contribution is correctly tagged (designated vs. general) with zero manual reconciliation
- A Letter of Love can be submitted (with or without giving) and, once moderated for appropriateness, appears on the Letters of Love page
- The admin can see all contributions, wishlist status, and fund totals in one dashboard, and add/edit wishlist items without developer involvement
- The bracelet option correctly restricts itself to Redeemers University students, with a visible note and a working opt-out for everyone

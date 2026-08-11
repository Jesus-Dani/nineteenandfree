# Nineteenandfree — Technical Requirements Document (TRD)

**Version:** 1.3 — Locked Scope, updated with repository/environment status and a full continuity audit against the full conversation
**Status:** All decisions below were confirmed in chat prior to document creation, per project instruction.
**Companion document:** Nineteenandfree-PRD.md (product requirements)
**Repository:** https://github.com/Jesus-Dani/nineteenandfree.git
**Environment variables:** Already added to the Vercel project (see Section 1a for the full confirmed list and current status) — Vercel setup is not a pending step, code can be pushed and deployed against these immediately.

---

## 1a. Repository & Environment Status (current, as of this update)

- **GitHub repository:** `https://github.com/Jesus-Dani/nineteenandfree.git` — this is the target repo for all code. Connect this repo to the Vercel project (Vercel → Import Project → this GitHub URL) if not already connected, so every push triggers an automatic deployment.
- **Environment variables — already set in Vercel**, confirmed:

| Variable name | Purpose | Exposure |
|---|---|---|
| `PAYSTACK_SECRET_KEY` | Server-side Paystack API calls (initialize/verify transactions) and webhook signature verification (see note below) | Server-only |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Client-side Paystack checkout initialization | Public/browser-safe |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nhhsmbyekdqlbvahobke.supabase.co` | Public/browser-safe |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase client-side data access (current Supabase-recommended naming, supersedes the older `ANON_KEY` naming) | Public/browser-safe |
| `SUPABASE_SECRET_KEY` | Full database access for server-side operations (current Supabase-recommended naming, supersedes the older `SUPABASE_SERVICE_ROLE_KEY` naming) | Server-only, never exposed to client code |
| `ADMIN_PASSWORD` | Single-admin dashboard login | Server-only |

**Correction — no separate webhook secret exists for Paystack.** Unlike some providers, Paystack does not issue a distinct webhook-signing secret. Instead, every webhook Paystack sends includes an `x-paystack-signature` header, which is an HMAC SHA512 hash of the raw request body, signed using the same `PAYSTACK_SECRET_KEY` already listed above. Webhook verification must compute this hash server-side over the **exact raw request body bytes** (not a re-serialized/re-parsed version) and compare it to the header — a common implementation mistake is hashing a reformatted body, which breaks the signature match even for legitimate requests.

**Not yet set (blocked on deployment, not on account setup):**
- Paystack **Callback URL** and **Webhook URL**, set in the Paystack Dashboard under Settings → API Keys & Webhooks — both require a real, publicly reachable HTTPS URL, which doesn't exist until the first Vercel deployment goes live. Once deployed: Callback URL → the confirmation page (e.g. `/give/confirmation`), Webhook URL → a backend API route (e.g. `/api/paystack-webhook`). Set separately for Test Mode and Live Mode.
- Paystack account is currently under compliance review (documents submitted, business activation clicked) — Test Mode API keys work regardless of review status and are safe to build/deploy against now; Live Mode keys only become available once approved.

**Outstanding manual action — not yet confirmed done:**
- In the Paystack Dashboard, under **Settings → Preferences**, the **"Email receipts to customers"** toggle must be switched on. This is what makes Paystack automatically send the donor's confirmation email after a successful payment (the email receipt half of the confirmation behavior in Section 4) — without this toggle enabled, no receipt is sent regardless of how correctly the payment flow itself is built.

**Paystack account profile, for reference/continuity:**
- Trading name: Nineteen and Free
- Industry: Leisure & Entertainment
- Category: Events
- Business size: 1–5 people
- Annual projected sales volume: ₦500,000 (worth revisiting/raising if actual campaign totals look likely to exceed this)
- Account activation was submitted; compliance review in progress as of this document's last update

---

## 1b. Phased Build & Push Sequence

Code should be pushed to the repository in phases that mirror the build roadmap in Section 7, rather than as one large initial push — this keeps each deployment testable on its own and matches the phase boundaries already defined:

1. **Phase 0/1 push:** project scaffold, base theme (scribble background, typography, per-page accent tokens), Home→About scroll, static page shells for all routes. This first deployment is also what unlocks setting the Paystack Callback/Webhook URLs (Section 1a), since it produces the first real public URL.
2. **Phase 2 push:** Wishlist wired to live Supabase data, Give flow, Paystack integration (test mode), webhook handler, confirmation behavior.
3. **Phase 3 push:** Letters of Love (standalone submission + rate limiting + moderation), bracelet flow.
4. **Phase 4 push:** Admin dashboard (contributions table, wishlist management, moderation queue, CSV export, fund ledger).
5. **Phase 5 push:** QA/testing pass, automated payment-flow tests, soft launch.
6. **Phase 6:** no new code push required to *start* this phase — it's operational (disable Give flow, populate Impact content, publish Transparency report) — though populating Impact/Updates content will involve small content-only pushes.

Each phase's push should result in a working, deployable state on Vercel — not a partial/broken intermediate state — so that Vercel's preview deployments remain useful for review before merging to production.

**Local webhook testing (relevant during Phase 2):** Paystack cannot deliver webhooks to `localhost`. During local development, either (a) use a tunneling tool like ngrok or Cloudflare Tunnel to expose the local dev server temporarily and point the Paystack Test Mode webhook URL at the tunnel address, or (b) skip webhooks locally and rely on manually calling Paystack's Verify Transaction endpoint to simulate the same result. Either approach is acceptable; the tunnel method more closely mirrors real production behavior.

---

## 2. Confirmed Technical Stack

| Layer | Decision | Rationale (as discussed) |
|---|---|---|
| Frontend hosting | **Vercel** | Confirmed directly by the project owner |
| Database | **Supabase** (PostgreSQL) | Relational data model fits contributions↔items↔messages naturally; strong Next.js/Vercel pairing; predictable flat pricing; built-in table editor usable by a non-technical single admin. Chosen over Firebase (NoSQL, less natural fit for relational reporting) and JSONBin (rejected — flat JSON storage risks silently overwriting concurrent donations due to lack of atomic updates; no querying; not suitable as a system of record for real money) |
| Payment provider | **Paystack** | Chosen over Flutterwave (marginal fee difference not decisive for a local-only donor base) and Interswitch (more enterprise-oriented, documentation-heavy onboarding, better suited to large institutions than a lean single-admin campaign site). Local Nigerian donor base confirmed — no need for Flutterwave's broader international reach |
| Admin authentication | **Simple password login** | Single admin user (Daniella); email/magic-link auth deemed unnecessary complexity for this scale |
| Frontend framework | Next.js (React) — recommended, not yet independently re-confirmed since the stack discussion, but consistent with the Vercel + Supabase pairing | Vercel's native framework; strong Supabase integration |
| Domain | **Vercel's free subdomain** (e.g. `nineteenandfree.vercel.app`) | Deliberate choice — no custom domain purchase for a short-lived, single-event campaign |
| Analytics | **Vercel Analytics** | Built into existing hosting, no separate account/script, cookie-free (no cookie-consent banner needed) |
| Error monitoring | **Vercel's built-in logs, checked manually** | Deemed sufficient at this scale — paired with the nightly payment reconciliation job (Section 4), which catches payment-specific issues automatically without relying on manual log review |
| Data backup | **Supabase free tier — no automatic backups** | Explicitly accepted risk, not an oversight. Supabase's free tier has no automated backup/point-in-time recovery (only available from the $25/mo Pro plan up). Mitigated partially by an admin-facing CSV export feature (Section 4) as a manual snapshot option |
| Testing | **Automated tests for the payment flow specifically**; other areas tested manually | Payment is the highest-stakes path (real money, must record correctly) and gets real automated coverage; lower-stakes areas (e.g. Letters of Love form rendering) are checked manually |

## 3. Data Model

**wishlist_items**
`id, category, name, description, unit_cost, quantity_funded (derived, live), status (active/archived), created_at, updated_at`

- `quantity_funded` is not a static field — it is recalculated live from the sum of contributions tagged to this item, divided by `unit_cost`. The remainder (partial progress beyond the last whole unit) is surfaced as progress toward the *next* unit rather than being discarded, capped, or requiring an admin reset (per the locked rolling-funding rule).

**contributions**
`id, contributor_name, contributor_contact (optional), amount, currency, target_type (item | general), target_item_id (nullable), payment_status (pending/paid/failed), payment_reference, created_at`

**messages** *("Letters of Love")*
`id, contribution_id (nullable — standalone submissions allowed), display_name (nullable if anonymous), message_text, is_anonymous (bool), approval_status (pending/approved/rejected), created_at`

- **No `include_in_keepsake` field.** Per the locked product decision, every approved message is included in the physical keepsake by default — there is no separate consent flag to track. Approval status governs both digital display and keepsake inclusion identically.

**bracelet_requests**
`id, contribution_id, interested (bool), name (nullable), phone (nullable), whatsapp (nullable — only populated if different from phone), size (nullable — Small/Medium/Large), gender (nullable — Male/Female), fulfillment_status, created_at`

- `name`, `phone`, `whatsapp`, `size`, and `gender` are only populated when `interested = true`. When `interested = false`, the record can simply store the opt-out with no further fields.
- **No delivery address or email field** — bracelets are distributed in person on campus, so only direct contact fields (phone/WhatsApp) are needed, not shipping logistics.
- **RUN student status is not a captured field or verified anywhere** — the flow shows an informational note ("This option is only available for students at Redeemers University") but does not ask a yes/no eligibility question or check ID. Eligibility is effectively self-enforced: non-RUN visitors are expected to select "No bracelet, thank you" on their own. If actual verification is wanted later (e.g. a student ID field), that's a scope addition, not something currently built.

**outreach_fund_ledger**
`id, type (income/expense), amount, category, description, date`

## 4. Core Technical Requirements by Feature

| Feature | Requirement |
|---|---|
| Progress bars (wishlist) | Computed live from `contributions` summed per item/category via Supabase queries — never hand-entered. Must correctly express rolling partial progress toward the next unit, not just "funded/unfunded" |
| Wishlist CRUD | Admin can add/edit/archive/remove items via the admin dashboard with no code deploy — this is a hard requirement given the catalogue will be populated progressively post-launch |
| Payments | Paystack integration with **layered verification, not a single trust point**: (1) webhook receives `charge.success`, (2) every webhook is independently re-verified server-side against Paystack's Verify Transaction endpoint before being trusted (protects against forged/replayed webhook payloads, not just failures), (3) a **nightly reconciliation job** re-checks any contribution still sitting in "pending" status directly against Paystack, catching cases where a payment succeeded on Paystack's side but the webhook never arrived, (4) deduplication via transaction reference, so a resent webhook never double-records a contribution. **Email is required by Paystack itself to initialize any transaction**, so the donor's email is captured naturally at checkout — no separate email field needs to be built into the site's own donation form |
| Confirmation behavior | **After successful payment:** lightweight on-screen "thank you" + email receipt sent to the address captured via Paystack checkout. **After a Letters of Love submission with no payment:** on-screen "thank you" only — no email is available to send to, since none was collected in that path |
| Letters of Love submission | Must be reachable and functional **independent of the Give flow** — a visitor should be able to submit a message without making a payment. In this no-payment path, no email exists for a receipt — only the on-screen confirmation applies |
| Letters of Love rate limiting | **Max 1 submission per device per hour, tracked by IP address.** No CAPTCHA or other user-facing friction. Known tradeoff: shared networks (e.g. campus wifi, a shared home connection) could cause two genuine people to be treated as one device — accepted as a reasonable limitation for this scale |
| Letters of Love moderation | **Two-layer approach:** (1) automatic profanity/inappropriate-content filter runs first, (2) admin performs final manual approval before anything is published on the site or included in the physical keepsake. Nothing bypasses manual review before print |
| Data freshness / caching | Wishlist and progress figures are **cached briefly (~30–60 seconds)** rather than queried fresh on every page load — near-instant from a visitor's perspective, while reducing load on the free-tier Supabase database |
| Secrets management (non-negotiable build requirement) | Paystack **test keys** used in development, **live keys** only in production. Supabase's service key (full database access) is **server-side only, never exposed to client/browser code**. All keys stored as environment variables — never hard-coded into the codebase |
| Admin CSV export | Admin dashboard includes a **"Download as CSV" button** for contribution records, exportable/openable directly in Excel or Google Sheets — serves as a manual data safety net given the accepted lack of automatic Supabase backups |
| Open Graph / share previews | **Per-page**, not site-wide — Home, Wishlist, Letters of Love, etc. each have distinct preview image/title/description when shared on WhatsApp/Instagram/Facebook, reusing that page's accent color identity |
| Bracelet eligibility gating | UI and/or backend logic must restrict the bracelet request path to confirmed RUN students; all other users see the informational note and the opt-out only |
| Admin auth | Single password-protected admin session; no multi-role access needed at this scale |
| Give flow shutdown | The Give flow must be able to be disabled/closed post-event (e.g. via an admin toggle or scheduled cutoff) without needing a full redeploy or code change |
| Impact numbers | "What We Gave" tallies pulled from the same contribution/ledger data used in Transparency, so the two sections can never contradict each other |

## 5. Non-Functional Requirements

- **Data integrity:** all monetary totals derived from the database in real time — never static or hard-coded page text
- **Concurrency safety:** the database layer must correctly handle simultaneous contributions to the same item without lost updates (the specific failure mode that ruled out a flat-file/JSONBin approach) — Supabase/Postgres transactions satisfy this
- **Privacy:** bracelet contact/delivery info and any contributor contact details are admin-only and never rendered on public pages
- **Auditability:** every contribution should be traceable from payment reference through to any associated message and/or bracelet request
- **Accessibility:** legible type and sufficient contrast for all real content, independent of the low-opacity decorative scribble background (see Section 6)
- **Consent:** photo consent for the Impact/Updates section is collected verbally at the event (not a formal written/digital consent flow) — no technical consent-tracking feature is required for this

## 6. Visual/Frontend Technical Notes

- **Fonts:** Shantell Sans (primary/body) and Caveat (accent script + background scribble text) — both real, actively maintained Google Fonts with full weight ranges, loaded efficiently to avoid layout shift
- **Background texture:** a single, consistent, low-opacity (~8–15%) hand-drawn scribble background asset in Caveat, one consistent "hand"/thin line weight, reused identically across every page — implemented as one shared asset/component rather than page-specific variants, both for visual consistency and simplicity of maintenance
- **Color system:** implemented as a small, swappable accent token per page/route (Soft Roses / Eucalyptus / Tulip Stems / Lavender) layered onto a constant cream base (`#FBF3E9`) and constant text color (`#3F3A34`) — never as a full alternate page background. Pink Tulips (`#F283AE`) is hard-coded as the universal CTA color, independent of page theme, applied consistently to every primary action button
- **Shape/depth tokens:** consistent soft-rounded corner radius and soft-shadow values applied globally to cards, buttons, and photo frames — defined once as shared design tokens, not per-component one-offs
- **Photo frame component:** shared component applying rounded corners, a ~3–4px border in the current page's accent color, and the standard card shadow — reused everywhere a photo appears rather than styled ad hoc per instance
- **Iconography:** hand-drawn/doodle icon set, used consistently instead of a generic line-icon library
- **Motion:** gentle fade/slide-in on scroll — implemented as a shared, reusable scroll-trigger animation, not bespoke per section
- **Mobile navigation:** hamburger icon (hand-drawn-style, three lines) triggering a slide-in cream panel

## 7. Build Roadmap — Phases

### Phase 0 — Foundation
- Confirm final technical setup: Next.js project on Vercel, Supabase project provisioned, Paystack account set up
- Implement data model per Section 3
- Set up admin password authentication

### Phase 1 — Core Structure
- Build Home→About continuous scroll
- Build static Transparency page copy (numbers wired in Phase 2)
- Build base theme: scribble background, typography, per-page accent token system

### Phase 2 — Giving Engine
- Wishlist page wired to live Supabase data (admin can begin adding real items here)
- Contribution flow: item or General Fund selection → suggested/custom amount → Paystack → server-side verified confirmation → email receipt
- Live, rolling-unit progress bars

### Phase 3 — Participation Layer
- Letters of Love submission form (standalone, not gated behind giving)
- Admin moderation queue (appropriateness only)
- Public Letters of Love page
- Bracelet request flow with RUN-student gating and opt-out

### Phase 4 — Admin Dashboard
- Contributions table
- Wishlist management (add/edit/archive/remove)
- Letters of Love moderation view
- Outreach fund ledger view

### Phase 5 — Launch Readiness
- End-to-end QA: contribution → confirmation email → admin visibility
- Payment verification edge-case testing (failed/pending/duplicate)
- Confirm bracelet gating and "No bracelet" opt-out both function correctly
- Soft launch to a close circle before public share

### Phase 6 — Post-Outreach
- Disable/close the Give flow
- Populate Impact/Updates with real tallies and photos (verbal consent already collected at the event)
- Publish Final Impact Report in Transparency
- Export Letters of Love message data for physical keepsake (banner and/or book) production

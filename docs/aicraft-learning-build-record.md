# AICraft Learning — Build Record

> **Companion to:** [`aicraft-learning-build-spec-v1.md`](./aicraft-learning-build-spec-v1.md) (the original spec) and [`../CLAUDE.md`](../CLAUDE.md) (operational rules).
>
> **What this is:** the as-built record. If the repo were deleted tomorrow, this is what you'd need to know to rebuild — or to brief a new collaborator (human or LLM) on what's in the box.

---

## 1. Site overview

AICraft Learning (aicraftlearning.com) is an AI-education brand that teaches non-technical professionals and business owners how to build AI systems that fit their actual business. The site is a Next.js 15 marketing site with a small built-in learning platform attached: three self-serve courses behind Stripe-checkout enrolment, plus a high-touch programme (AIOS Mastery) sold by discovery call.

Four primary user journeys:

1. **Anonymous browsing** — landing, courses index, course detail pages, /aios-program, /certification, /assessment, /for-business, /about, /contact. SEO-indexed and feeds the funnel.
2. **Authenticated learning** — sign-in via Clerk, then Stripe Checkout per course, then `/learn/[course]` shell with iframe-rendered lessons, gated assessment, certificate viewer, and a public verification URL.
3. **Founder discovery-call funnel (AIOS Mastery)** — `/aios-program` is a long-form sales page; the only conversion is `/contact?subject=aios-discovery-call`. No payment path, no `/learn` route.
4. **Enterprise enquiry funnel** — `/for-business` carries a separate enterprise contact form into the same `/api/contact` endpoint with a different payload shape.

What is **not** on the site, deliberately:

- **No analytics, no cookie banner.** Deferred to post-launch — adding analytics requires a cookie banner under UK/EU rules, and we wanted launch traffic data once we'd decided which provider to use.
- **No blog, no content-marketing surface beyond course pages.** Marketing happens off-site; the site is the destination.
- **No course search beyond the filter UI on /courses.** Catalogue is small (3 courses) — Google site-search is sufficient for the rare deeper query.
- **No third-party comments, chat widget, or live-help embed.** Contact form only.

---

## 2. Tech stack — pinned versions and why

Versions taken from [`../package.json`](../package.json). Where a "do not upgrade" caveat exists, the rationale is in CLAUDE.md.

- **Next.js 15.5.x** (App Router). Pinned to 15.x; Next 16 has breaking changes around config and middleware that aren't worth absorbing for a marketing site mid-launch.
- **React 19.2.4**, **TypeScript 5 strict**.
- **Tailwind CSS v4** with `@theme` block in [`app/globals.css`](../app/globals.css). Tailwind v4 ships an "oxide" Rust native binary; on Railway's first deploy it failed to install transitively, fixed by [`nixpacks.toml`](../nixpacks.toml) forcing `npm install --include=optional`.
- **Prisma 6.19.3** (`prisma` and `@prisma/client`). Range `^6.19.3` in package.json — treat as effectively pinned to the 6.x line. Prisma 7 has a breaking schema-config change. Never run any `prisma migrate*` or `prisma db push` command — see [§5](#5-data-model).
- **@clerk/nextjs 6.39.x.** Pinned to v6. Clerk v7's middleware change broke the previous Vercel build; we are not adopting v7 on this codebase.
- **Stripe SDK** (`stripe@22.x`) configured with `apiVersion: "2026-04-22.dahlia"` in [`lib/stripe.ts`](../lib/stripe.ts).
- **Resend SDK 4.x.** **The Resend API key needs "Full access," not "Sending access"** — adding contacts to an audience for the newsletter requires more permission than just sending transactional emails. A "Sending access" key returns a 401 on `resend.contacts.create()` even though `resend.emails.send()` works fine.
- **framer-motion**, **lucide-react**, **@radix-ui/react-{accordion,dialog}**, **next-themes**.
- **Hosted on Railway** (auto-deploy from `main` of GitHub `Hafizkhuram/aicraftlearning`). Historical context: a previous attempt on Vercel hit an unresolvable Clerk v7 + Edge Function validator bug and we pivoted.
- **Database: Neon Postgres** (eu-west-2). One database is shared by local dev and production — both `.env.local` and Railway Variables point at the same `DATABASE_URL`. This is per CLAUDE.md's intentional pattern; treat all writes as production writes.

Fonts ended up self-hosted (`app/fonts/fraunces.woff2`, `app/fonts/dm-sans.woff2`) via `next/font/local` rather than `next/font/google`, to avoid `fonts.gstatic.com` TLS issues seen behind Cloudflare WARP. Behaviour is otherwise identical.

---

## 3. Architecture decisions

**Auth (Clerk).** Clerk owns identity, sessions, names, and email verification. Our `User` table holds only `clerkId` and `email` — no `firstName`/`lastName`. The pattern: when a request lands, [`getOrCreateUser`](../lib/auth.ts) reads `currentUser()` from Clerk and upserts a row keyed by `clerkId`. Display names are read from Clerk every time, never duplicated. Course access is *not* on the Clerk side — that's Enrolment rows in our DB. Route protection is enforced in `app/learn/layout.tsx` (server component calling `auth()` and redirecting) and at the top of every protected API route — never in middleware. Middleware ([`middleware.ts`](../middleware.ts)) is a bare `clerkMiddleware()` so the auth context is available app-wide.

**Payments (Stripe Checkout).** Hosted Checkout, not custom forms — fewer compliance surfaces, faster to ship, no card data ever touches our servers. The flow is: [`/api/checkout/create-session`](../app/api/checkout/create-session/route.ts) creates a Checkout Session with `client_reference_id = our user.id` and `metadata.{userId, clerkId, courseSlug}` — duplicated on purpose so we have two ways to recover identity if one is missing. Stripe redirects back to `/learn/[course]?purchase=success&session_id=…`. The [`/api/webhooks/stripe`](../app/api/webhooks/stripe/route.ts) handler verifies the signature, listens for `checkout.session.completed`, and upserts an Enrolment row keyed on `(userId, courseSlug)`. The `@@unique([userId, courseSlug])` constraint makes the upsert idempotent: a Stripe retry never creates a duplicate enrolment. There's a 1–3s gap between the redirect landing and the webhook landing; the [`PurchaseSuccessBanner`](../components/learn/PurchaseSuccessBanner.tsx) polls [`/api/enrolment/status`](../app/api/enrolment/status/route.ts) every 1.5s for up to 12s and auto-promotes from "processing…" to "enrolled" once the row appears. Recovery copy nudges to support email if it doesn't.

**Lessons (iframe + postMessage).** Each lesson is a standalone HTML file in [`public/content/{course}/lesson-N-N.html`](../public/content/) — hand-crafted layouts with embedded CSS and JS, no React. The Next.js shell ([`LessonViewer`](../components/learn/LessonViewer.tsx)) iframes the file and listens for `aicraft:lesson-complete`, `aicraft:lesson-navigate-next`, and `aicraft:assessment-*` postMessage events. Because of this, [`next.config.ts`](../next.config.ts) sets `X-Frame-Options: SAMEORIGIN` (not `DENY`). The HTML files in `public/content/` were authored standalone-first, then patched by [`scripts/patch-html-lessons.js`](../scripts/patch-html-lessons.js) to emit postMessages and intercept their own next-link clicks. The script is idempotent (marker comments), handles four file shapes (standard lesson, no-op finale lesson, module-review shape A and shape B, final assessment, certificate), and is the source of truth — re-run it after any new lesson is added. Trade-off: lessons no longer work as standalone browser-opens (the patch removes that). Future authoring follows the same pattern: write a standalone HTML file, then run the patch script.

**Certificates (server-rendered + verifiable URL).** When a learner passes the final assessment, [`issueCertificate`](../lib/certificates.ts) generates a verification ID server-side using `crypto.randomBytes(4)` — format `AICL-{COURSE}-XXXX-XXXX`, e.g. `AICL-FUND-A4F2-9C1B`. Names are captured from Clerk at issuance (or from a one-time form fallback if either firstName/lastName is missing) and frozen in the `Certificate.learnerName` column — they don't update if the user changes their Clerk profile later. The public verification page is [`/certificate/[verificationId]`](../app/certificate/[verificationId]/page.tsx), no auth required, indexable, with OG metadata so LinkedIn/Twitter previews work. The internal viewer at `/learn/[course]/certificate` iframes [`public/content/{course}/certificate.html`](../public/content/) with `?name=…&date=…&id=…` query params; the patched script reads them and renders.

**AIOS Mastery as a separate route shape.** AIOS is a high-touch programme, not a course. Differences:
- Manifest lives at [`content/aios-program.json`](../content/aios-program.json), not `content/courses/aios-mastery.json`. It loads via [`lib/aiosProgram.ts`](../lib/aiosProgram.ts), not `getCourseManifest`.
- No Stripe price ID. No `/api/checkout` path. No purchase button.
- No `/learn/aios-mastery` route. The programme isn't self-serve.
- The CTA everywhere is `/contact?subject=aios-discovery-call` — the contact form pre-fills the subject and lands in the founder's inbox.
- Not in `content/courses/`, so it doesn't appear on `/courses` or in the sitemap's per-course block.

**Forms (shared `/api/contact` endpoint).** Both the general contact form (`/contact`) and the enterprise enquiry form (`/for-business`) POST to the same [`/api/contact`](../app/api/contact/route.ts) with a `type: "general" | "enterprise"` discriminator. Each shape has its own validator. Resend sends the email with `replyTo` set to the visitor's email so a single click in Gmail starts the reply. A honeypot field (`company_website`) catches bots — non-empty value returns a success-shaped 200 without sending. In-memory sliding-window rate limit ([`lib/rateLimit.ts`](../lib/rateLimit.ts)): 5 submissions per IP per 10 minutes. Per-process only — fine on Railway's single instance, swap for Upstash if we scale horizontally.

**Newsletter (Resend audiences).** Single audience model. The form ([`components/layout/NewsletterForm.tsx`](../components/layout/NewsletterForm.tsx)) POSTs an email to [`/api/newsletter/subscribe`](../app/api/newsletter/subscribe/route.ts), which calls `resend.contacts.create({ audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID, email })`. Why Resend rather than ConvertKit/Beehiiv/Substack: same vendor as transactional, one fewer service to manage, no extra monthly fee until we have real volume. The copy is "Occasional notes from Khuram, when there's something worth sending" — explicitly *not* a weekly cadence promise. If we ever run a regular newsletter, we'll re-evaluate vendors.

---

## 4. Pages and routes — what's where

| Path | Method | Auth | Description |
|---|---|---|---|
| `/` | GET | public | Landing — hero, how-it-works, featured courses, why-AICraft, assessment teaser, final CTA |
| `/courses` | GET | public | Filterable course catalogue (level + topic) |
| `/courses/[slug]` | GET | public | Course detail — hero, what-you-learn, curriculum, FAQ, enrol button |
| `/aios-program` | GET | public | Long-form sales page for AIOS Mastery (discovery-call CTA only) |
| `/certification` | GET | public | How AICraft certification works, verify-by-ID input |
| `/assessment` | GET | public | Free "discover your AI level" assessment (iframes the standalone HTML) |
| `/for-business` | GET | public | Enterprise services + enterprise contact form |
| `/about` | GET | public | About the founder/brand |
| `/contact` | GET | public | General contact form |
| `/sign-in` | GET | public | Clerk-hosted sign-in |
| `/sign-up` | GET | public | Clerk-hosted sign-up |
| `/learn` | GET | authenticated | Learner dashboard — enrolled courses + progress |
| `/learn/[courseSlug]` | GET | authenticated-and-enrolled | Course home — module list, progress, assessment-ready state |
| `/learn/[courseSlug]/[lessonSlug]` | GET | authenticated-and-enrolled | Lesson viewer (iframes the HTML lesson) |
| `/learn/[courseSlug]/assessment` | GET | authenticated-and-enrolled | Final assessment shell (iframes the HTML assessment) |
| `/learn/[courseSlug]/certificate` | GET | authenticated-and-enrolled | Certificate viewer (iframes certificate.html with query params) |
| `/certificate/[verificationId]` | GET | public | Public certificate verification page |
| `/sitemap.xml` | GET | public | Auto-generated, static, includes course slugs |
| `/robots.txt` | GET | public | Disallows `/learn`, `/api`, `/sign-in`, `/sign-up` |
| `/manifest.webmanifest` | GET | public | PWA manifest |
| `/api/checkout/create-session` | POST | authenticated | Creates Stripe Checkout session for a course slug |
| `/api/webhooks/stripe` | POST | Stripe-signed | Handles `checkout.session.completed`, upserts Enrolment |
| `/api/progress/complete` | POST | authenticated-and-enrolled | Marks a lesson complete |
| `/api/assessment/submit` | POST | authenticated-and-enrolled | Scores attempt, gates by cooldown, issues certificate on pass |
| `/api/assessment/status` | GET | authenticated | Returns gate state (allLessonsComplete, canRetake, hoursUntilRetake) |
| `/api/assessment/issue-certificate-with-name` | POST | authenticated | Fallback when Clerk has no name on file |
| `/api/enrolment/status` | GET | authenticated | Banner polling endpoint |
| `/api/contact` | POST | public | General + enterprise contact (discriminated by `type`) |
| `/api/newsletter/subscribe` | POST | public | Adds email to Resend audience |
| `/not-found` (custom) | GET | public | Custom 404 with quick-links + Google site-search fallback |

---

## 5. Data model

Translates [`prisma/schema.prisma`](../prisma/schema.prisma).

- **User** — minimal record. `id` (cuid), `clerkId` (unique), `email` (unique), `createdAt`. No `firstName`/`lastName` — Clerk owns names. We store only what we need to join enrolments and certificates to a stable identity.
- **Enrolment** — purchase record. Idempotent on `(userId, courseSlug)` via `@@unique`. `stripeSessionId` is **nullable and unique-when-present**: nullable so seed-script rows can be marked as non-Stripe, unique so a given Stripe session can't be recorded twice. Created exclusively by the Stripe webhook (or the seed script).
- **LessonProgress** — per-lesson completion. Idempotent on `(userId, courseSlug, lessonSlug)`. `completed: Boolean` (true once written), `lastReadAt` updated on each completion event.
- **AssessmentAttempt** — every attempt logged, never overwritten. `score`, `totalQuestions`, `passed`. `answers: Json` is **non-null** — when seeding without real answers we write `{}` rather than null. No unique constraint on attempts (retakes are allowed); cooldown is enforced in code via the `retakeCooldownHours` config.
- **Certificate** — one per `(userId, courseSlug)` (`@@unique`). `verificationId` is also unique. `learnerName` and `courseTitle` are captured at issuance time and immutable thereafter — a learner who later changes their Clerk name still has the original name on the certificate.

**Schema drift, reconciled mid-build.** The original spec assumed `stripeSessionId String` (non-nullable) and `answers Json?` (nullable). The live Neon DB had them the other way round: `stripeSessionId String?` and `answers Json` (non-null). We aligned `schema.prisma` to the DB, not the other way round. **Do not "fix" these back** — both are intentional now (see seed script comments at [`scripts/seed-test-users.js:185-241`](../scripts/seed-test-users.js#L185-L241)).

---

## 6. External services — accounts, env vars, manual setup

All env vars live in **two places, kept in sync**: `.env.local` (local dev) and Railway Variables (production). Adding a new var means adding it to both.

### Clerk
- Dashboard: dashboard.clerk.com → "AICraft Learning" application.
- Env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`.
- Manual setup: enable email + password auth, configure social providers if desired. Add the production domain to allowed origins before launch.

### Stripe
- Dashboard: dashboard.stripe.com.
- Env vars: `STRIPE_SECRET_KEY` (sk_test_… for dev, sk_live_… for prod), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`.
- Manual setup:
  - Create one Product per course in *both* Test and Live mode. Each course manifest's `stripePriceId` must match the *active* mode's price ID — when going live, manifests need new IDs.
  - Webhook endpoint: `https://aicraftlearning.com/api/webhooks/stripe`, listening for `checkout.session.completed`. The signing secret goes into `STRIPE_WEBHOOK_SECRET`.
  - Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

### Neon (Postgres)
- Dashboard: console.neon.tech → project `aicraftlearning` (eu-west-2).
- Env var: `DATABASE_URL`.
- Manual setup: schema is already populated from a previous build. **Never migrate.** If schema.prisma drifts from the live DB, run `npm run db:pull` to inspect, then surface the diff to the user before reconciling.

### Resend
- Dashboard: resend.com.
- Env vars: `RESEND_API_KEY` (must be **Full access** — not Sending access), `RESEND_NEWSLETTER_AUDIENCE_ID`, optional `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
- Manual setup:
  - Verify the sending domain (`aicraftlearning.com`). DNS records added at Hostinger: 1 SPF TXT, 2 DKIM CNAME, 1 DMARC TXT — four records total.
  - Create a single Audience named "Newsletter" (or similar). Copy its UUID into `RESEND_NEWSLETTER_AUDIENCE_ID`. The audience must be created manually before the form will accept submissions.

### Railway
- Dashboard: railway.app → project linked to GitHub `Hafizkhuram/aicraftlearning`.
- Manual setup: connect the GitHub repo, paste all env vars into the Variables tab, add the custom domain (`aicraftlearning.com`) once the first deploy succeeds. CNAME at Hostinger points to the Railway-supplied target.

### GitHub
- Repo: `Hafizkhuram/aicraftlearning`, branch `main`.
- Push to `main` → Railway auto-deploys. There is no staging environment.

---

## 7. Deviations from the original spec

The spec ([`aicraft-learning-build-spec-v1.md`](./aicraft-learning-build-spec-v1.md)) and the codebase agree on most things. These are the places they don't:

- **Phase 5: case studies removed.** The spec called for a case-studies block on /for-business. We don't have real case studies yet, and placeholder testimonials would have undermined the "no AI-guru BS" positioning. Block dropped; replaced with a service-tiers + process explainer.
- **Phase 6: AIOS Mastery completely re-scoped.** The spec described AIOS as "tier 4" with a Stripe price and a `/learn/aios-mastery` shell. As built, AIOS is a high-touch programme with discovery-call sales only. No Stripe path, no `/learn` route, separate manifest at `content/aios-program.json`. The `/aios-program` page is the entire surface.
- **Phase 7: certificate.html rewrite.** The original certificate.html prompted the learner for their name in the browser and stored it locally. Re-architected to be query-param driven (`?name=…&date=…&id=…`); the patch script replaces the entire `<script>` block. The "Edit name" button and privacy note are removed because name is captured at the issuance API now. Module-4-review variants needed a separate "no-op finale" patch path — three different review shapes turned into two patch variants ([`scripts/patch-html-lessons.js:111-192`](../scripts/patch-html-lessons.js#L111-L192)).
- **Phase 9: consultation booking block dropped.** The spec called for a Calendly-style embed. Replaced with the unified contact-form approach (`?subject=aios-discovery-call`) so we own the lead-capture surface end-to-end.
- **Phase 10: analytics + cookie banner deferred.** Both planned but not shipped — see [§9](#9-known-limitations-and-post-launch-items). The capabilities-brief PDF on /for-business is also a placeholder link ([`app/for-business/page.tsx:190-198`](../app/for-business/page.tsx#L190-L198)).
- **Schema drift, reconciled.** `Enrolment.stripeSessionId` is nullable, `AssessmentAttempt.answers` is non-null — both opposite to the original spec, both deliberate now. See [§5](#5-data-model).
- **Newsletter copy changed** from "Weekly AI tips" to "Occasional notes from Khuram." Honest commitment > over-promise.
- **Fonts self-hosted, not from `next/font/google`.** The brand fonts (Fraunces, DM Sans) are loaded via `next/font/local` from `app/fonts/` to avoid `fonts.gstatic.com` TLS issues behind Cloudflare WARP. Same fonts, different transport.

---

## 8. Operational runbooks

**Local dev setup.**
```bash
git clone git@github.com:Hafizkhuram/aicraftlearning.git
cd aicraftlearning
npm install --include=optional   # the flag matters — Tailwind v4 oxide native binary
cp .env.example .env.local       # then paste real values from Railway Variables
npm run dev                      # http://localhost:3000
```
The dev server uses Turbopack for HMR. The production `next build` does *not* — see [`package.json`](../package.json) `build` script.

**Database operations.** Always use the npm wrappers — raw `npx prisma <cmd>` doesn't load `.env.local` and will fail with "DATABASE_URL is not set" on Windows.
- `npm run db:studio` — Prisma Studio against the live Neon DB.
- `npm run db:pull` — read-only print of DB-inferred schema. Use to detect drift.
- `npm run db:generate` — regenerate `@prisma/client` after editing `schema.prisma`.

**Deploying to Railway.** `git push origin main`. Railway auto-detects, builds, deploys. Watch deploy logs in the Railway dashboard. There's no other deploy command — no Vercel CLI, no `railway up`.

**Adding a new env var.** Two places, both required: (1) `.env.local` for local dev, (2) Railway → project → Variables tab for production. After changing Railway Variables, click "Deploy" or wait for the next push to pick them up.

**Seeding test users.** `SEED_CONFIRM=yes npx tsx scripts/seed-test-users.js`. Brings the listed users (currently Soha and Khuram) to a fully-enrolled, fully-progressed, certified state in all three self-serve courses. Idempotent; safe to re-run. Cleanup with `--cleanup`. The script writes to the *live* Neon DB — there's no separate dev DB. See the script header for full safety rationale.

**Going from Test mode to Live mode (the launch runbook).** The most consequential operation in this codebase.
1. In the Stripe dashboard, switch to Live mode. Re-create each course Product with the same name + price. Copy the new live `price_…` IDs.
2. Update `stripePriceId` in each [`content/courses/*.json`](../content/courses/) manifest to the live IDs. Commit.
3. In the Stripe dashboard (Live mode), create a new webhook endpoint pointing at `https://aicraftlearning.com/api/webhooks/stripe`, event `checkout.session.completed`. Copy the new signing secret.
4. In Railway Variables: replace `STRIPE_SECRET_KEY` (sk_live_…), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_…), `STRIPE_WEBHOOK_SECRET` (the new one).
5. In Clerk: ensure the production domain is in the allowed origins list.
6. Push the manifest commit. Confirm the deploy. Run a real card through the checkout — the webhook event arrives in Stripe → enrolment row created → /learn shows the course. If the Stripe event 400s, signature verification is the most likely culprit (wrong webhook secret).
7. Decide whether to clean up seed users (Soha, Khuram) before public launch — their certificates are publicly verifiable.

**Rotating a leaked credential.** Pattern used twice in this build (Neon DB password, Resend API key):
1. In the originating dashboard, rotate the credential. Copy the new value.
2. Update `.env.local` immediately so local dev keeps working.
3. Update Railway Variables, then trigger a redeploy (push or "Deploy" button) so production picks up the new value.
4. Audit recent commits and chat history for the leaked value; if it landed in git, add it to `.gitignore`'s scope and consider a force-push or BFG cleanse depending on visibility.
5. Where applicable (Stripe), revoke the old key from the dashboard once the new one is confirmed working.

**Common diagnostics.**
- **Railway Deploy Logs** — first stop for build failures, runtime errors, env-var problems. Stream from the Railway dashboard.
- **Stripe Webhook Events** (Stripe → Developers → Webhooks → endpoint → Events tab) — every webhook attempt, payload, response, and retry status. Failed events show response body.
- **Resend Dashboard → Emails** — every transactional email and contact-creation attempt, with full error messages.
- **Prisma Studio** (`npm run db:studio`) — read/edit any DB row.
- **Clerk Dashboard → Users** — verify a specific user's identity, find their `clerkId`, see session activity.

---

## 9. Known limitations and post-launch items

- **No analytics.** Visitor traffic is currently invisible. Add a privacy-respecting provider (Plausible, Fathom, or GA4 with consent) post-launch.
- **No cookie consent banner.** Required if/when analytics or any tracker is added under UK/EU rules. Not a blocker pre-launch because we ship no cookies beyond Clerk session and Stripe Checkout.
- **No blog or content-marketing surface beyond course pages.** Marketing happens off-site. If we add an editorial layer later, MDX or a headless CMS is the path.
- **No course search beyond the `/courses` filter UI.** Catalogue is small; revisit if it grows past ~10 courses.
- **AIOS Mastery curriculum module 6 has invented lesson titles.** The marketing-page module list is illustrative; the actual programme content is delivered live in discovery-call follow-ups, not authored in the repo.
- **AIOS Mastery has no Stripe payment path.** Sales are by discovery call. If we ever sell AIOS as a self-serve product, this is a non-trivial addition (own manifest shape, own /learn route).
- **Newsletter has no scheduled cadence.** "Occasional notes" by design — no broadcast tooling beyond Resend's audience UI.
- **Capabilities-brief PDF on /for-business is a placeholder link** — the `<a href="#">` at [`app/for-business/page.tsx:190`](../app/for-business/page.tsx#L190) is the only TODO comment in app code (verified by `grep -r "TODO" app/ components/ lib/` — clean otherwise).
- **`PLACEHOLDER` guard in checkout.** [`app/api/checkout/create-session/route.ts:59`](../app/api/checkout/create-session/route.ts#L59) refuses to create a session if a manifest's `stripePriceId` starts with `price_PLACEHOLDER`. Defensive against forgetting to swap in a live price ID.
- **Seed script's `--cleanup` mode targets only the listed seed users.** Ad-hoc test users created via real Stripe checkouts during dev are not removed automatically. Use Prisma Studio for those.
- **In-memory rate limit is per-process.** Fine on Railway's single instance; swap for Upstash/Redis if we ever scale horizontally.
- **Test-mode and live-mode Stripe price IDs differ.** Switching to live requires editing every course manifest's `stripePriceId`. See the launch runbook in [§8](#8-operational-runbooks).

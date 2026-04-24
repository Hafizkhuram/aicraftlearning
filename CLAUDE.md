# CLAUDE.md — AICraft Learning Website

> **Project:** AICraft Learning (aicraftlearning.com)
> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Railway
> **GitHub repo:** Hafizkhuram/aicraftlearning
> **Status:** Build phase — v4 rebuild (post-Vercel pivot)
> **This file:** Persistent project context for Claude Code. Read this every session.

---

## What you're building

A production website for AICraft Learning — an AI education brand that teaches non-technical professionals and business owners how to build AI systems that actually know their business. The audience is tool-fatigued, overwhelmed, and has been oversold by AI gurus. Everything about this site should feel like a relief from that noise.

**The build guide is in `aicraft-learning-claude-code-prompt.md`.** That file has 10 phases. Work through them in order. Don't skip ahead. Don't invent features that aren't in the spec.

**Your job has two sides:**
1. **Frontend craft** — build every page with intentional design, not generic AI-slop.
2. **Ship it** — deploy to Railway cleanly, with sensible defaults for SEO, performance, and security.

---

## Durable constraints — never violate these

### Deployment platform — Railway, not Vercel

A previous build attempted Vercel deployment and hit an unresolvable Clerk + Next.js 15 middleware validator bug after many hours of debugging. We have pivoted to Railway. Do not suggest moving back to Vercel, and do not configure Vercel-specific features like Edge middleware, `runtime: 'edge'`, or serverless function runtime overrides.

### Clerk version — pin to v6, not v7

Clerk v7 has documented incompatibilities with Next.js 15 production deployments (the Vercel Edge Function validator rejects middleware referencing `@clerk/shared` modules, and `@opennextjs` adapters have similar packaging issues). Install `@clerk/nextjs@^6.22.0` and do not upgrade to v7 without explicit user approval. v6's API is nearly identical for our use case — the only notable difference is that v6 uses `auth()` synchronously (no `await`), while v7 uses async.

### Database — never run migrations

The Neon Postgres database is shared with a previous build and already has the full schema populated. Never run:
- `prisma migrate dev`
- `prisma migrate deploy`
- `prisma migrate reset`
- `prisma db push`

**Only `prisma generate` is permitted.** The `schema.prisma` file describes existing tables — changes to it should be mirrored in the database via `prisma db pull`, not the other way round. If schema drift is discovered, stop and ask the user which way to reconcile. Don't auto-sync in either direction.

**Safe read-only introspection:** `npx prisma db pull --print` prints the DB-inferred schema to stdout without touching anything. Use it to verify alignment when in doubt.

### Course data — JSON manifests, not a DB table

Course data is stored in JSON manifests at `/content/courses/{slug}.json`. There is no `Course` table in the database. When code needs a course's title, price, lesson list, or assessment config, it reads the manifest file directly. When Stripe creates a checkout session, the price comes from the manifest — not from a Prisma query.

This is intentional: it keeps course content version-controlled in git, avoids a duplicate source-of-truth problem, and lets course metadata change without database migrations.

### User names — Clerk, not our DB

The User model in `schema.prisma` has no `firstName` or `lastName` columns (matches the live Neon DB). When code needs the user's display name, read it from the Clerk session (`user.firstName`, `user.lastName` via `currentUser()` on the server or via the user prop from `auth()`). Don't duplicate this into our User table.

### Stripe key mode — test, not live

Always use `sk_test_...` and `pk_test_...` keys during development. Never suggest switching to live keys without explicit user instruction. Test card for E2E checks: 4242 4242 4242 4242.

### Lazy initialisation — for all external service clients

**Never throw at module-load time if env vars are missing.** Wrap external client creation (Stripe, any custom DB client wrapper, any third-party API client) in a function that validates and initialises on first actual use. This prevents build failures when env vars are temporarily missing, makes testing easier, and was the root cause of one of the v3 build failures.

Example pattern (use this for every external service):

```typescript
// WRONG — throws at import time:
import Stripe from 'stripe';
if (!process.env.STRIPE_SECRET_KEY) throw new Error('missing');
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// RIGHT — throws only when first used at runtime:
import Stripe from 'stripe';
let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  _stripe = new Stripe(key, { apiVersion: '2024-04-10' });
  return _stripe;
}
```

### Turbopack — dev only, not production

The `next dev --turbopack` command is fine for local development (fast HMR). The production `next build` must NOT use `--turbopack` (known packaging issues with middleware). The `build` script in `package.json` should be just `"next build"`.

### Route protection — layouts, not middleware

Protection logic lives in `/app/learn/layout.tsx` (server component, calls `auth()`, redirects if no userId) and at the top of each protected API route handler. Middleware.ts is kept minimal (just `clerkMiddleware()` wrapping) so Clerk has its auth context available app-wide, but it doesn't do any protection itself. This pattern avoids middleware packaging complexity and works reliably on Railway.

---

## Operating principles

- **Follow the build guide.** `aicraft-learning-claude-code-prompt.md` is the source of truth for what to build. If anything in this CLAUDE.md conflicts with the build guide, the build guide wins for what-to-build; this file wins for how-to-build.
- **Ship working code.** Every phase should compile cleanly before moving on. Run `npm run build` and `npm run lint` at the end of each phase and fix errors before declaring the phase complete.
- **Self-reliant on tooling.** If you need a library, install it. Don't ask permission for routine engineering decisions — just document what you installed and why. **Exceptions:** never install or upgrade Clerk to v7, never run a Prisma migration command, never switch deployment platforms away from Railway.
- **Plain language in commits and comments.** "Fixed broken image on About page" beats "chore: resolve asset resolution." The user is non-technical.
- **Don't over-engineer.** This is a marketing website with a learning platform attached, not a distributed system. No microservices, no over-abstracted component libraries, no premature optimisation. Clean code beats clever code.
- **When in doubt, ask.** If a design decision has multiple reasonable answers (which font, which analytics provider, which CMS), surface the options with a recommendation and wait. Don't silently pick.
- **Stop and report schema drift.** If `prisma db pull --print` reveals differences between the live DB and `schema.prisma`, don't auto-fix. Report to the user and wait for direction.

### What you commit to

- Site compiles cleanly with zero TypeScript errors and zero ESLint errors.
- All pages render on mobile (375px), tablet (768px), and desktop (1280px+) without overflow or broken layouts.
- Lighthouse scores of 90+ for Performance, Accessibility, Best Practices, and SEO on every main page.
- Every page has unique `<title>` and `<meta description>` tags.
- All interactive elements are keyboard-accessible with visible focus states.
- No `console.log`, no `TODO` comments, no placeholder Lorem Ipsum in production code.

---

## Design direction (this is the critical section)

The AI education space is flooded with generic, purple-gradient, Inter-font AI-slop websites. AICraft Learning must look nothing like them. Before writing any component, commit to the aesthetic direction below and execute it with precision.

### Aesthetic identity

**Tone:** Refined craft studio meets modern education platform. Think: a premium design agency's website, not a bootcamp. Not minimalist to the point of cold, not maximalist to the point of busy — deliberate, confident, and quietly distinctive.

**The one thing people should remember:** The brand feels like it was made by someone who cares about the craft, not someone chasing AI trends.

### Colour system (locked — use these exact values)

Set as CSS variables in `app/globals.css` (via Tailwind v4's `@theme` block):

```css
--primary-green: #10B981;     /* emerald — primary CTAs, highlights */
--deep-green: #065F46;         /* forest — headings on light bg, dark accent */
--light-mint: #D1FAE5;         /* mint — soft backgrounds, badge backgrounds */
--accent-green: #34D399;       /* bright emerald — hover states, accent text */
--dark-bg: #0F172A;            /* deep slate — hero, dark sections */
--surface: #F0FDF4;            /* green-tinted white — card backgrounds */
--text-dark: #1E293B;          /* slate 800 — body text on light */
--text-light: #F8FAFC;         /* slate 50 — body text on dark */
--text-muted: #64748B;         /* slate 500 — secondary text */
--border: #E2E8F0;             /* slate 200 — default borders */
--warning: #FBBF24;            /* amber — use sparingly for badges/alerts */
```

Rule: one dominant colour (green) at ~60-70% visual weight, dark slate as the grounding tone, amber only for rare emphasis. Never introduce new colours without updating this list.

### Typography

**Do not use Inter or Arial.** They are the two most-used fonts in AI websites and signal "generic template."

**Font pairing:**
- **Display (headings):** `Fraunces` (via `next/font/google`) — distinctive, elegant variable serif with subtle personality. Weights 500, 600, 700.
- **Body (paragraphs, UI):** `DM Sans` (via `next/font/google`) — clean, neutral sans with good readability at small sizes. Weights 400, 500, 700.

Both are free, open-source, and load fast. Load both through `next/font/google` with `display: 'swap'` for no layout shift.

**Type scale:**
- Hero headlines: 48-72px display, bold (700), tight leading (1.05-1.1)
- Section headings: 32-40px display, semibold (600)
- Subheadings: 20-24px body, medium (500)
- Body: 16-18px body, regular (400), generous leading (1.6-1.7)
- Small/meta: 13-14px body, regular, muted colour

### Visual motif — carry this everywhere

**Signature element:** A thin (2-4px) vertical green accent bar that sits to the left of section headings or key text blocks. It references the circuit-node pattern in the logo. Use it consistently — it's the detail people will remember.

**Other recurring motifs:**
- Circular icon containers (56-64px) with light mint backgrounds and deep green icons
- Rounded cards with 0.5px borders (not 1px — more refined)
- Generous whitespace; never cram content
- Dark hero sections with subtle emerald radial gradients in corners (top-right or bottom-left)

### What to avoid

- Purple gradients
- Generic "abstract AI" imagery (blue neural network graphics, glowing circuits)
- Stock photography of people pointing at screens
- Icon packs with the same visual style as every other AI website (Heroicons default stroke, Material default fills)
- Title Case. Use sentence case for all headings — matches the brand's conversational tone.
- Carousels, sliders, and auto-playing anything. They're AI-website clichés and hurt conversion.
- Emoji in headings or CTAs. Used sparingly in body copy only if the brand voice clearly calls for it.

### Motion

- Use `framer-motion` for scroll-triggered fade-ins on section entry. Stagger child elements by 80-120ms for a considered feel.
- No bouncing, no spinning logos, no looping background animations.
- Hover states on cards and buttons: subtle (1-2px Y-translation, slight border colour change). Never scale > 1.02.
- `prefers-reduced-motion` respected everywhere.

---

## Tech decisions (pre-decided — don't second-guess)

### Stack
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript with strict mode on
- **Styling:** Tailwind CSS v4 (CSS-first via `@theme` block in globals.css)
- **Animation:** framer-motion (only where it adds real value)
- **Icons:** lucide-react (consistent, clean, customizable stroke width)
- **Content:** HTML files (in `/public/content/`) for course lessons — not MDX. JSON for structured content (courses, paths).
- **Forms:** Native HTML forms with client-side validation; no form library until complexity demands it.
- **Auth:** Clerk v6.22.x — pinned, do not upgrade
- **DB:** Prisma v6 + Neon Postgres — never migrate
- **Payments:** Stripe Checkout (test mode)
- **Deployment:** Railway (connected via GitHub auto-deploy)

### Folder structure

```
/app              — pages and layouts (App Router)
/components       — reusable UI components
  /ui             — design primitives (Button, Card, Badge)
  /sections       — page sections (Hero, CTABanner, etc.)
  /layout         — navbar, footer
  /learn          — lesson viewer, sidebar
/content
  /courses        — course manifest JSONs (ai-fundamentals.json, etc.)
/lib              — utilities, constants, types
/prisma           — schema.prisma and generated client
/public
  /content
    /ai-fundamentals      — 18 HTML files (12 lessons + 4 reviews + final-assessment + certificate)
    /claude-code-mastery  — 22 HTML files
    /ai-agents-workflows  — 22 HTML files
  /assessment             — discover-your-ai-level.html
  /aicraft-logo-primary.svg
/scripts          — build-time utility scripts (e.g. patch-html-lessons.js)
```

### Deployment — Railway

Railway runs Next.js as a standard Node.js process. No Edge runtime, no serverless function validator, no middleware packaging issues. Your code runs as written.

**Deployment flow:**
1. Code pushed to GitHub (`Hafizkhuram/aicraftlearning`) on `main` branch
2. Railway auto-detects the push and starts a build
3. Railway runs `npm install`, `npm run build`, then `npm start`
4. Your public URL is assigned automatically (e.g. `aicraftlearning-production.up.railway.app`)
5. Custom domain (`aicraftlearning.com`) points to Railway via CNAME from Hostinger DNS

**One-time setup tasks (the user handles these manually):**
- GitHub repo exists at `Hafizkhuram/aicraftlearning`
- Railway project connected to that repo
- All 10 env vars pasted into Railway's Variables dashboard
- Custom domain added after first successful deploy (Phase 10)

You (Claude Code) don't need to run deployment commands — every `git push origin main` triggers a Railway deploy automatically.

### Environment variables (all reused from previous build, present in `.env.local` and Railway Variables)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY       — Clerk
CLERK_SECRET_KEY                         — Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL            — /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL            — /sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL  — /learn
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL  — /learn
DATABASE_URL                             — Neon Postgres
STRIPE_SECRET_KEY                        — sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY       — pk_test_...
STRIPE_WEBHOOK_SECRET                    — blank until Phase 10
```

### Security headers (add to `next.config.ts`)

```typescript
headers: async () => [
  {
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },  // NOT 'DENY' — we iframe our own lesson HTML
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  },
]
```

Note: `X-Frame-Options` is `SAMEORIGIN` (not `DENY`) because the learning area iframes our own lesson HTML files.

### SEO defaults (every page must have)

- Unique `<title>` in page metadata
- Unique `<meta description>` 150-160 chars
- Open Graph tags (og:title, og:description, og:image)
- Canonical URL
- `<html lang="en">`
- Semantic HTML (`<main>`, `<nav>`, `<article>` used correctly)

Auto-generate `sitemap.xml` and `robots.txt` using Next.js built-in support at `app/sitemap.ts` and `app/robots.ts`. Exclude `/learn/*`, `/api/*`, `/sign-in`, `/sign-up` from the sitemap and disallow them in robots.txt.

---

## How to handle common situations

### When a phase is complete
1. Run `npm run build` and `npm run lint`. Fix any errors.
2. Manually check the built pages at 375px, 768px, and 1280px widths.
3. Commit with a clear message: `Phase N: [what was built]`.
4. Push to origin/main so Railway auto-deploys.
5. Tell the user what you built, what to test on the Railway URL, and wait for approval before Phase N+1.

### When you hit an ambiguous decision
- If it affects visual design: refer to the Design direction section above. If still ambiguous, surface options to the user.
- If it affects the stack or architecture: these are pre-decided (see Tech decisions and Durable constraints). Don't change them without asking.
- If it's a content question (copy, tone, pricing): don't invent. Use placeholder clearly marked `[PLACEHOLDER]` and flag it to the user.

### When something breaks
- Fix first, explain after.
- If the fix involves new dependencies or configuration changes, say so in plain language.
- If you can't fix it, stop and describe the problem with a recommended next step.
- **Critical:** if the fix involves touching Clerk version, Prisma migrations, Vercel, or deployment platform, STOP and ask before proceeding. These are durable constraints.

### When the user asks for a change to something already built
- Make the change, but also point out any downstream implications (e.g., "changing the nav will also require updating the mobile menu").
- Don't rebuild adjacent code unless the change requires it.

### When Vercel is mentioned
The previous build used Vercel and hit an unresolvable bug. This project uses Railway. If the user mentions Vercel by accident or asks about something Vercel-specific, gently remind them the project is on Railway now.

---

## Self-reliance

Install what you need without asking:
- npm packages for functionality the build guide implies (icons, validation, etc.)
- Dev dependencies (ESLint plugins, Prettier, Tailwind plugins)

Ask before:
- Upgrading Clerk (v6 is pinned — v7 has a known Next.js 15 bug)
- Running any Prisma migration command (the DB is shared, never migrate)
- Adding paid services (analytics providers beyond GA4, transactional email services)
- Changing the stack (different framework, different CSS library, different hosting)
- Anything that touches domain, DNS, or billing

Document every significant installation in a short comment or commit message so the user can see what's in the project.

---

## Activation

When the user starts a session in this project, they'll typically say something like:

> "Let's build Phase 1."

Respond by:
1. Confirming which phase.
2. Reading `aicraft-learning-claude-code-prompt.md` for that phase's spec.
3. Referencing this file for design and engineering defaults.
4. Building. Telling them when the phase is ready to review.

---

## Lessons from previous builds (for context — don't re-learn these)

The v3 build spent many hours fighting the following issues. v4 bakes in the solutions so these don't repeat:

1. **Clerk v7 + Vercel Edge Function validator** — unresolvable. Solution: Clerk v6 + Railway.
2. **Middleware runtime confusion** — `export const runtime = 'nodejs'` caused ESM/CommonJS packaging issues. Solution: minimal middleware, route protection in layouts, Railway doesn't need runtime overrides.
3. **Eager Stripe initialisation crashing builds** — `throw` at module-load when env vars temporarily missing. Solution: lazy init pattern for all external service clients.
4. **Prisma schema drift from live Neon DB** — spec assumed `firstName`/`lastName` on User and a `Course` table; live DB has neither. Solution: schema.prisma matches live DB from day one, course data comes from JSON manifests.
5. **Turbopack middleware packaging bugs** — `next build --turbopack` causes middleware crashes. Solution: `build` script uses plain `next build`; dev keeps Turbopack for speed.
6. **Empty Vercel env vars rendering silently** — values appeared saved but weren't, causing runtime crashes. On Railway, confirm env vars are populated by checking Variables tab shows them (not placeholders).

These are historical — the current architecture prevents them. Don't try alternative approaches to "improve" these; they were hard-won lessons.

---

*This file is the permanent project brain. Update it when architectural decisions change. Never duplicate what's in `aicraft-learning-claude-code-prompt.md` — that file owns the what-to-build; this file owns the how-to-build.*

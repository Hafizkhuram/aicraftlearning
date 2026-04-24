# Claude Code Prompt — AICraft Learning Website (Rebuild v4 · HTML-first · Railway)

**Brand:** AICraft Learning
**Domain:** aicraftlearning.com
**GitHub repo:** Hafizkhuram/aicraftlearning
**Deployment:** Railway (auto-deploy on push to main)
**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Clerk v6.22.x · Stripe Checkout · Prisma v6 + Neon Postgres
**Content format:** Self-contained HTML files for all lessons, module reviews, assessments, and interactive widgets. No MDX, no bespoke React lesson components. The Next.js app is the shell; the HTML files are the content.

> **This is rebuild v4.** Three previous attempts taught hard lessons:
> - **v1:** MDX + React components per lesson is over-engineered when your content is visually bespoke.
> - **v2:** Iframe-wrapping HTML inside an MDX pipeline is a bolt-on fix that carries complexity forward.
> - **v3:** Vercel + Clerk v7 + Next.js 15 middleware has an unresolvable Edge Function validator bug that cost days of debugging.
>
> **v4 starts clean:** Next.js owns auth, enrolment, payments, progress, and the shell; HTML files own the lesson experience. Railway replaces Vercel (runs Next.js as normal Node.js, no Edge runtime complications). Clerk is pinned to v6 (v7 has the Next.js 15 bug). The Prisma schema matches the live Neon DB from day one (no drift surprises).
>
> **Before running Phase 1:** confirm the following are set up:
> - Folder has this file, `CLAUDE.md`, `.env.local`, `aicraft-logo-primary.svg`, `discover-your-ai-level.html`, and three course folders (`ai-fundamentals/`, `claude-code/`, `building-ai-agents/`)
> - GitHub repo `Hafizkhuram/aicraftlearning` exists and is linked to this folder as `origin`
> - Railway project is connected to that GitHub repo with all env vars pasted in the Variables tab
> - git identity is configured: `khuram.s92@gmail.com` / `Hafiz Khuram`
>
> **After every phase:** `git add . && git commit -m "Phase N: ..." && git push`. Railway auto-deploys on push.

Copy and paste each phase below into Claude Code one at a time. Wait for each to finish before moving to the next.

---

## Phase 1: Project scaffolding, layout, navbar, footer

```
I'm rebuilding AICraft Learning (aicraftlearning.com) — an AI education brand that teaches non-technical professionals and business owners how to use AI confidently. Audience: tool-fatigued, overwhelmed, oversold. Everything should feel like a relief from the AI hype noise.

Build with Next.js 15 (App Router), TypeScript strict mode, Tailwind CSS v4.

1. Initialise the project in the current directory:
   npx create-next-app@latest . (TypeScript yes, ESLint yes, Tailwind yes, App Router yes, no src directory, Turbopack default, default import alias)
   
   When prompted "This directory is not empty, continue?" — answer YES. The existing files (course folders, logo, CLAUDE.md, the prompt file, .env.local) should stay intact.

2. IMPORTANT — disable Turbopack for production builds. Open package.json. In the "scripts" section, the "build" script should be just `"next build"` (no --turbopack flag). Leave the "dev" script as `"next dev --turbopack"` for fast local development. Turbopack's production build has known issues with middleware packaging.

3. Folder structure to create (in addition to what create-next-app makes):
   /app                                  (pages and layouts)
   /components
     /ui                                 (Button, Card, Badge primitives)
     /sections                           (Hero, CTABanner, page sections)
     /layout                             (Navbar, Footer)
     /learn                              (lesson viewer, sidebar — added Phase 7)
   /content
     /courses                            (course manifest JSONs)
   /lib                                  (utilities, constants, types)
   /public
     /content
       /ai-fundamentals                  (already has 18 HTML files — leave them)
       /claude-code-mastery              (create, will receive 22 HTML files)
       /ai-agents-workflows              (create, will receive 22 HTML files)
     /assessment                         (already has discover-your-ai-level.html? or move it here)
     (aicraft-logo-primary.svg is already here — leave it)
   /prisma                               (schema, added in Phase 1.5)
   /docs                                 (notes, source prompt files)
   /scripts                              (build-time helpers)

   NOTE: The three course folders (ai-fundamentals, claude-code, building-ai-agents) currently exist at the project root. Move them to /public/content/ as follows:
     /ai-fundamentals        → /public/content/ai-fundamentals
     /claude-code            → /public/content/claude-code-mastery  (rename during move)
     /building-ai-agents     → /public/content/ai-agents-workflows  (rename during move)
   
   Also move /discover-your-ai-level.html → /public/assessment/discover-your-ai-level.html

   Move aicraft-logo-primary.svg → /public/aicraft-logo-primary.svg (if not already there).

4. Install dependencies:
   - framer-motion
   - lucide-react
   - @radix-ui/react-dialog
   - @radix-ui/react-accordion
   - next-themes

   Skip: next-mdx-remote, gray-matter, MDX anything. Content is HTML, not MDX.

5. Create /lib/constants.ts:
   - siteName: "AICraft Learning"
   - siteUrl: "https://aicraftlearning.com"
   - tagline: "Craft Your AI Future"
   - description: "Hands-on AI training for businesses, professionals, and individuals. Master Claude, Claude Code, AI automation, and more."
   - contactEmail: "hello@aicraftlearning.com"
   - supportEmail: "support@aicraftlearning.com"
   - enterpriseEmail: "enterprise@aicraftlearning.com"

6. Fonts — use next/font/google:
   - Fraunces (display/headings) — weights 500, 600, 700
   - DM Sans (body/UI) — weights 400, 500, 700
   - Expose as CSS variables --font-display and --font-body
   - Do NOT use Inter, Roboto, Arial, Helvetica — they signal "generic template"

7. Colour system in /app/globals.css (CSS variables via @theme block for Tailwind v4):
   --primary-green: #10B981
   --deep-green: #065F46
   --light-mint: #D1FAE5
   --accent-green: #34D399
   --dark-bg: #0F172A
   --surface: #F0FDF4
   --text-dark: #1E293B
   --text-light: #F8FAFC
   --text-muted: #64748B
   --border: #E2E8F0
   --warning: #FBBF24

8. NAVBAR — this specific layout, not a dropdown version:

   Desktop layout (≥1024px wide):
   - Left:   AICraft Learning logo — use /public/aicraft-logo-primary.svg. Height 40px. Scales width automatically.
   - Centre: nav links — Home · Courses · AIOS Program · Certification · For Business · About · Contact
     All links flat. NO "More ▾" dropdown. All seven items visible in the top nav.
     Use: `text-sm font-medium text-text-dark hover:text-primary-green transition-colors whitespace-nowrap`
   - Right:  theme toggle (next-themes, sun/moon icon) + 
             SignedOut: "Sign in" link + "Sign up" button (emerald fill, white text, rounded-lg)
             SignedIn: "My Learning" link + <UserButton /> (scaffolded now, wired Phase 1.5)

   Mobile/tablet layout (<1024px):
   - Left:   logo (same file, height 36px)
   - Right:  hamburger icon only
   - Hamburger opens a full-height drawer from the right with ALL nav links stacked vertically, theme toggle, and auth controls

   Technical requirements:
   - Custom Tailwind breakpoint `nav: 1024px`
   - `hidden nav:flex` for desktop nav; `flex nav:hidden` for hamburger
   - Add `whitespace-nowrap` to EVERY nav link, button, and label
   - Navbar height: 72px on desktop, 64px on mobile
   - Sticky top with backdrop-blur and slight transparency: `sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-border`
   - Dark mode variant: `dark:bg-dark-bg/85 dark:border-slate-800`

9. FOOTER (basic version — full version in Phase 10):
   - Brand tagline on left with small logo
   - Quick links (flattened): Home, Courses, AIOS Program, Certification, For Business, About, Contact
   - Contact info: three emails
   - Newsletter signup: "Weekly AI tips for non-technical professionals. No tool-of-the-week nonsense." Single email field, one button.
   - Social placeholders (LinkedIn, X/Twitter icons via lucide-react)

10. Dark/light theme toggle — ready in navbar via next-themes.

11. Smooth scroll behaviour via CSS: `html { scroll-behavior: smooth; }`

12. Homepage placeholder: `<main>` with "AICraft Learning — coming soon". Real homepage is Phase 2.

13. SECURITY HEADERS in next.config.ts:
    headers: async () => [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },  // NOT 'DENY' — we iframe our own lesson HTML
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }]

Don't build actual pages yet — just scaffolding, layout, navbar, footer. 

Before declaring done:
- `npm run build` passes with zero errors (WITHOUT --turbopack flag)
- `npm run lint` passes with zero errors
- Manually check at 375px, 768px, 1280px — navbar adapts correctly
- Navbar logo, links, and buttons NEVER wrap

git add . && git commit -m "Phase 1: project scaffolding, layout, navbar, footer" && git push

Railway will auto-deploy on push. Once the deploy is Ready, confirm the homepage placeholder loads at the Railway URL.
```

---

## Phase 1.5: Auth, payments, database scaffolding (reusing existing services)

```
Set up authentication, payments, and database. All later phases assume these exist.

STACK:
- Auth: Clerk v6.22.x (@clerk/nextjs@^6.22.0) — PINNED. Do NOT upgrade to v7.
- Payments: Stripe Checkout (stripe + @stripe/stripe-js)
- Database: Prisma v6 + Neon Postgres (both already set up externally)

IMPORTANT — REUSE FROM PREVIOUS BUILD:
The secrets from a previous AICraft Learning build are being reused. The user has pasted these into .env.local and into Railway's Variables dashboard:
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  CLERK_SECRET_KEY
  NEXT_PUBLIC_CLERK_SIGN_IN_URL
  NEXT_PUBLIC_CLERK_SIGN_UP_URL
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
  DATABASE_URL
  STRIPE_SECRET_KEY
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  STRIPE_WEBHOOK_SECRET (may be blank until Phase 10)

Build the plumbing to match — don't regenerate keys, don't create a new database. The Neon database ALREADY HAS the schema with all tables populated. Do NOT run any Prisma migration command.

CLIENT vs SERVER COMPONENT RULE:
- Any component using useState, useEffect, onClick, or any React hook MUST start with "use client".
- Server components read the DB directly; client components get data via props from a server component parent OR call API routes.
- When in doubt, thin client wrapper around a server component — don't pass DB access into client components.

LAZY INITIALISATION RULE (critical — learned from v3):
For ALL external service clients (Stripe, Prisma, Clerk-beyond-what's-auto-wired), use LAZY initialisation. Never throw at module-load time if env vars are missing. Wrap client creation in a function that validates and initialises on first call. This prevents build failures when env vars are temporarily missing and makes testing easier.

Example pattern:
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

Apply this pattern to EVERY external service client.

1. AUTH — Clerk v6 (pinned)
   - Install: npm install @clerk/nextjs@^6.22.0
   - Verify version: npm list @clerk/nextjs should show 6.x
   - Wrap app/layout.tsx root with <ClerkProvider>
   - Create middleware.ts with MINIMAL clerkMiddleware (no protection logic in middleware — protection lives in layouts):
     ```typescript
     import { clerkMiddleware } from "@clerk/nextjs/server";
     
     export default clerkMiddleware();
     
     export const config = {
       matcher: [
         '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
         '/(api|trpc)(.*)',
       ],
     };
     ```
   - Do NOT add `export const runtime = 'nodejs'` — Railway doesn't need it.
   - /sign-in/[[...sign-in]]/page.tsx and /sign-up/[[...sign-up]]/page.tsx using <SignIn /> and <SignUp />, styled with emerald accents
   - Wire up navbar: SignedIn → UserButton + "My Learning"; SignedOut → Sign in link + Sign up button. Use Clerk v6 syntax: `const { userId } = auth();` (sync in v6, NOT async like v7)

2. DATABASE — Prisma + Neon (EXISTING SCHEMA)
   - Install prisma + @prisma/client (both v6.x)
   - /prisma/schema.prisma — write the schema to match the EXISTING Neon tables EXACTLY. The models below reflect what's actually in the live database (not an aspirational schema):
     
     ```prisma
     generator client {
       provider = "prisma-client-js"
     }
     
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     
     model User {
       id         String    @id @default(cuid())
       clerkId    String    @unique
       email      String    @unique
       createdAt  DateTime  @default(now())
       
       enrolments        Enrolment[]
       lessonProgress    LessonProgress[]
       assessmentAttempts AssessmentAttempt[]
       certificates      Certificate[]
     }
     
     model Enrolment {
       id              String    @id @default(cuid())
       userId          String
       courseSlug      String
       stripeSessionId String    @unique
       createdAt       DateTime  @default(now())
       
       user User @relation(fields: [userId], references: [id])
       
       @@unique([userId, courseSlug])
     }
     
     model LessonProgress {
       id           String    @id @default(cuid())
       userId       String
       courseSlug   String
       lessonSlug   String
       completed    Boolean   @default(false)
       lastReadAt   DateTime  @default(now())
       
       user User @relation(fields: [userId], references: [id])
       
       @@unique([userId, courseSlug, lessonSlug])
     }
     
     model AssessmentAttempt {
       id              String   @id @default(cuid())
       userId          String
       courseSlug      String
       score           Int
       totalQuestions  Int
       passed          Boolean
       completedAt     DateTime @default(now())
       answers         Json?
       
       user User @relation(fields: [userId], references: [id])
       
       @@index([userId, courseSlug])
     }
     
     model Certificate {
       id             String   @id @default(cuid())
       verificationId String   @unique
       userId         String
       courseSlug     String
       courseTitle    String
       learnerName    String
       issuedAt       DateTime @default(now())
       
       user User @relation(fields: [userId], references: [id])
       
       @@unique([userId, courseSlug])
     }
     ```
   
   Note: User has NO firstName/lastName fields. Read those from Clerk when needed.
   Note: There is NO Course model. Course data comes from /content/courses/{slug}.json.
   
   - Run `npx prisma generate` (generates the TypeScript client)
   - DO NOT run `npx prisma migrate` or `npx prisma db push` — the DB is already set up.
   - OPTIONAL: run `npx prisma db pull --print` into a temp file and diff against schema.prisma to verify alignment. If there's drift, STOP and report to user — don't auto-sync.
   - /lib/db.ts exports the singleton PrismaClient (lazy init pattern)

3. PAYMENTS — Stripe (lazy init)
   - Install stripe + @stripe/stripe-js
   - /lib/stripe.ts with server-side Stripe client using getStripe() pattern from above
   - API route: /api/checkout/create-session (POST, auth required) — accepts { courseSlug }, looks up course price from /content/courses/{slug}.json manifest (NOT from Prisma), creates Checkout session with metadata { userId, courseSlug }, returns session URL
   - API route: /api/webhooks/stripe (POST, no auth) — Stripe signature verification, on `checkout.session.completed` creates Enrolment row (idempotent — check for existing first)

4. AUTH HELPER — /lib/auth.ts
   - Exports getOrCreateUser(clerkUser) — upserts the User row (clerkId + email only, no name fields)
   - Every server component in /learn/* uses this at the top

5. ROUTE PROTECTION VIA LAYOUTS (not middleware)
   - /app/learn/layout.tsx: server component that calls auth(). If no userId, redirect to /sign-in.
   - For API routes that need protection (/api/progress, /api/assessment, etc. — added in Phase 7), add auth() check at the start of each handler.
   - Middleware stays minimal (just clerkMiddleware() to enable auth context).

6. ENROLMENT UI helper:
   - /components/ui/EnrollButton.tsx ("use client")
   - Props: { courseSlug, isEnrolled?, price }
   - If signed out: navigates to /sign-up?redirect_url=/courses/[courseSlug]
   - If signed in and not enrolled: POST /api/checkout/create-session, redirect to returned URL
   - If enrolled: renders "Go to course →" link to /learn/[courseSlug]

Before declaring done:
- `npm run build` passes (Railway will run this)
- `npm run lint` passes
- Sign up with a test account locally, redirect works
- No startup errors in Railway logs after deploy

git add . && git commit -m "Phase 1.5: auth, payments, database scaffolding" && git push
```

---

## Phase 2: Homepage

```
Build / (homepage). Design brief: refined craft studio meets modern education platform. Not minimalist, not maximalist — deliberate, confident, distinctive.

Structure (top to bottom):

1. HERO SECTION
   - Dark background (--dark-bg #0F172A)
   - Subtle emerald radial gradient top-right corner
   - Left column: eyebrow label (small caps, accent green) "AI education, done properly"
   - Large Fraunces display headline: "Learn to use AI like you mean it." (up to 72px on desktop)
   - Subheadline body text (DM Sans, 18-20px, muted light): "Tool-fatigued? Overwhelmed? We teach the craft of AI — not the hype. Text-based courses, bespoke interactive lessons, real skills."
   - Two CTAs: primary "Browse courses" (emerald fill) + secondary "Discover your AI level" (ghost with border) — the second links to /assessment
   - Right column: the circuit-node logo symbol, large, slowly animating (subtle rotate/pulse on the satellite nodes — use framer-motion with `ease: 'easeInOut'`, very gentle)

2. TRUST STRIP (thin band below hero)
   - Small muted text: "Trusted by professionals at" + placeholder logos (grayscale, 5-6 slots)

3. "HOW IT WORKS" SECTION
   - Three-column grid: Read → Practice → Apply
   - Each column has: circular icon container (56px, light mint bg, deep green icon), heading, 2-3 sentence body
   - The thin emerald accent bar (3px) sits to the left of each heading — this is the brand's signature detail

4. FEATURED COURSES GRID
   - 3 cards: AI Fundamentals ($29.99), Claude Code Mastery ($39.99), AI Agents & Workflows ($99)
   - Each card: level badge (Beginner/Intermediate/Advanced), title (Fraunces), 1-sentence description, "Module count · Lesson count · Duration" stats row, price, "Learn more →" link
   - Cards have 0.5px borders (not 1px — more refined), rounded corners, subtle hover: translate-y-[-2px] + border-color change
   - Pull data from /content/courses/*.json — read the manifests you'll build in Phase 3. If manifest files don't exist yet, hard-code placeholder data for this phase and replace in Phase 3.

5. "WHY AICRAFT LEARNING" BAND
   - Light mint background (--light-mint)
   - Four differentiators in a 2x2 grid:
     - "Craft over theory" — we teach the how, not the what
     - "Text-first" — no video filler, real depth
     - "Tool-specific" — Claude, Claude Code, Make, not generic AI
     - "Certificate-verified" — employers can verify at your URL
   - Each has a small lucide-react icon, heading, short body

6. ASSESSMENT TEASER
   - Dark background section with an emerald left-border accent panel
   - Heading: "Not sure where to start?"
   - Body: "Take our free 5-minute assessment. Find your AI level and the right starting point."
   - Big CTA: "Discover your AI level →" → /assessment

7. TESTIMONIAL BAND (placeholder)
   - Three short quotes with placeholder names/roles
   - Emerald left-border on each quote

8. FINAL CTA
   - Centre-aligned, Fraunces display: "Start your AI craft today."
   - Primary button: "Browse courses →" → /courses
   - Secondary link: "Prefer to talk first? Book a call →" → /contact

ANIMATION:
- Use framer-motion for scroll-triggered fade-ins on section entry
- Stagger children by 80-120ms
- Respect prefers-reduced-motion
- No bouncing, spinning, looping

BEFORE DECLARING DONE:
- All pages render at 375/768/1280 without overflow or wrapping
- Keyboard-tab through all CTAs — visible focus states everywhere
- Dark mode toggles correctly (all sections look right in both)

git add . && git commit -m "Phase 2: homepage" && git push
```

---

## Phase 3: Courses listing and course detail pages

```
Build /courses and /courses/[slug].

CONTENT source: /content/courses/*.json — one file per course.

Create all three course manifests in full, using the exact structures below. Each has its own lesson titles, lesson counts, assessment configuration, and price. Do not invent lesson titles — copy them exactly as provided.

=============================================================
MANIFEST SCHEMA (applies to all three courses)
=============================================================

{
  "slug": string,
  "title": string,
  "subtitle": string,
  "level": "Beginner" | "Intermediate" | "Advanced",
  "duration": string (e.g. "~3 hours"),
  "lessonCount": number,           // teaching lessons only, not reviews
  "moduleCount": 4,
  "price": number,                  // in dollars, e.g. 29.99
  "priceDisplay": string (e.g. "$29.99"),
  "stripePriceId": "price_PLACEHOLDER_PASTE_LATER",
  "heroHeading": string,
  "heroSubhead": string,
  "whoItsFor": string[],
  "whatYoullLearn": string[],
  "assessmentConfig": {
    "questionCount": number,        // 20 for fundamentals, 25 for claude code, 30 for agents
    "passMarkPercent": 70,
    "retakeCooldownHours": 24,
    "lessonCheckQuestionsPer": number,    // 3 for fundamentals & claude code, 2 for agents
    "moduleReviewQuestionsPer": 5
  },
  "modules": [
    {
      "number": 1,
      "title": string,
      "lessons": [
        { "slug": string, "title": string, "minutes": number, "htmlPath": string, "isReview"?: true }
      ]
    }
  ],
  "assessmentHtmlPath": string,
  "certificateHtmlPath": string
}

=============================================================
MANIFEST 1 — /content/courses/ai-fundamentals.json
=============================================================

{
  "slug": "ai-fundamentals",
  "title": "AI Fundamentals: From Zero to Confident",
  "subtitle": "The fundamentals every professional needs, without the hype.",
  "level": "Beginner",
  "duration": "~3 hours",
  "lessonCount": 12,
  "moduleCount": 4,
  "price": 29.99,
  "priceDisplay": "$29.99",
  "stripePriceId": "price_PLACEHOLDER_PASTE_LATER",
  "heroHeading": "Finally understand AI — without the hype, in one weekend",
  "heroSubhead": "Twelve short written lessons that take you from confused onlooker to confident user. No jargon. No fluff. Just the foundations that make everything else make sense.",
  "whoItsFor": [
    "Non-technical professionals who feel left behind by AI",
    "Business owners who want to use AI properly, not just dabble",
    "Consultants and freelancers looking to build real AI skills",
    "Readers — people who'd rather read a well-crafted lesson than watch a rambling video"
  ],
  "whatYoullLearn": [
    "How AI actually works under the hood (plain English, no maths)",
    "How to write prompts that produce good output",
    "When to trust AI output and when to verify it",
    "How to pick the right AI tool for the job",
    "Privacy, hype, and the habits of professional AI users"
  ],
  "assessmentConfig": {
    "questionCount": 20,
    "passMarkPercent": 70,
    "retakeCooldownHours": 24,
    "lessonCheckQuestionsPer": 3,
    "moduleReviewQuestionsPer": 5
  },
  "modules": [
    {
      "number": 1,
      "title": "What AI actually is",
      "lessons": [
        { "slug": "lesson-1-1", "title": "What AI actually is, in one minute", "minutes": 6, "htmlPath": "/content/ai-fundamentals/lesson-1-1.html" },
        { "slug": "lesson-1-2", "title": "The family tree of AI terms", "minutes": 7, "htmlPath": "/content/ai-fundamentals/lesson-1-2.html" },
        { "slug": "lesson-1-3", "title": "What AI is good at vs terrible at", "minutes": 6, "htmlPath": "/content/ai-fundamentals/lesson-1-3.html" },
        { "slug": "module-1-review", "title": "Module 1 review", "minutes": 3, "htmlPath": "/content/ai-fundamentals/module-1-review.html", "isReview": true }
      ]
    },
    {
      "number": 2,
      "title": "How AI actually works",
      "lessons": [
        { "slug": "lesson-2-1", "title": "How LLMs actually predict words", "minutes": 7, "htmlPath": "/content/ai-fundamentals/lesson-2-1.html" },
        { "slug": "lesson-2-2", "title": "The context window", "minutes": 7, "htmlPath": "/content/ai-fundamentals/lesson-2-2.html" },
        { "slug": "lesson-2-3", "title": "Why outputs feel generic — and the fix", "minutes": 7, "htmlPath": "/content/ai-fundamentals/lesson-2-3.html" },
        { "slug": "module-2-review", "title": "Module 2 review", "minutes": 3, "htmlPath": "/content/ai-fundamentals/module-2-review.html", "isReview": true }
      ]
    },
    {
      "number": 3,
      "title": "Working with AI well",
      "lessons": [
        { "slug": "lesson-3-1", "title": "The ROLE / CONTEXT / TASK pattern", "minutes": 7, "htmlPath": "/content/ai-fundamentals/lesson-3-1.html" },
        { "slug": "lesson-3-2", "title": "When to trust AI output — and when not to", "minutes": 6, "htmlPath": "/content/ai-fundamentals/lesson-3-2.html" },
        { "slug": "lesson-3-3", "title": "The 3 ways people waste time with AI", "minutes": 6, "htmlPath": "/content/ai-fundamentals/lesson-3-3.html" },
        { "slug": "module-3-review", "title": "Module 3 review", "minutes": 3, "htmlPath": "/content/ai-fundamentals/module-3-review.html", "isReview": true }
      ]
    },
    {
      "number": 4,
      "title": "Smart AI decisions",
      "lessons": [
        { "slug": "lesson-4-1", "title": "Claude vs ChatGPT vs Gemini — which one, when?", "minutes": 6, "htmlPath": "/content/ai-fundamentals/lesson-4-1.html" },
        { "slug": "lesson-4-2", "title": "Privacy, and what NOT to paste into AI", "minutes": 6, "htmlPath": "/content/ai-fundamentals/lesson-4-2.html" },
        { "slug": "lesson-4-3", "title": "How to spot AI hype and misinformation", "minutes": 6, "htmlPath": "/content/ai-fundamentals/lesson-4-3.html" },
        { "slug": "module-4-review", "title": "Module 4 review", "minutes": 3, "htmlPath": "/content/ai-fundamentals/module-4-review.html", "isReview": true }
      ]
    }
  ],
  "assessmentHtmlPath": "/content/ai-fundamentals/final-assessment.html",
  "certificateHtmlPath": "/content/ai-fundamentals/certificate.html"
}

=============================================================
MANIFEST 2 — /content/courses/claude-code-mastery.json
=============================================================

{
  "slug": "claude-code-mastery",
  "title": "Claude Code: Setup, Workflow & Mastery",
  "subtitle": "The most powerful AI tool most business owners don't know they can use — without writing a single line of code.",
  "level": "Intermediate",
  "duration": "~3 hours",
  "lessonCount": 16,
  "moduleCount": 4,
  "price": 39.99,
  "priceDisplay": "$39.99",
  "stripePriceId": "price_PLACEHOLDER_PASTE_LATER",
  "heroHeading": "Install Claude Code. Automate the work that eats your week.",
  "heroSubhead": "In 16 short written lessons, you'll set up Claude Code, run your first automation, and build the confidence to use it for real work in your business. No coding required — just the patience to do it properly.",
  "whoItsFor": [
    "Business owners who've plateaued on ChatGPT and want real automation",
    "Professionals who spend hours on repetitive document or data work",
    "Consultants who want to deliver more without hiring help",
    "Anyone who's heard of Claude Code but was scared off by the name"
  ],
  "whatYoullLearn": [
    "Install Claude Code via the friendlier VS Code path",
    "Organise files, process PDFs, and clean spreadsheets in bulk",
    "Write a CLAUDE.md file that turns Claude Code into a colleague who knows your business",
    "Build reusable Skills and schedule workflows to run while you sleep",
    "Know when Claude Code is the right tool — and when it isn't"
  ],
  "assessmentConfig": {
    "questionCount": 25,
    "passMarkPercent": 70,
    "retakeCooldownHours": 24,
    "lessonCheckQuestionsPer": 3,
    "moduleReviewQuestionsPer": 5
  },
  "modules": [
    {
      "number": 1,
      "title": "Getting Claude Code onto your computer",
      "lessons": [
        { "slug": "lesson-1-1", "title": "What Claude Code actually is (and why non-coders should care)", "minutes": 7, "htmlPath": "/content/claude-code-mastery/lesson-1-1.html" },
        { "slug": "lesson-1-2", "title": "Installing Claude Code the easy way", "minutes": 9, "htmlPath": "/content/claude-code-mastery/lesson-1-2.html" },
        { "slug": "lesson-1-3", "title": "Your first useful thing — organising a messy folder", "minutes": 7, "htmlPath": "/content/claude-code-mastery/lesson-1-3.html" },
        { "slug": "lesson-1-4", "title": "Safety first — what to never let Claude Code do", "minutes": 8, "htmlPath": "/content/claude-code-mastery/lesson-1-4.html" },
        { "slug": "module-1-review", "title": "Module 1 review", "minutes": 3, "htmlPath": "/content/claude-code-mastery/module-1-review.html", "isReview": true }
      ]
    },
    {
      "number": 2,
      "title": "The core workflow (how Claude Code actually thinks)",
      "lessons": [
        { "slug": "lesson-2-1", "title": "The project folder is everything", "minutes": 7, "htmlPath": "/content/claude-code-mastery/lesson-2-1.html" },
        { "slug": "lesson-2-2", "title": "Meet CLAUDE.md — your project's memory", "minutes": 9, "htmlPath": "/content/claude-code-mastery/lesson-2-2.html" },
        { "slug": "lesson-2-3", "title": "Describing what you want (the new prompting)", "minutes": 8, "htmlPath": "/content/claude-code-mastery/lesson-2-3.html" },
        { "slug": "lesson-2-4", "title": "When Claude Code does it wrong (iteration and feedback)", "minutes": 7, "htmlPath": "/content/claude-code-mastery/lesson-2-4.html" },
        { "slug": "module-2-review", "title": "Module 2 review", "minutes": 3, "htmlPath": "/content/claude-code-mastery/module-2-review.html", "isReview": true }
      ]
    },
    {
      "number": 3,
      "title": "Real business workflows (what to actually automate)",
      "lessons": [
        { "slug": "lesson-3-1", "title": "Processing documents in bulk", "minutes": 8, "htmlPath": "/content/claude-code-mastery/lesson-3-1.html" },
        { "slug": "lesson-3-2", "title": "Turning messy data into clean reports", "minutes": 8, "htmlPath": "/content/claude-code-mastery/lesson-3-2.html" },
        { "slug": "lesson-3-3", "title": "Research workflows — from question to answer in minutes", "minutes": 8, "htmlPath": "/content/claude-code-mastery/lesson-3-3.html" },
        { "slug": "lesson-3-4", "title": "Drafting at scale (content production workflows)", "minutes": 8, "htmlPath": "/content/claude-code-mastery/lesson-3-4.html" },
        { "slug": "module-3-review", "title": "Module 3 review", "minutes": 3, "htmlPath": "/content/claude-code-mastery/module-3-review.html", "isReview": true }
      ]
    },
    {
      "number": 4,
      "title": "Becoming powerful with Claude Code",
      "lessons": [
        { "slug": "lesson-4-1", "title": "Skills — teaching Claude Code your repeatable processes", "minutes": 8, "htmlPath": "/content/claude-code-mastery/lesson-4-1.html" },
        { "slug": "lesson-4-2", "title": "Scheduling — making work happen while you sleep", "minutes": 8, "htmlPath": "/content/claude-code-mastery/lesson-4-2.html" },
        { "slug": "lesson-4-3", "title": "When Claude Code is the wrong tool", "minutes": 7, "htmlPath": "/content/claude-code-mastery/lesson-4-3.html" },
        { "slug": "lesson-4-4", "title": "Your 30-day Claude Code plan", "minutes": 7, "htmlPath": "/content/claude-code-mastery/lesson-4-4.html" },
        { "slug": "module-4-review", "title": "Module 4 review", "minutes": 3, "htmlPath": "/content/claude-code-mastery/module-4-review.html", "isReview": true }
      ]
    }
  ],
  "assessmentHtmlPath": "/content/claude-code-mastery/final-assessment.html",
  "certificateHtmlPath": "/content/claude-code-mastery/certificate.html"
}

=============================================================
MANIFEST 3 — /content/courses/ai-agents-workflows.json
=============================================================

{
  "slug": "ai-agents-workflows",
  "title": "Building AI Agents & Workflows",
  "subtitle": "Most AI courses teach you to build demos. This one teaches you to build systems that stay running.",
  "level": "Advanced",
  "duration": "~4 hours",
  "lessonCount": 16,
  "moduleCount": 4,
  "price": 99,
  "priceDisplay": "$99",
  "stripePriceId": "price_PLACEHOLDER_PASTE_LATER",
  "heroHeading": "Three working AI systems in your business — by the end of the course",
  "heroSubhead": "Sixteen short written lessons. Three real systems you build and keep running. Workflows vs agents, tool choice, guardrails, debugging, and the maintenance reality most courses skip. No code. No hype.",
  "whoItsFor": [
    "Business owners and operations leads ready to go beyond one-off prompts",
    "Consultants and professionals who already automate with Zapier, Make, or n8n",
    "Anyone who's finished AI Fundamentals and Claude Code and wants the next level",
    "Builders who want real systems in production, not more demos"
  ],
  "whatYoullLearn": [
    "The difference between workflows and agents — and when to use each",
    "The minimum viable stack for non-coders (n8n + Claude + your business tools)",
    "How to build three real systems: email triage, research agent, meeting-to-task automation",
    "Error handling, logging, guardrails, and kill switches that make systems trustworthy",
    "The maintenance reality: keeping systems running over time"
  ],
  "assessmentConfig": {
    "questionCount": 30,
    "passMarkPercent": 70,
    "retakeCooldownHours": 24,
    "lessonCheckQuestionsPer": 2,
    "moduleReviewQuestionsPer": 5
  },
  "modules": [
    {
      "number": 1,
      "title": "Workflows vs. agents — what you're actually building",
      "lessons": [
        { "slug": "lesson-1-1", "title": "Workflows vs. agents — know the difference", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-1-1.html" },
        { "slug": "lesson-1-2", "title": "What actually delivers ROI (and what doesn't)", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-1-2.html" },
        { "slug": "lesson-1-3", "title": "Your stack: n8n, Claude, and the minimum viable toolkit", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-1-3.html" },
        { "slug": "lesson-1-4", "title": "Getting n8n running in 15 minutes", "minutes": 10, "htmlPath": "/content/ai-agents-workflows/lesson-1-4.html" },
        { "slug": "module-1-review", "title": "Module 1 review", "minutes": 3, "htmlPath": "/content/ai-agents-workflows/module-1-review.html", "isReview": true }
      ]
    },
    {
      "number": 2,
      "title": "Build your first workflow",
      "lessons": [
        { "slug": "lesson-2-1", "title": "Anatomy of a workflow: triggers, nodes, actions", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-2-1.html" },
        { "slug": "lesson-2-2", "title": "Build #1: Email triage workflow", "minutes": 12, "htmlPath": "/content/ai-agents-workflows/lesson-2-2.html" },
        { "slug": "lesson-2-3", "title": "Debugging when things go wrong", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-2-3.html" },
        { "slug": "lesson-2-4", "title": "Making it bulletproof: error handling and logging", "minutes": 10, "htmlPath": "/content/ai-agents-workflows/lesson-2-4.html" },
        { "slug": "module-2-review", "title": "Module 2 review", "minutes": 3, "htmlPath": "/content/ai-agents-workflows/module-2-review.html", "isReview": true }
      ]
    },
    {
      "number": 3,
      "title": "Build your first agent",
      "lessons": [
        { "slug": "lesson-3-1", "title": "What makes an agent different", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-3-1.html" },
        { "slug": "lesson-3-2", "title": "Build #2: Research agent", "minutes": 12, "htmlPath": "/content/ai-agents-workflows/lesson-3-2.html" },
        { "slug": "lesson-3-3", "title": "Giving agents memory and context", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-3-3.html" },
        { "slug": "lesson-3-4", "title": "Guardrails — keeping agents in their lane", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-3-4.html" },
        { "slug": "module-3-review", "title": "Module 3 review", "minutes": 3, "htmlPath": "/content/ai-agents-workflows/module-3-review.html", "isReview": true }
      ]
    },
    {
      "number": 4,
      "title": "Beyond building: connecting, scaling, knowing when to stop",
      "lessons": [
        { "slug": "lesson-4-1", "title": "Build #3: Connecting AI to your real business tools", "minutes": 12, "htmlPath": "/content/ai-agents-workflows/lesson-4-1.html" },
        { "slug": "lesson-4-2", "title": "Multi-agent systems: when they make sense (and when they don't)", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-4-2.html" },
        { "slug": "lesson-4-3", "title": "Running AI systems over time: the maintenance reality", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-4-3.html" },
        { "slug": "lesson-4-4", "title": "Your agent portfolio: the 30/60/90 plan", "minutes": 9, "htmlPath": "/content/ai-agents-workflows/lesson-4-4.html" },
        { "slug": "module-4-review", "title": "Module 4 review", "minutes": 3, "htmlPath": "/content/ai-agents-workflows/module-4-review.html", "isReview": true }
      ]
    }
  ],
  "assessmentHtmlPath": "/content/ai-agents-workflows/final-assessment.html",
  "certificateHtmlPath": "/content/ai-agents-workflows/certificate.html"
}

=============================================================
IMPORTANT — WRITE ALL THREE MANIFESTS IN FULL
=============================================================

Write each JSON file to /content/courses/ using the structures above verbatim. These manifests drive the entire course system — the listing page, the detail pages, the learning area sidebar, and the assessment gating all read from these files.

LAYOUTS:

/courses (listing page):
- Hero with heading "Learn AI as a craft, not a checklist" and short subhead
- Filter bar: level (All / Beginner / Intermediate / Advanced), search box (UI-only for now)
- Grid of course cards. Each card:
  - Thin emerald accent bar on the left
  - Level badge
  - Title in Fraunces
  - 2-line description
  - Module count · Lesson count · Duration
  - Price
  - "Learn more →" button
- Cards link to /courses/[slug]

/courses/[slug] (course detail):
- Server component. Load the course JSON.
- If signed in: also look up enrolment status.
- Hero (dark bg):
  - Breadcrumb: Courses / {course title}
  - Level badge
  - Title (Fraunces display)
  - Subtitle
  - Stats row: Module count · Lesson count · Duration · Format "Text + interactive"
  - EnrollButton (price + CTA) — shows "Already enrolled — Go to course →" if enrolment exists
- "Who it's for" section — 3-4 items, check-icon list
- "What you'll learn" section — bulleted list
- Module curriculum — accordion, each module expands to show lesson titles + minutes
- "How this course works" — short explainer:
  "Read the lesson. Do the short interactive exercise inside it. Take the quick 3-question check. Move on. Module reviews unlock the next module. A final assessment unlocks your certificate."
- FAQ accordion (6-8 questions)
- Sticky CTA on mobile: EnrollButton fixed to bottom

git add . && git commit -m "Phase 3: courses listing + detail pages + manifests" && git push
```

---

## Phase 4: Certification and AI-level Assessment pages

```
Build /certification (the certification information page) and /assessment (the interactive quiz).

=============================================================
PART A — /certification page
=============================================================

Marketing page about the AICraft certification programme.

- Hero: "AICraft Certified — proof of real AI capability"
- 3-card section: how certification works
  1. "Complete the course" — "Finish every lesson and module review"
  2. "Pass the final assessment" — "70% or higher on the course's final assessment"
  3. "Earn a verifiable certificate" — "Publicly linkable, employer-verifiable"
- Visual "How It Works" flow: Register → Study → Assess → Certify → Share
- Verify an existing certificate: input field + button. Submitting redirects to /certificate/[id].
  Note: "All certificates are verifiable at aicraftlearning.com/verify"
- FAQ accordion (5-6 questions about certifications)

=============================================================
PART B — /assessment (AI-level discovery quiz)
=============================================================

This is an interactive tool that helps visitors pick the right course. It's a hero-conversion page — probably the most-visited route on the site after the homepage.

IMPLEMENTATION:
The HTML file already exists at /public/assessment/discover-your-ai-level.html. Do NOT reauthor it. Just embed it.

NEXT.JS SHELL at /app/assessment/page.tsx:

Simple page that embeds the HTML file in an iframe:

```tsx
export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <header className="mb-6">
          <h1 className="font-display text-3xl text-deep-green">Discover your AI level</h1>
          <p className="text-text-muted">Takes about 5 minutes. Personalised course recommendation at the end.</p>
        </header>
        <iframe 
          src="/assessment/discover-your-ai-level.html"
          className="w-full h-[calc(100vh-14rem)] border-0 rounded-xl shadow-sm bg-white"
          title="AI Level Assessment"
        />
      </div>
    </div>
  );
}
```

The iframe's "Start learning →" button emits a postMessage of type `aicraft:assessment-recommendation` with the recommended course slugs. The Next.js parent listens and navigates to /courses with the recommendation pre-applied.

Add a `useEffect` listener to the page (convert to client component via "use client"):

```typescript
useEffect(() => {
  function onMessage(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;
    const data = event.data;
    if (data?.type === 'aicraft:assessment-recommendation') {
      const top = data.recommendedCourses?.[0];
      if (top) {
        router.push(`/courses?recommended=${encodeURIComponent(top)}`);
      } else {
        router.push('/courses');
      }
    }
  }
  window.addEventListener('message', onMessage);
  return () => window.removeEventListener('message', onMessage);
}, [router]);
```

BEFORE DECLARING DONE:
- Assessment page loads the HTML file correctly
- All three levels are selectable
- Quiz completes end-to-end for each level
- Results page shows radar chart + recommendation
- Postmessage from "Start learning →" navigates to /courses

git add . && git commit -m "Phase 4: certification + assessment pages" && git push
```

---

## Phase 5: For Business page

```
Build /for-business — enterprise offerings.

Hero: "AI training that actually lands with your team"
Subhead: "Most corporate AI training is generic. Ours is text-based, tool-specific, and built around the actual work your team does."

Four service tiers (card grid):
1. Team course licences — bulk seats on any course
2. Custom course creation — bespoke text-based content for your team's stack
3. AIOS for Business — flagship programme, tailored
4. Workshop & strategy engagements — half-day / full-day formats

AIOS for Business spotlight band:
- Dark background
- "The AIOS programme, adapted for your business"
- 3-step process: Discovery → Build → Embed
- "Get in touch →" CTA links to /contact with ?subject=aios-business

Four-step process section:
Discover → Design → Deliver → Measure

Three placeholder case studies (card format, no photos):
- Industry label, company-size label, outcome headline, 2-sentence summary

Enterprise contact form:
- Company Name, Your Name, Email, Team Size dropdown (1-10, 11-50, 51-200, 200+), Message
- UI only — submits to a placeholder thank-you state

Reminders:
- "Custom course creation for your team (text-based interactive lessons, delivered through the same platform)"  — NOT video
- UI only — no backend yet

git add . && git commit -m "Phase 5: for-business page" && git push
```

---

## Phase 6: AIOS Mastery Program page

```
Build /aios-program — the flagship programme page.

Hero:
- Eyebrow: "The flagship programme"
- Headline: "Run your business with an AI operating system."
- Subhead: "Most people bolt AI onto existing workflows. AIOS teaches you to run your work through one."
- Stats row: "3 Phases · 7 Modules · 0 Code Required"  (3 items only — NO "8 Weeks")
- Primary CTA: EnrollButton courseSlug="aios-mastery"
- Secondary: "Book a discovery call →"

Sections:
1. "What is an AIOS" — plain-language explainer, ~150 words
2. Five-layer stack visual — illustrated (SVG, emerald palette, not stock imagery)
3. "The craft difference" — 2-column comparison:
   Left: "Most AI training", Right: "The AICraft way"
   6-8 paired rows
4. Curriculum accordion — 7 modules, each with 3-5 lesson titles and a 1-sentence module summary
5. Tool stack chips — Claude, Claude Code, Make, Zapier, Notion, Airtable (etc.) as labelled chips with lucide icons
6. "Who this is for" — 2-column card grid
   "This is for you if…" / "This isn't for you if…"
7. Value ladder diagram — how AI Fundamentals → Claude Code → AIOS stack together
8. Pricing card — single tier with what's included list, payment options (one-time / monthly), FAQ strip
9. FAQ accordion — 8-10 questions

Pull data from /content/aios-program.json. Generate a reasonable skeleton for the JSON if not provided — use [PLACEHOLDER] markers for any content the user will need to write.

git add . && git commit -m "Phase 6: AIOS program page" && git push
```

---

## Phase 7: Student dashboard, lesson viewer, assessment, certificate (THE BIG ONE)

```
Build the authenticated learning area at /learn.

ARCHITECTURE:
- Next.js owns: dashboard, course home, lesson shell (sidebar + iframe wrapper), assessment shell, certificate shell, all progress tracking, all API routes.
- HTML files own: actual lesson content, interactive widgets, quizzes, assessment questions, certificate name-entry and rendering.
- The two communicate via window.postMessage events.

The 62 HTML files across three courses are already in /public/content/. They were written in earlier sessions and are hand-crafted — do NOT rewrite, reformat, or "improve" them.

File locations (confirm these exist):
/public/content/ai-fundamentals/       — 18 files (12 lessons + 4 reviews + final-assessment + certificate)
/public/content/claude-code-mastery/   — 22 files (16 lessons + 4 reviews + final-assessment + certificate)
/public/content/ai-agents-workflows/   — 22 files (16 lessons + 4 reviews + final-assessment + certificate)

=============================================================
PART 1 — /learn dashboard
=============================================================

Server component.
- auth() → getOrCreateUser → list enrolments
- For each enrolment: compute progress (completed / total lessons including reviews), most-recent lastRead, certificate existence.

Layout:
- Welcome header: "Welcome back, {firstName from Clerk}." "Pick up where you left off."
- "Continue learning" card (dark bg): most-recent-activity course, next incomplete lesson title, "Resume →" button
- Grid of enrolled courses:
  - Title, level badge, "Text-based · self-paced", progress bar, "X of Y lessons complete", "Go to course →"
  - If certificate earned: green "Certified ✓" pill + "View certificate →"
- Empty state (no enrolments): "You haven't enrolled in a course yet." + "Browse courses →"

=============================================================
PART 2 — /learn/[courseSlug] (course home)
=============================================================

Server component.
- Auth + enrolment check. If not enrolled: render "Not enrolled" state with EnrollButton. Do NOT 404.
- Load course manifest JSON + LessonProgress rows + assessment status + certificate status.

Layout:
- Breadcrumb: My Learning / {course title}
- Overall progress bar + lesson counts
- Module-by-module list:
  - Module heading
  - Lesson rows: completion circle · title · minutes · Start/Review link
  - Next incomplete lesson: "Resume here" pill
  - Module review row at the end of each module, visually distinct (smaller pill "REVIEW")
- Final assessment card at the bottom, three states:
  - LOCKED: "Finish all {lessonCount} lessons and {moduleCount} module reviews to unlock the final assessment." (read from manifest)
  - AVAILABLE: "You've completed the course. Time to earn your certificate." + "Start the assessment →"
  - PASSED: green, date + "View certificate →"

=============================================================
PART 3 — /learn/[courseSlug]/[lessonSlug] (lesson viewer)
=============================================================

Server component at /app/learn/[courseSlug]/[lessonSlug]/page.tsx:
1. Auth + enrolment check. If not enrolled: redirect to /courses/[courseSlug].
2. Load course manifest. Find the lesson by slug. If not found: 404.
3. Call setLastRead(userId, courseSlug, lessonSlug).
4. Pass data to a client LessonViewer.

Client LessonViewer.tsx ("use client"):
- Layout: 2-column on desktop, drawer on mobile.
  LEFT SIDEBAR (280px sticky):
    - Course title, overall progress bar
    - Collapsible modules with lesson lists, completion circles, current-lesson highlight
    - Review lessons with REVIEW pill
    - Final assessment entry at bottom (locked / unlocked / passed)
    - "Back to My Learning" link at top
  MAIN COLUMN:
    - Top meta strip: "Lesson 2.1 · Module 2 · 6 min" on left, "Next: Lesson 2.2 →" on right (if next exists)
    - IFRAME with:
      - src={currentLesson.htmlPath}
      - className="w-full h-[calc(100vh-10rem)] border-0 rounded-lg bg-white"
      - sandbox="allow-scripts allow-same-origin"
      - title={currentLesson.title}
    - Below iframe: nothing. Navigation is inside the iframe.

- postMessage listener for completion:
  ```typescript
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (data?.type === 'aicraft:lesson-complete') {
        fetch('/api/progress/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseSlug,
            lessonSlug: data.lessonSlug || currentLessonSlug,
            score: data.score,
            total: data.total,
          }),
        }).then(() => router.refresh());
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [courseSlug, currentLessonSlug]);
  ```

API route /api/progress/complete (POST, auth required via layout, also validated in handler):
- Accepts { courseSlug, lessonSlug, score, total }
- Upserts LessonProgress with completed=true
- Idempotent — calling twice doesn't double-record
- Returns { ok, progress }

=============================================================
PART 4 — /learn/[courseSlug]/assessment (final assessment)
=============================================================

Gated: only accessible after ALL lessons AND ALL module reviews complete AND no existing certificate AND canRetake.

Server component redirects to /learn/[courseSlug] if gates aren't met.

Client side:
- Same sidebar layout as lesson viewer
- Main column: iframe embedding courseManifest.assessmentHtmlPath
- postMessage listener for type `aicraft:assessment-complete`
- On receive:
  - POST to /api/assessment/submit with the data
  - Server validates, writes AssessmentAttempt row
  - If passed and no existing certificate: call issueCertificate (idempotent)
  - Returns { passed, verificationId?, canRetake, hoursUntilRetake }
- After server response:
  - If passed: redirect to /learn/[courseSlug]/certificate
  - If failed: show retake-in-24h state inline

API /api/assessment/submit (POST, auth required):
- Accepts { courseSlug, answers, score, total, passed }
- Computes authoritative score server-side
- If passed (>=70%) and no Certificate exists: create Certificate row with verificationId:
  - ai-fundamentals → `AICL-FUND-XXXX-XXXX`
  - claude-code-mastery → `AICL-CODE-XXXX-XXXX`
  - ai-agents-workflows → `AICL-AGNT-XXXX-XXXX`
- Enforce retake cooldown: 24h since last failed attempt
- Returns { passed, verificationId?, canRetake, hoursUntilRetake }

API /api/assessment/status?courseSlug=X (GET, auth required):
- Returns { allLessonsComplete, canRetake, hoursUntilRetake, hasCertificate, verificationId }

=============================================================
PART 5 — Certificate pages
=============================================================

/learn/[courseSlug]/certificate (authenticated):
- Load Certificate row for (userId, courseSlug). If none: redirect to /learn/[courseSlug].
- Render the certificate.html in an iframe, passing learner name + issue date via query string:
  src={`${courseManifest.certificateHtmlPath}?name=${encodeURIComponent(firstName + ' ' + lastName)}&date=${issuedAt}&id=${verificationId}`}
  (firstName/lastName come from Clerk — NOT from the User table)
- Banner above iframe: "Share this certificate with employers: https://aicraftlearning.com/certificate/[verificationId]" + "Copy link" + "Download PDF" buttons

/certificate/[verificationId] (PUBLIC — no auth):
- Look up Certificate by verificationId.
- If not found: clean "Certificate not found or invalid" page with "Verify another" CTA.
- If found: server-rendered (for Open Graph + SEO), clean white layout:
  - Logo top centre (aicraft-logo-primary.svg)
  - "Certificate of Completion" heading
  - Learner name (Fraunces display)
  - Course title (deep green)
  - Date of completion
  - Thin emerald divider
  - Verification ID (monospace) + "Copy link" button
  - "Issued by AICraft Learning" signature mark bottom right
- @media print CSS: hide nav + footer, clean PDF export
- Social meta tags for LinkedIn previews

NOTE: The public certificate page is Next.js-rendered, NOT iframe. This is critical for LinkedIn / Twitter preview tags to work correctly.

=============================================================
PART 6 — IMPORTANT HTML FILE PATCH
=============================================================

The 62 HTML files currently track quiz + action completion internally but don't emit postMessage events. Do this automatically via a script — don't edit each file by hand.

Create scripts/patch-html-lessons.js that processes files inside:
- /public/content/ai-fundamentals/
- /public/content/claude-code-mastery/
- /public/content/ai-agents-workflows/

For each file:
1. Check if the file already has `aicraft:lesson-complete` or `aicraft:assessment-complete` — if yes, skip (idempotent).
2. For lesson files (lesson-*.html) and module reviews (module-*-review.html), inject a completion notifier that posts `aicraft:lesson-complete` when quiz done + action box ticked + score >= 60%.
3. For final-assessment.html files, inject a notifier that posts `aicraft:assessment-complete` when the results screen shows.
4. For certificate.html files, no patch needed.
5. For the /public/assessment/discover-your-ai-level.html, the postMessage for `aicraft:assessment-recommendation` should already be there — verify and add if missing.

Run the patch script. Log which files were modified vs skipped.

=============================================================
CHECKS BEFORE DECLARING PHASE 7 DONE
=============================================================

Walk through each scenario manually on the Railway preview URL:
- Unauthenticated → /learn redirects to /sign-in
- Unauthenticated → /certificate/fake-id → "not found" page (no 500)
- Signed in, no enrolments → empty dashboard
- Enrolled user: dashboard → course home → lesson → interact → lesson auto-marks complete → next lesson appears active → complete a module → review appears → complete review → module 2 unlocks
- Complete all lessons + reviews → final assessment unlocks
- Take assessment, pass → certificate issued, redirect works
- Public /certificate/[id] loads, og-tags correct, print-to-PDF clean
- Failed attempt: 24h cooldown shown
- Retake after 24h: allowed
- Passing twice: no duplicate Certificate row (idempotent)
- Mobile: sidebar → drawer, iframe fills width
- Browser console: no CORS errors, no postMessage origin warnings, no hydration mismatches

Run npm run build and npm run lint. Fix all errors.

git add . && git commit -m "Phase 7: learning experience, assessment, certificates" && git push
```

---

## Phase 8: About page

```
Build /about.

Hero:
- Eyebrow: "About AICraft Learning"
- Headline: "AI proficiency is a craft. We teach it that way."

"Our story" section:
"We believe everyone should be able to use AI confidently — not just developers. AICraft Learning was founded to close the gap between AI hype and real-world AI skills. The name is deliberate: craft, not magic. Practice, not shortcuts."

"Our approach" — visual 4-step:
Understand → Practice → Build → Apply

"What makes us different":
- Every AICraft Learning course is built around clear, text-based lessons you can read at your own pace, hands-on exercises you do alongside the material, and real-world projects you can apply immediately.
- Text-first. Tool-specific (Claude, Claude Code, Make, etc.).
- No generic "AI for everyone" filler. We teach you to use the actual tools professionals use.

Founder section — single founder card:
- Photo: /public/team/khuram.jpg (placeholder "KS" on emerald circle for now, 160px)
- Name: Khuram Shahzad
- Title: Founder
- Bio (3 paragraphs, conversational):
  "I've spent more than 10 years working with AI, and I hold a PhD in AI and Robotics. I've watched the field go from something only researchers cared about to something every professional is suddenly expected to master — overnight, without a guide.

  I started AICraft Learning because most of what's being taught right now is noise. Tool-of-the-week tutorials. Agency-hustle pitches. Surface-level prompts that leave you exactly where you started. None of it teaches the thing that actually matters: how to make AI work for your specific business, your specific work, your specific context.

  That's what I teach here. The craft of building AI systems that actually know what you're doing. No coding required — just the patience to do the work properly."
- Social: LinkedIn + X/Twitter icons (lucide-react), placeholder URLs
- Layout: centred, ~640px max-width. Photo left, name/title/bio/socials right. Stacks on mobile.

Values section — 4 cards:
- Craft over theory
- Always current
- Accessible to all
- Community first

git add . && git commit -m "Phase 8: about page" && git push
```

---

## Phase 9: Contact page

```
Build /contact.

Hero:
- Headline: "Let's talk."
- Subhead: "Course questions, corporate enquiries, or just a hello — we reply within 24 hours."

Contact form:
- Name, Email, Phone (optional)
- Subject dropdown: General / Course Question / AIOS Program / Assessment / Corporate / Certification / Partnership
- Message textarea
- Client-side validation
- UI-only success state ("Thanks — we'll reply within 24 hours.")

Contact info:
- hello@aicraftlearning.com (general)
- enterprise@aicraftlearning.com (business / corporate)
- support@aicraftlearning.com (student support)

Social icons.

"Book a free consultation" section: placeholder calendar embed spot (div with placeholder text and "Coming soon" pill).

FAQ accordion (10 questions): technical experience, tools taught, self-paced, corporate training, text courses, certificates, refunds, custom content, which course, update frequency.

git add . && git commit -m "Phase 9: contact page" && git push
```

---

## Phase 10: Polish & Railway production deployment

```
Final polish pass and Railway production setup.

1. PERFORMANCE:
   - next/image everywhere with proper sizing
   - Lazy-load below-the-fold sections
   - Check bundle size: npm run build → under 200KB First Load JS per route

2. SEO:
   - Unique <title> and <meta description> on every page (generateMetadata)
   - Open Graph tags (og:title, og:description, og:image)
   - Twitter card tags
   - JSON-LD structured data: Organization on /, Course on /courses/[slug]
   - /app/sitemap.ts auto-generates sitemap — include /, /courses, /courses/[slug], /aios-program, /certification, /assessment, /for-business, /about, /contact. Exclude /learn/*, /api/*, /sign-in, /sign-up.
   - /app/robots.ts — disallow /learn, /api, /sign-in, /sign-up

3. ACCESSIBILITY:
   - Heading hierarchy correct (single h1 per page)
   - Alt text on every image
   - Keyboard navigation tested on every page
   - Visible focus states everywhere
   - ARIA labels on icon-only buttons
   - Skip-to-main-content link

4. RESPONSIVE:
   - Every page tested at 375, 768, 1280
   - No horizontal scroll at 375
   - Navbar doesn't wrap at any width

5. 404 page:
   - Custom: "Looks like this page got automated away" + search + home link
   - Matches the brand visual language

6. LOADING STATES:
   - Skeleton loaders for course cards on /courses
   - Skeleton for lesson sidebar on /learn/*

7. FAVICON:
   - From aicraft-logo-primary.svg — extract the circuit-node symbol only
   - Generate .ico, apple-touch-icon.png, android-chrome-*.png

8. SITE MANIFEST (PWA-ready placeholder).

9. ANALYTICS: add Google Analytics or Plausible (placeholder, env-var-driven).

10. SECURITY HEADERS (verify in next.config.ts):
    headers: async () => [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }]

11. NEWSLETTER COMPONENT in footer (placeholder backend).

12. COOKIE CONSENT banner placeholder.

13. RAILWAY PRODUCTION SETUP:
    - Verify all env vars are set in Railway's Variables dashboard (10 total):
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      - CLERK_SECRET_KEY
      - NEXT_PUBLIC_CLERK_SIGN_IN_URL (/sign-in)
      - NEXT_PUBLIC_CLERK_SIGN_UP_URL (/sign-up)
      - NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL (/learn)
      - NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL (/learn)
      - DATABASE_URL
      - STRIPE_SECRET_KEY (sk_test_...)
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_test_...)
      - STRIPE_WEBHOOK_SECRET (to be set after webhook is configured)
    
    - Add railway.json to project root if not present:
      ```json
      {
        "$schema": "https://railway.app/railway.schema.json",
        "build": { "builder": "NIXPACKS" },
        "deploy": {
          "startCommand": "npm start",
          "restartPolicyType": "ON_FAILURE",
          "restartPolicyMaxRetries": 3
        }
      }
      ```

14. CUSTOM DOMAIN (user does this manually):
    - Railway → Project → Settings → Domains → Custom Domain → Enter `aicraftlearning.com`
    - Railway provides a CNAME target like `xxx.up.railway.app`
    - In Hostinger DNS: add CNAME record pointing `aicraftlearning.com` → the Railway target
    - SSL provisions automatically within a few minutes

15. STRIPE WEBHOOK SETUP (after custom domain is live):
    - Stripe Dashboard → Developers → Webhooks → Add endpoint
    - URL: https://aicraftlearning.com/api/webhooks/stripe
    - Events: checkout.session.completed
    - Copy the signing secret → paste into Railway as STRIPE_WEBHOOK_SECRET

16. END-TO-END STRIPE TEST-MODE VERIFICATION:
    Anonymous → /courses → Enroll on AI Fundamentals ($29.99) → sign up → Stripe Checkout (test card 4242...) → webhook fires → enrolment created → /learn/ai-fundamentals → read lesson → (iframe renders, interacts, postMessage mark-complete works) → dashboard shows progress → all lessons + reviews complete → final assessment → pass → certificate issued → public /certificate/[id] works with correct og-image

Run npm run build && npm run lint. Fix all errors.

git add . && git commit -m "Phase 10: polish + Railway production setup" && git push
```

---

## After all phases: Railway deployment checklist

1. All phases already pushed to GitHub `Hafizkhuram/aicraftlearning` on `main`
2. Railway has auto-deployed each push — verify the latest deployment is green in Railway dashboard
3. Test the Railway URL (e.g. `aicraftlearning-production.up.railway.app`)
4. Run full end-to-end test listed in Phase 10, step 16
5. Add custom domain `aicraftlearning.com` via Railway → Settings → Domains
6. Configure DNS in Hostinger (CNAME record)
7. Wait for SSL provisioning (5-15 minutes after DNS propagates)
8. Test custom domain loads correctly
9. Configure Stripe webhook with production URL, paste secret into Railway
10. Final end-to-end test with real-card test purchase (refund immediately)
11. Launch

---

*Rebuild v4. Every lesson from v1, v2, and v3 is folded in. Railway replaces Vercel. Clerk is pinned to v6. Prisma schema matches the live Neon DB. HTML content is the product.*

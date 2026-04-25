import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Compass,
  Download,
  FileEdit,
  Hammer,
  LineChart,
  PenTool,
  Presentation,
  Send,
  Users,
} from "lucide-react";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { EnterpriseContactForm } from "@/components/sections/EnterpriseContactForm";
import { enterpriseEmail, siteName, siteUrl } from "@/lib/constants";

const pageTitle = "For business";
const pageDescription =
  "Text-based, tool-specific AI training for teams. Custom course creation, AIOS for Business, workshops, and volume licensing — built around the work your team actually does.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: `${siteUrl}/for-business` },
  openGraph: {
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
    url: `${siteUrl}/for-business`,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
  },
};

const serviceTiers = [
  {
    icon: Users,
    title: "Team course licences",
    body: "Bulk seats on any of our public courses. Volume pricing from 5 seats up, with an admin dashboard for your L&D lead to track progress and completion.",
  },
  {
    icon: FileEdit,
    title: "Custom course creation",
    body: "Bespoke text-based interactive lessons mapped to your team's stack and workflows. Delivered through the same platform your team already learns on. Not video.",
  },
  {
    icon: Briefcase,
    title: "AIOS for Business",
    body: "Our flagship AI operating system programme, adapted to how your business actually runs. Half cohort delivery, half embedded with your team.",
  },
  {
    icon: Presentation,
    title: "Workshop & strategy engagements",
    body: "Half-day and full-day formats. For teams who need a catalyst, a sharp diagnostic, or a strategy reset — not a full curriculum.",
  },
];

const aiosSteps = [
  {
    label: "Discover",
    body: "We map your team's tools, workflows, and the friction points where AI will actually pay back.",
  },
  {
    label: "Build",
    body: "Cohort sessions teach the AIOS method while we co-build the systems against your real work.",
  },
  {
    label: "Embed",
    body: "Embedded weeks turn the systems into habits — playbooks, owners, and a measurable ramp.",
  },
];

const deliverySteps = [
  {
    icon: Compass,
    title: "Discover",
    body: "We interview leadership and a sample of the team, audit current tooling, and surface the workflows where AI will move the most weight.",
  },
  {
    icon: PenTool,
    title: "Design",
    body: "We translate findings into a learning plan: which lessons to licence, what to customise, and how the cohort and embedded weeks fit your calendar.",
  },
  {
    icon: Hammer,
    title: "Deliver",
    body: "Cohort sessions, custom lessons in our platform, and working time on real artefacts. Your team learns by building things they would have built anyway.",
  },
  {
    icon: LineChart,
    title: "Measure",
    body: "Completion data plus a 30/60/90-day check-in on the workflows we targeted. You leave with evidence, not just a finished course.",
  },
];

const enterpriseFaqs = [
  {
    question: "How does volume pricing work?",
    answer:
      "Volume discounts kick in from 5 seats and step up at 25, 50, and 100 seats. Pricing is per seat per course, with annual all-access bundles available for 50+ seat customers. Send us your seat count and we'll come back with a quote within a business day.",
  },
  {
    question: "Is there a minimum seat count?",
    answer:
      "Five seats is the minimum for the team licensing tier. Below that, individual purchases on the public site work out the same. There is no minimum for workshops or AIOS for Business — those are scoped to the engagement, not seat count.",
  },
  {
    question: "Where is lesson content hosted, and is the data private?",
    answer:
      "All content is served from our own infrastructure on hardened cloud hosting in the EU and US. We do not share learner activity with third parties for marketing, and custom course content stays isolated to your tenant. We can sign a standard MNDA before any discovery work begins.",
  },
  {
    question: "Is single sign-on (SSO) available?",
    answer:
      "SAML SSO is on the Q3 roadmap, with Okta and Azure AD as the first integrations. Until then, we support Google and email-based sign-in plus admin-managed seat provisioning. If SSO is a hard requirement, tell us in the form and we'll confirm timing for your contract.",
  },
  {
    question: "Can the courses integrate with our existing LMS?",
    answer:
      "Yes — SCORM 1.2 export is available on request for any course you've licensed, so you can host the content inside your LMS while we still issue verifiable certificates on completion. xAPI is supported as a paid add-on.",
  },
  {
    question: "Do you invoice, or only take card payments?",
    answer:
      "Invoicing is available for orders of 10 seats or more, and is the default for AIOS for Business and workshop engagements. Standard terms are net 30. For smaller seat counts, card payment via the public site is faster.",
  },
  {
    question: "How long does a custom course take to produce?",
    answer:
      "Four to six weeks is typical from kick-off to launch for a single custom course. Discovery and outline takes a week, lesson production and review takes the bulk, and we run a quality pass with a representative learner before opening it to the wider team.",
  },
  {
    question: "Will custom courses use our branding?",
    answer:
      "Yes — within reason. We co-brand custom courses with your logo, colour palette, and a short editorial intro from a leader you nominate. The interactive lesson framework itself stays consistent so the learner experience matches what we know works.",
  },
];

export default function ForBusinessPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[var(--color-dark-bg)] text-[var(--color-text-light)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 -right-32 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.28),rgba(16,185,129,0)_65%)] blur-3xl" />
          <div className="absolute -bottom-44 -left-32 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.16),rgba(52,211,153,0)_70%)] blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-accent-green)]">
              For business
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-4 max-w-3xl font-display text-[36px] font-bold leading-[1.05] tracking-tight sm:text-[48px] lg:text-[60px]">
              AI training that actually lands with your team.
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Most corporate AI training is generic. Ours is text-based,
              tool-specific, and built around the actual work your team does.
            </p>
          </FadeIn>
          <FadeIn delay={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary-green)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)] sm:text-[15px]"
              >
                Talk to us
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
              {/* TODO: replace # with the real capabilities brief PDF asset
                  once the design team delivers it. */}
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-transparent px-6 py-3 text-sm font-semibold text-[var(--color-text-light)] transition-colors hover:border-[var(--color-accent-green)] hover:text-[var(--color-accent-green)] sm:text-[15px]"
              >
                <Download size={16} strokeWidth={2} aria-hidden="true" />
                Download the capabilities brief
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Service tiers */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              How we work with teams
            </p>
            <h2 className="accent-bar mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Four ways to close team capability gaps
            </h2>
          </FadeIn>

          <FadeInStagger className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-2">
            {serviceTiers.map(({ icon: Icon, title, body }) => (
              <FadeInItem key={title} className="h-full">
                <article
                  className="relative flex h-full flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 pl-8 dark:border-slate-800 dark:bg-[#0b1322]"
                  style={{ borderWidth: "0.5px" }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-7 bottom-7 left-3 w-[3px] rounded-full bg-[var(--color-primary-green)]"
                  />

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-light-mint)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)]">
                    <Icon
                      size={26}
                      strokeWidth={1.75}
                      className="text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-7 font-display text-xl font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                    {body}
                  </p>

                  {/* Placeholder learn-more affordance — these tiers don't have
                      individual pages yet. Phase 5 spec keeps these as #. */}
                  <a
                    href="#contact"
                    className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-green)] transition-colors hover:text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)] dark:hover:text-[var(--color-primary-green)]"
                  >
                    Learn more
                    <ArrowRight
                      size={14}
                      strokeWidth={2}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                </article>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* AIOS for Business spotlight band */}
      <section className="relative isolate overflow-hidden bg-[var(--color-dark-bg)] text-[var(--color-text-light)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.22),rgba(16,185,129,0)_65%)] blur-3xl" />
          <div className="absolute -bottom-40 left-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.14),rgba(52,211,153,0)_70%)] blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-accent-green)]">
              AIOS for Business
            </p>
            <h2 className="accent-bar mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-text-light)] sm:text-4xl">
              The AIOS programme, adapted for your business.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Half cohort, half embedded. We teach the method, then build
              alongside your team until the systems are running on their own.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <ol
              role="list"
              className="mt-14 grid gap-x-2 gap-y-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch"
            >
              {aiosSteps.map((step, idx) => (
                <li key={step.label} className="contents md:contents">
                  <div className="rounded-2xl border border-slate-800 bg-[color-mix(in_oklab,var(--color-dark-bg)_60%,#0b1322)] p-6 sm:p-7">
                    <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--color-accent-green)]">
                      Step {idx + 1}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-[var(--color-text-light)]">
                      {step.label}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
                      {step.body}
                    </p>
                  </div>

                  {idx < aiosSteps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="mx-auto block h-5 w-px bg-[var(--color-primary-green)]/50 md:h-px md:w-12 md:self-center"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-12">
              <Link
                href="/contact?subject=aios-business"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary-green)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)] sm:text-[15px]"
              >
                Get in touch
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Four-step delivery process */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              Delivery process
            </p>
            <h2 className="accent-bar mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              How a typical engagement runs end to end
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg dark:text-slate-300">
              Four phases, designed so the team is producing real artefacts by
              week two and you can measure ramp by week eight.
            </p>
          </FadeIn>

          <FadeInStagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {deliverySteps.map(({ icon: Icon, title, body }, idx) => (
              <FadeInItem key={title} className="h-full">
                <article
                  className="relative flex h-full flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 dark:border-slate-800 dark:bg-[#0F172A]"
                  style={{ borderWidth: "0.5px" }}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-mint)] font-display text-lg font-semibold text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
                      {idx + 1}
                    </span>
                    <Icon
                      size={20}
                      strokeWidth={1.75}
                      className="text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                    {title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                    {body}
                  </p>
                </article>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Case studies section removed pending real reference customers — reintroduce in marketing pass once we have at least one named or anonymisable client engagement. */}

      {/* Contact form */}
      <section
        id="contact"
        className="scroll-mt-24 bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]"
      >
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              Next steps
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Start a conversation
            </h2>
          </FadeIn>

          <FadeIn delay={0.08}>
            <p className="mt-5 inline-flex items-start gap-2 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
              <Send
                size={16}
                strokeWidth={1.8}
                className="mt-1 shrink-0 text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]"
                aria-hidden="true"
              />
              <span>
                Or email{" "}
                <a
                  href={`mailto:${enterpriseEmail}`}
                  className="font-medium text-[var(--color-deep-green)] underline decoration-[var(--color-primary-green)] underline-offset-2 hover:text-[var(--color-primary-green)] dark:text-[var(--color-text-light)] dark:hover:text-[var(--color-accent-green)]"
                >
                  {enterpriseEmail}
                </a>{" "}
                directly — we reply within 24 hours.
              </span>
            </p>
          </FadeIn>

          <div className="mt-10">
            <FadeIn delay={0.12}>
              <EnterpriseContactForm />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              FAQ
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Common questions from buyers
            </h2>
          </FadeIn>

          <div className="mt-10">
            <FaqAccordion items={enterpriseFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { Briefcase, LifeBuoy, Mail } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { GeneralContactForm } from "@/components/sections/GeneralContactForm";
import {
  contactEmail,
  enterpriseEmail,
  siteName,
  siteUrl,
  supportEmail,
} from "@/lib/constants";

const pageTitle = "Contact";
const pageDescription =
  "Course questions, corporate enquiries, or just hello — we reply within one business day. Three email lines and a contact form.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
    url: `${siteUrl}/contact`,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
  },
};

const contactLines = [
  {
    icon: Mail,
    label: "General",
    email: contactEmail,
    body: "The right place for course questions, brand questions, or anything else.",
  },
  {
    icon: Briefcase,
    label: "Corporate & enterprise",
    email: enterpriseEmail,
    body: "Bulk licences, custom courses, AIOS for Business.",
  },
  {
    icon: LifeBuoy,
    label: "Student support",
    email: supportEmail,
    body: "For enrolled learners — content questions, certificate issues, refund requests.",
  },
];

const contactFaqs = [
  {
    question: "Do I need technical experience to take your courses?",
    answer:
      "No coding required for any of our courses. We assume you can use a browser, a spreadsheet, and email — that's enough. Several lessons explain technical concepts plainly so you understand what you're using.",
  },
  {
    question: "What tools will I learn?",
    answer:
      "Claude, Claude Code, n8n, Make, Notion, Lovable, Relevance AI, Retell AI — depending on the course. We teach the tools professionals actually use, not generic \"AI literacy\" filler. The full tool list is on each course page.",
  },
  {
    question: "Are courses self-paced or scheduled?",
    answer:
      "Self-paced. Open the lesson when you have time, complete it, move on. No live cohorts for the standalone courses. AIOS Mastery is the exception — it's a guided programme with delivery rhythm set per buyer.",
  },
  {
    question: "Do you offer corporate training?",
    answer:
      "Yes. See the for business page — we offer team licences, custom course creation, the AIOS programme adapted for businesses, and workshop engagements.",
  },
  {
    question: "Why are your courses text-based and not video?",
    answer:
      "Three reasons: text is faster to scan than video, easier to update when tools change weekly, and lets you copy real prompts and code directly. Video looks polished; text gets the work done.",
  },
  {
    question: "Will I get a certificate?",
    answer:
      "Yes. Pass the final assessment with 70%+ and you get a verifiable certificate at a public URL. Anyone can verify it directly — useful for LinkedIn, applications, or your own records.",
  },
  {
    question: "What's your refund policy?",
    answer:
      "14 days, no questions asked. If you're not getting value, you get your money back. After 14 days, we work with you to make it right rather than refund — but the refund window is firm and clear.",
  },
  {
    question: "Can you create custom training for my team?",
    answer:
      "Yes. Custom courses are text-based interactive lessons built around your team's actual stack and workflows. Typical turnaround is 4–6 weeks. Email enterprise@aicraftlearning.com to start.",
  },
  {
    question: "Which course should I start with?",
    answer:
      "AI Fundamentals if you want to build the mental model first. Claude Code Mastery if you're already comfortable with AI and want a specific high-leverage tool. AI Agents & Workflows if you've done either of the above and want to build systems. Or take the free assessment — it'll recommend based on your current level.",
  },
  {
    question: "How often is course content updated?",
    answer:
      "We rewrite lessons when the underlying tools change meaningfully — usually 2–4 times per year per course. Lifetime access means lifetime updates; you don't pay again when content refreshes.",
  },
];

export default function ContactPage() {
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
            <p className="accent-bar text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-accent-green)]">
              Get in touch
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-4 max-w-3xl font-display text-[44px] font-bold leading-[1.05] tracking-tight sm:text-[56px] lg:text-[72px]">
              Let&rsquo;s talk.
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Course questions, corporate enquiries, or just a hello &mdash; we
              reply within one business day.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact form + info card */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
            <div>
              <FadeIn>
                <Suspense
                  fallback={
                    <div
                      aria-hidden="true"
                      className="h-[520px] rounded-2xl border border-[var(--color-border-subtle)] bg-white dark:border-slate-800 dark:bg-[#0F172A]"
                      style={{ borderWidth: "0.5px" }}
                    />
                  }
                >
                  <GeneralContactForm />
                </Suspense>
              </FadeIn>
            </div>

            <FadeIn delay={0.08}>
              <aside
                className="relative h-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 sm:p-8 dark:border-slate-800 dark:bg-[#0b1322]"
                style={{ borderWidth: "0.5px" }}
              >
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
                  Reach us directly
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                  Or send an email
                </h2>

                <ul className="mt-7 flex flex-col gap-6">
                  {contactLines.map(({ icon: Icon, label, email, body }) => (
                    <li key={email} className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-mint)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)]">
                        <Icon
                          size={20}
                          strokeWidth={1.75}
                          className="text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]"
                          aria-hidden="true"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--color-text-muted)]">
                          {label}
                        </p>
                        <a
                          href={`mailto:${email}`}
                          className="mt-1 block break-all font-display text-base font-semibold text-[var(--color-deep-green)] underline decoration-[var(--color-primary-green)] underline-offset-2 transition-colors hover:text-[var(--color-primary-green)] dark:text-[var(--color-text-light)] dark:hover:text-[var(--color-accent-green)]"
                        >
                          {email}
                        </a>
                        <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                          {body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="mt-8 border-t border-[var(--color-border-subtle)] pt-5 text-xs text-[var(--color-text-muted)] dark:border-slate-800" style={{ borderTopWidth: "0.5px" }}>
                  We reply within one business day.
                </p>
              </aside>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--color-light-mint)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              FAQ
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Common questions
            </h2>
          </FadeIn>

          <div className="mt-10">
            <FaqAccordion items={contactFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}

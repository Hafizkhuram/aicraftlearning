import type { Metadata } from "next";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Share2,
  UserPlus,
} from "lucide-react";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CertificationVerifyForm } from "@/components/sections/CertificationVerifyForm";
import { siteName, siteUrl } from "@/lib/constants";

const pageTitle = "Certification";
const pageDescription =
  "Earn an AICraft Certified badge that proves real AI capability. Complete the course, pass the final assessment, get a verifiable, shareable certificate.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: `${siteUrl}/certification` },
  openGraph: {
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
    url: `${siteUrl}/certification`,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
  },
};

const howItWorks = [
  {
    icon: BookOpen,
    title: "Complete the course",
    body: "Finish every lesson and module review. Modules unlock in order so the foundations are always in place before you build on them.",
  },
  {
    icon: ClipboardCheck,
    title: "Pass the final assessment",
    body: "Score 70% or higher on the course's final assessment. Questions are scenario-based, not memorisation — they test whether you can apply what you learned.",
  },
  {
    icon: Award,
    title: "Earn a verifiable certificate",
    body: "Get a publicly linkable, employer-verifiable certificate with a unique ID. Share it on LinkedIn or in an interview and anyone can confirm it's real.",
  },
];

const flowSteps = [
  { icon: UserPlus, label: "Register" },
  { icon: BookOpen, label: "Study" },
  { icon: ClipboardCheck, label: "Assess" },
  { icon: GraduationCap, label: "Certify" },
  { icon: Share2, label: "Share" },
];

const certificationFaqs = [
  {
    question: "Is the AICraft certificate recognised by employers?",
    answer:
      "Each certificate is issued under the AICraft Learning brand with a unique verifiable ID. Hiring managers can confirm the credential and see exactly which course it relates to. We focus on signalling real capability — not on accreditation badges from boards that have nothing to do with AI.",
  },
  {
    question: "What's on the final assessment?",
    answer:
      "Scenario-based questions drawn from the same situations the course teaches. Expect short prompts that ask you to choose the right approach, spot what's missing in a workflow, or judge whether an output is trustworthy. It mirrors the work, not a textbook.",
  },
  {
    question: "What happens if I don't pass?",
    answer:
      "You can retake the assessment after a short cooldown so you have time to revisit the relevant lessons. Most learners pass on the first or second attempt. There's no extra fee for retakes.",
  },
  {
    question: "How do I share my certificate?",
    answer:
      "Once issued, you'll get a permanent public URL like aicraftlearning.com/certificate/your-id. Add it to LinkedIn (Licenses & Certifications), include it on your CV, or send the link directly. Anyone with the link can verify it.",
  },
  {
    question: "Does the certificate expire?",
    answer:
      "No. Your certificate is permanent. The lessons themselves are kept up to date as the underlying AI tools evolve, so coming back to review what's changed is always free if you've already enrolled.",
  },
  {
    question: "Can my employer verify a certificate I've sent them?",
    answer:
      "Yes. Use the verification box on this page or visit aicraftlearning.com/verify and paste the certificate ID. The verification page shows the holder's name, the course, and the date the certificate was issued.",
  },
];

export default function CertificationPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[var(--color-dark-bg)] text-[var(--color-text-light)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.28),rgba(16,185,129,0)_65%)] blur-3xl" />
          <div className="absolute bottom-[-180px] -left-32 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.16),rgba(52,211,153,0)_70%)] blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-accent-green)]">
              Certification
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-4 max-w-3xl font-display text-[36px] font-bold leading-[1.05] tracking-tight sm:text-[48px] lg:text-[56px]">
              AICraft Certified — proof of real AI capability
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Every AICraft course ends with a verifiable certificate. Not a
              participation badge — a credential that signals you can actually
              do the work.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* How it works — 3-card section */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              How certification works
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Three steps from sign-up to shareable credential
            </h2>
          </FadeIn>

          <FadeInStagger className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
            {howItWorks.map(({ icon: Icon, title, body }, idx) => (
              <FadeInItem key={title} className="h-full">
                <article
                  className="relative h-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 pl-8 dark:border-slate-800 dark:bg-[#0b1322]"
                  style={{ borderWidth: "0.5px" }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-7 bottom-7 left-3 w-[3px] rounded-full bg-[var(--color-primary-green)]"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-light-mint)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)]">
                      <Icon
                        size={26}
                        strokeWidth={1.75}
                        className="text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="font-display text-sm font-semibold tracking-[0.2em] text-[var(--color-text-muted)]">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="mt-7 font-display text-xl font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                    {body}
                  </p>
                </article>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Visual flow: Register → Study → Assess → Certify → Share */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              The full flow
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              From first lesson to shared certificate
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <ol
              role="list"
              className="mt-12 grid gap-x-2 gap-y-4 md:grid-cols-9 md:items-center"
            >
              {flowSteps.map(({ icon: Icon, label }, idx) => (
                <li
                  key={label}
                  className="contents md:contents"
                >
                  {/* Step card */}
                  <div className="flex items-center gap-4 md:col-span-1 md:flex-col md:items-center md:gap-3 md:text-center">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-white text-[var(--color-deep-green)] dark:border-slate-800 dark:bg-[#0F172A] dark:text-[var(--color-accent-green)]"
                      style={{ borderWidth: "0.5px" }}
                    >
                      <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 md:w-full">
                      <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--color-text-muted)]">
                        Step {idx + 1}
                      </p>
                      <p className="mt-1 font-display text-base font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                        {label}
                      </p>
                    </div>
                  </div>

                  {/* Connector to next step */}
                  {idx < flowSteps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="ml-[27px] block h-5 w-px bg-[var(--color-primary-green)]/40 md:col-span-1 md:mx-auto md:ml-0 md:h-px md:w-full md:max-w-16"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </section>

      {/* Verify a certificate */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <CertificationVerifyForm />
          </FadeIn>
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
              Common questions about certification
            </h2>
          </FadeIn>

          <div className="mt-10">
            <FaqAccordion items={certificationFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}

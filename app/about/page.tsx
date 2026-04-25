import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import {
  BookText,
  Filter,
  Hammer,
  Heart,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";
import { siteName, siteUrl } from "@/lib/constants";

const pageTitle = "About";
const pageDescription =
  "AICraft Learning was founded to close the gap between AI hype and real-world skills. Founded by Khuram Shahzad — PhD in AI and Robotics, 10+ years in the field.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
    url: `${siteUrl}/about`,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
  },
};

const approachSteps = [
  {
    title: "Understand",
    body:
      "Build the mental model. Know what AI is, what it isn't, where it's strong, where it falls over.",
  },
  {
    title: "Practice",
    body:
      "Short, focused lessons you do alongside the material. Not video. Not theory. Real tool, real outputs, real feedback.",
  },
  {
    title: "Build",
    body:
      "Apply what you've learned to your actual work. Every course ends with a real artefact, not a quiz score.",
  },
  {
    title: "Apply",
    body: "Take it back to your business. The work compounds.",
  },
];

const differentiators = [
  {
    icon: BookText,
    title: "Built for reading and doing",
    body:
      "Every AICraft Learning course is built around clear, text-based lessons you can read at your own pace, hands-on exercises you do alongside the material, and real-world projects you can apply immediately.",
  },
  {
    icon: Wrench,
    title: "Tool-specific",
    body:
      "Text-first. Tool-specific (Claude, Claude Code, Make, etc.).",
  },
  {
    icon: Filter,
    title: "No generic filler",
    body:
      "No generic “AI for everyone” filler. We teach you to use the actual tools professionals use.",
  },
];

const values = [
  {
    icon: Hammer,
    title: "Craft over theory",
    body:
      "Theory is what you read once and forget. Craft is what shows up in your work months later. We teach the second.",
  },
  {
    icon: Zap,
    title: "Always current",
    body:
      "AI moves fast. Lessons get rewritten when the tools change, not when the next quarterly roadmap allows.",
  },
  {
    icon: Heart,
    title: "Accessible to all",
    body:
      "No coding required, no jargon for its own sake, no assumed CS background. If you can use a spreadsheet, you can do this.",
  },
  {
    icon: Users,
    title: "Community first",
    body:
      "Our students help our students. Cohort threads, alumni reviews, and real working sessions, not just a Discord no one reads.",
  },
];

const founderBio = [
  "I've spent more than 10 years working with AI, and I hold a PhD in AI and Robotics. I've watched the field go from something only researchers cared about to something every professional is suddenly expected to master — overnight, without a guide.",
  "I started AICraft Learning because most of what's being taught right now is noise. Tool-of-the-week tutorials. Agency-hustle pitches. Surface-level prompts that leave you exactly where you started. None of it teaches the thing that actually matters: how to make AI work for your specific business, your specific work, your specific context.",
  "That's what I teach here. The craft of building AI systems that actually know what you're doing. No coding required — just the patience to do the work properly.",
];

function founderPhotoExists(): boolean {
  try {
    return existsSync(join(process.cwd(), "public", "team", "khuram.jpg"));
  } catch {
    return false;
  }
}

export default function AboutPage() {
  const hasPhoto = founderPhotoExists();

  return (
    <>
      {/* Hero — dark */}
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
              About AICraft Learning
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-5 max-w-4xl font-display text-[40px] font-bold leading-[1.05] tracking-tight sm:text-[56px] lg:text-[68px]">
              AI proficiency is a craft. We teach it that way.
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Our story — white */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="accent-bar text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              Our story
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="mt-8 max-w-[640px] text-[18px] leading-[1.7] text-[var(--color-text-dark)] sm:text-[20px] dark:text-slate-200">
              We believe everyone should be able to use AI confidently &mdash;
              not just developers. AICraft Learning was founded to close the gap
              between AI hype and real-world AI skills. The name is deliberate:
              craft, not magic. Practice, not shortcuts.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Our approach — mint */}
      <section className="bg-[var(--color-light-mint)] py-20 sm:py-24 dark:bg-[#0a1f1a]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              Our approach
            </p>
            <h2 className="accent-bar mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Four steps, in order, every time.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg dark:text-slate-300">
              Each course moves you through the same loop. You understand the
              idea, practise it, build with it, then apply it to your own work.
            </p>
          </FadeIn>

          <FadeInStagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approachSteps.map(({ title, body }, idx) => (
              <FadeInItem key={title} className="h-full">
                <article
                  className="relative flex h-full flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 dark:border-slate-800 dark:bg-[#0F172A]"
                  style={{ borderWidth: "0.5px" }}
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-mint)] font-display text-lg font-semibold text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
                    {idx + 1}
                  </span>
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

      {/* What makes us different — white */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              What makes us different
            </p>
            <h2 className="accent-bar mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Built for the work, not the algorithm.
            </h2>
          </FadeIn>

          <FadeInStagger className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
            {differentiators.map(({ icon: Icon, title, body }) => (
              <FadeInItem key={title} className="h-full">
                <article
                  className="flex h-full flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 dark:border-slate-800 dark:bg-[#0b1322]"
                  style={{ borderWidth: "0.5px" }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-light-mint)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)]">
                    <Icon
                      size={22}
                      strokeWidth={1.75}
                      className="text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
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

      {/* Founder — mint */}
      <section className="bg-[var(--color-light-mint)] py-20 sm:py-24 dark:bg-[#0a1f1a]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              Founder
            </p>
            <h2 className="accent-bar mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Why I started AICraft Learning.
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <article
              className="mx-auto mt-12 flex max-w-4xl flex-col gap-8 rounded-2xl border border-[var(--color-border-subtle)] bg-white p-8 sm:flex-row sm:items-start sm:p-10 dark:border-slate-800 dark:bg-[#0f2a23]"
              style={{ borderWidth: "0.5px" }}
            >
              <div className="flex shrink-0 justify-center sm:block">
                {hasPhoto ? (
                  <Image
                    src="/team/khuram.jpg"
                    alt="Khuram Shahzad, founder of AICraft Learning"
                    width={160}
                    height={160}
                    className="h-40 w-40 rounded-full object-cover"
                    priority
                  />
                ) : (
                  <div
                    aria-label="Khuram Shahzad portrait placeholder"
                    role="img"
                    className="flex h-40 w-40 items-center justify-center rounded-full bg-[var(--color-primary-green)] font-display text-4xl font-semibold tracking-tight text-white"
                  >
                    KS
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                  Khuram Shahzad
                </h3>
                <p className="mt-1 text-[14px] font-medium tracking-wide text-[var(--color-text-muted)] dark:text-slate-400">
                  Founder
                </p>

                <div className="mt-6 space-y-5">
                  {founderBio.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-[16px] leading-[1.7] text-[var(--color-text-dark)] sm:text-[17px] dark:text-slate-200"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 sm:justify-start">
                  <a
                    href="https://www.linkedin.com/in/khuram-shahzad-203b088b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Khuram Shahzad on LinkedIn"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border-subtle)] text-[var(--color-deep-green)] transition-colors hover:border-[var(--color-primary-green)] hover:text-[var(--color-primary-green)] dark:border-slate-700 dark:text-[var(--color-accent-green)] dark:hover:border-[var(--color-accent-green)]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S.02 4.881.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.02h4.56V23H.22V8.02zM8.02 8.02h4.37v2.05h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 7v8.29h-4.56v-7.35c0-1.75-.03-4-2.44-4-2.44 0-2.81 1.9-2.81 3.87V23H8.02V8.02z" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          </FadeIn>
        </div>
      </section>

      {/* Values — white */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              What we believe
            </p>
            <h2 className="accent-bar mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              The four values we hire, build, and teach by.
            </h2>
          </FadeIn>

          <FadeInStagger className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, body }) => (
              <FadeInItem key={title} className="h-full">
                <article
                  className="flex h-full flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 dark:border-slate-800 dark:bg-[#0b1322]"
                  style={{ borderWidth: "0.5px" }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-light-mint)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)]">
                    <Icon
                      size={22}
                      strokeWidth={1.75}
                      className="text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
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
    </>
  );
}

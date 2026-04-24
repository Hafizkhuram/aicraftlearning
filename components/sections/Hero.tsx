import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedLogoMark } from "@/components/ui/AnimatedLogoMark";
import { FadeIn } from "@/components/ui/FadeIn";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-dark-bg)] text-[var(--color-text-light)]">
      {/* Subtle emerald radial gradient — top-right corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.32),rgba(16,185,129,0)_65%)] blur-3xl" />
        <div className="absolute -left-40 bottom-[-220px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.18),rgba(52,211,153,0)_70%)] blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-4 pt-20 pb-24 sm:px-6 sm:pt-24 sm:pb-28 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pt-28 lg:pb-32">
        {/* Left — copy + CTAs */}
        <div className="lg:col-span-7">
          <FadeIn delay={0}>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-accent-green)]">
              AI education, done properly
            </p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <h1 className="mt-5 font-display text-[40px] font-bold leading-[1.05] tracking-tight text-[var(--color-text-light)] sm:text-[56px] lg:text-[72px]">
              Learn to use AI like you mean it.
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg lg:text-[19px]">
              Tool-fatigued? Overwhelmed? We teach the craft of AI — not the
              hype. Text-based courses, bespoke interactive lessons, real
              skills.
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/courses"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary-green)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)] sm:text-[15px]"
              >
                Browse courses
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-transparent px-6 py-3 text-sm font-semibold text-[var(--color-text-light)] transition-colors hover:border-[var(--color-accent-green)] hover:text-[var(--color-accent-green)] sm:text-[15px]"
              >
                Discover your AI level
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.32}>
            <p className="mt-7 text-xs text-slate-500">
              No credit card required for the assessment. 5 minutes.
            </p>
          </FadeIn>
        </div>

        {/* Right — animated circuit-node mark */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          <div className="relative aspect-square w-[260px] sm:w-[340px] lg:w-[420px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),rgba(16,185,129,0)_70%)]"
            />
            <AnimatedLogoMark
              className="relative h-full w-full"
              ariaLabel="AICraft Learning brand mark"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

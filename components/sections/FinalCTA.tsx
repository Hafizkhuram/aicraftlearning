import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-surface)] py-24 sm:py-32 dark:bg-[#0b1322]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),rgba(16,185,129,0)_70%)] blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--color-deep-green)] sm:text-5xl dark:text-[var(--color-text-light)]">
            Start your AI craft today.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg dark:text-slate-300">
            Pick a course, get to work. You&apos;ll know more in a week than
            most people have learned in a year of doom-scrolling.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Link
              href="/courses"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary-green)] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)]"
            >
              Browse courses
              <ArrowRight
                size={16}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-deep-green)] transition-colors hover:text-[var(--color-primary-green)] dark:text-[var(--color-text-light)] dark:hover:text-[var(--color-accent-green)]"
            >
              Prefer to talk first? Book a call
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

export function AssessmentTeaser() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-dark-bg)] py-20 text-[var(--color-text-light)] sm:py-24">
      {/* Soft emerald wash bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.22),rgba(16,185,129,0)_70%)] blur-3xl"
      />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative rounded-2xl border border-slate-800 bg-[#0b1322] p-8 pl-10 sm:p-12 sm:pl-14"
            style={{ borderWidth: "0.5px" }}
          >
            {/* Emerald left-border accent panel */}
            <div
              aria-hidden="true"
              className="absolute top-6 bottom-6 left-0 w-[3px] rounded-r-full bg-[var(--color-primary-green)]"
            />

            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#0F172A] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--color-accent-green)]">
                  <Compass size={13} strokeWidth={2} />
                  Free 5-minute assessment
                </div>
                <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-[var(--color-text-light)] sm:text-4xl">
                  Not sure where to start?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-[17px]">
                  Take our free 5-minute assessment. Find your AI level and the
                  right starting point — no signup required.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/assessment"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary-green)] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)]"
                >
                  Discover your AI level
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

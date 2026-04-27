import { FadeIn } from "@/components/ui/FadeIn";

function CourseCardSkeleton() {
  return (
    <div
      className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-white p-7 pl-8 dark:border-slate-800 dark:bg-[#0F172A]"
      style={{ borderWidth: "0.5px" }}
    >
      <span
        aria-hidden="true"
        className="absolute top-7 bottom-7 left-3 w-[3px] rounded-full bg-[var(--color-primary-green)]/30"
      />
      <div className="animate-pulse">
        <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 h-7 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-2 h-7 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-2 h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 h-3 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-10 flex items-end justify-between">
          <div>
            <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-7 w-20 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

export default function CoursesLoading() {
  return (
    <>
      {/* Hero — kept identical to the page so the layout doesn't shift on load. */}
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
              Courses
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-4 max-w-3xl font-display text-[36px] font-bold leading-[1.05] tracking-tight sm:text-[48px] lg:text-[56px]">
              Learn AI as a craft, not a checklist
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Three short, text-first courses. Read a lesson, do a small
              exercise, take a quick check, move on. No bloated video runtimes,
              no padded modules.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div
          className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-busy="true"
          aria-label="Loading courses"
        >
          {/* Filter bar skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {[64, 88, 104, 96].map((width, idx) => (
                <div
                  key={idx}
                  className="h-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"
                  style={{ width }}
                />
              ))}
            </div>
            <div className="h-9 w-full animate-pulse rounded-full bg-slate-200 sm:w-72 dark:bg-slate-800" />
          </div>

          {/* Three skeleton cards */}
          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

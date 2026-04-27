function ModuleSkeleton() {
  return (
    <li>
      <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-2 h-4 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <ul className="mt-3 space-y-2">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="h-7 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/70"
          />
        ))}
      </ul>
    </li>
  );
}

export default function LessonLoading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-bg)]">
      <aside
        aria-busy="true"
        aria-label="Loading course outline"
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[280px] shrink-0 border-r border-[var(--color-border-subtle)] bg-white/80 lg:block dark:border-white/10 dark:bg-white/[0.02]"
      >
        <div className="flex h-full flex-col gap-6 overflow-hidden px-5 py-6">
          {/* Header (back link, course title, progress bar) */}
          <div>
            <div className="h-3 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-1 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Module list */}
          <ol className="flex flex-1 flex-col gap-5">
            {[0, 1, 2, 3].map((i) => (
              <ModuleSkeleton key={i} />
            ))}
          </ol>
        </div>
      </aside>

      {/* Iframe column — left as a plain placeholder while the lesson HTML loads. */}
      <main className="min-w-0 flex-1">
        <div className="border-b border-[var(--color-border-subtle)] bg-white/70 px-4 py-3 sm:px-6 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="h-4 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </main>
    </div>
  );
}

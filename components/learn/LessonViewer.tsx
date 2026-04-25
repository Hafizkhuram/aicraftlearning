"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

type LessonViewerProps = {
  courseSlug: string;
  currentLesson: {
    slug: string;
    title: string;
    minutes: number;
    htmlPath: string;
    moduleNumber: number;
    indexInModule: number;
  };
  nextLesson: {
    slug: string;
    title: string;
  } | null;
  sidebar: ReactNode;
};

export function LessonViewer({
  currentLesson,
  nextLesson,
  sidebar,
}: LessonViewerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [currentLesson.slug]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-bg)]">
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[280px] shrink-0 border-r border-[var(--color-border-subtle)] bg-white/80 lg:block dark:border-white/10 dark:bg-white/[0.02]">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-[var(--color-dark-bg)]/60"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-[280px] max-w-[80vw] flex-col bg-white shadow-xl dark:bg-[var(--color-dark-bg)]">
            <div className="flex justify-end border-b border-[var(--color-border-subtle)] px-3 py-2 dark:border-white/10">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] dark:hover:text-[var(--color-text-light)]"
              >
                Close ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebar}</div>
          </aside>
        </div>
      ) : null}

      <main className="min-w-0 flex-1">
        <div className="border-b border-[var(--color-border-subtle)] bg-white/70 px-4 py-3 sm:px-6 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-[var(--color-border-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-dark)] lg:hidden dark:border-white/10 dark:hover:text-[var(--color-text-light)]"
                aria-label="Open course outline"
              >
                ☰ Outline
              </button>
              <p className="text-[12px] text-[var(--color-text-muted)]">
                Lesson {currentLesson.moduleNumber}.{currentLesson.indexInModule}
                {" · "}Module {currentLesson.moduleNumber}
                {" · "}
                {currentLesson.minutes} min
              </p>
            </div>
            {nextLesson ? (
              <Link
                href={`#`}
                onClick={(e) => e.preventDefault()}
                aria-disabled
                className="hidden text-[12px] font-medium text-[var(--color-text-muted)] sm:inline"
              >
                Next: {nextLesson.title} →
              </Link>
            ) : null}
          </div>
        </div>

        <div className="px-3 pt-3 pb-6 sm:px-6 sm:pt-4">
          <iframe
            src={currentLesson.htmlPath}
            title={currentLesson.title}
            sandbox="allow-scripts allow-same-origin"
            className="h-[calc(100vh-10rem)] w-full rounded-lg border-0 bg-white shadow-sm"
          />
        </div>
      </main>
    </div>
  );
}

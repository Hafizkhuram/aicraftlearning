import Link from "next/link";
import type { CourseManifest } from "@/lib/courses";
import type { CourseProgress } from "@/lib/progress";

type AssessmentSidebarState = "locked" | "available" | "passed";

type LessonSidebarProps = {
  manifest: CourseManifest;
  progress: CourseProgress;
  currentLessonSlug: string | null;
  assessmentState: AssessmentSidebarState;
  isAssessmentActive?: boolean;
};

export function LessonSidebar({
  manifest,
  progress,
  currentLessonSlug,
  assessmentState,
  isAssessmentActive = false,
}: LessonSidebarProps) {
  const overallPct = progress.totalLessons
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0;

  return (
    <nav
      aria-label="Course outline"
      className="flex h-full flex-col gap-6 overflow-y-auto px-5 py-6"
    >
      <div>
        <Link
          href="/learn"
          className="inline-flex items-center text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-deep-green)] dark:hover:text-[var(--color-accent-green)]"
        >
          ← Back to My Learning
        </Link>
        <h2 className="mt-3 font-display text-base font-semibold leading-tight text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
          {manifest.title}
        </h2>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--color-border-subtle)] dark:bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--color-primary-green)] transition-[width]"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">
          {progress.completedLessons} / {progress.totalLessons} lessons
        </p>
      </div>

      <ol className="flex flex-1 flex-col gap-5 pb-4">
        {manifest.modules.map((module) => (
          <li key={module.number}>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)] uppercase">
              Module {module.number}
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
              {module.title}
            </p>
            <ul className="mt-2 space-y-0.5">
              {module.lessons.map((lesson) => {
                const status = progress.lessonStatusBySlug[lesson.slug];
                const isCurrent = lesson.slug === currentLessonSlug;
                const isCompleted = status?.completed ?? false;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={`/learn/${manifest.slug}/${lesson.slug}`}
                      className={`flex items-start gap-2.5 rounded-md px-2 py-1.5 text-[13px] leading-snug transition-colors ${
                        isCurrent
                          ? "bg-[color-mix(in_oklab,var(--color-primary-green)_14%,transparent)] text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-border-subtle)]/50 hover:text-[var(--color-text-dark)] dark:hover:text-[var(--color-text-light)]"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                          isCompleted
                            ? "border-[var(--color-primary-green)] bg-[var(--color-primary-green)] text-white"
                            : isCurrent
                              ? "border-[var(--color-primary-green)] text-[var(--color-primary-green)]"
                              : "border-[var(--color-border-subtle)] dark:border-white/20"
                        }`}
                      >
                        {isCompleted ? "✓" : ""}
                      </span>
                      <span className="flex-1">
                        {lesson.title}
                        {lesson.isReview ? (
                          <span className="ml-2 inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--color-warning)_22%,transparent)] px-1.5 py-px text-[8px] font-semibold tracking-wide text-[#92400E] uppercase dark:text-[var(--color-warning)]">
                            Review
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      <div>
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--color-text-muted)] uppercase">
          Final assessment
        </p>
        {assessmentState === "passed" ? (
          <Link
            href={`/learn/${manifest.slug}/certificate`}
            className="mt-1 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-[var(--color-deep-green)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-primary-green)_10%,transparent)] dark:text-[var(--color-accent-green)]"
          >
            ✓ Certified — view certificate
          </Link>
        ) : assessmentState === "available" ? (
          <Link
            href={`/learn/${manifest.slug}/assessment`}
            className={`mt-1 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors ${
              isAssessmentActive
                ? "bg-[color-mix(in_oklab,var(--color-primary-green)_14%,transparent)] text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]"
                : "text-[var(--color-deep-green)] hover:bg-[color-mix(in_oklab,var(--color-primary-green)_10%,transparent)] dark:text-[var(--color-accent-green)]"
            }`}
          >
            Start the assessment →
          </Link>
        ) : (
          <p className="mt-1 px-2 py-1.5 text-[12px] leading-snug text-[var(--color-text-muted)]">
            Locked — finish all lessons and module reviews to unlock.
          </p>
        )}
      </div>
    </nav>
  );
}

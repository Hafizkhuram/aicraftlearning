import { BookOpen, GraduationCap, Award } from "lucide-react";
import type { CourseAssessmentConfig, CourseModule } from "@/lib/courses";

type Props = {
  modules: CourseModule[];
  assessmentConfig: CourseAssessmentConfig;
};

export function CurriculumGrid({ modules, assessmentConfig }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {modules.map((module) => (
          <article
            key={module.number}
            className="flex h-full flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-white p-7 dark:border-slate-800 dark:bg-[#0F172A]"
            style={{ borderWidth: "0.5px" }}
          >
            <h3 className="font-display text-xl font-semibold leading-snug text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
              <span className="text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
                Module {module.number}:
              </span>{" "}
              {module.title}
            </h3>

            <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
              {module.description}
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-6 text-xs text-[var(--color-text-muted)]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <BookOpen
                  size={14}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]"
                />
                {module.lessonCount} lessons
              </span>
              <span aria-hidden="true" className="text-[var(--color-border-subtle)] dark:text-slate-700">·</span>
              <span className="inline-flex items-center rounded-full bg-[var(--color-light-mint)] px-2.5 py-1 font-medium text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
                {module.quizQuestionCount}-question module quiz
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Final assessment block */}
      <article
        className="relative overflow-hidden rounded-2xl border border-[var(--color-primary-green)] bg-[var(--color-light-mint)] p-7 sm:p-8 dark:border-[var(--color-accent-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_45%,transparent)]"
        style={{ borderWidth: "0.5px", borderTopWidth: "3px" }}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-deep-green)] shadow-[0_4px_14px_-6px_rgba(6,95,70,0.35)] dark:bg-[var(--color-dark-bg)] dark:text-[var(--color-accent-green)]">
            <GraduationCap size={26} strokeWidth={1.8} aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              Final assessment
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-[var(--color-deep-green)] sm:text-2xl dark:text-[var(--color-text-light)]">
              Earn your verifiable certificate
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-deep-green)] sm:text-base dark:text-slate-200">
              Pass a {assessmentConfig.questionCount}-question final assessment
              to earn your verifiable certificate. Score{" "}
              {assessmentConfig.passMarkPercent}% or higher to unlock your
              shareable certificate URL.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--color-deep-green)] dark:bg-[var(--color-dark-bg)] dark:text-[var(--color-accent-green)]">
              <Award size={13} strokeWidth={2} aria-hidden="true" />
              Certificate of completion
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

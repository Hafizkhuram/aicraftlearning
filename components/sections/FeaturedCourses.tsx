import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";
import { getAllCourseManifests } from "@/lib/courses";
import type { CourseLevel } from "@/lib/courses";

const levelStyles: Record<CourseLevel, string> = {
  Beginner:
    "bg-[var(--color-light-mint)] text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]",
  Intermediate:
    "bg-[#FEF3C7] text-[#92400E] dark:bg-[color-mix(in_oklab,#92400E_50%,transparent)] dark:text-[#FBBF24]",
  Advanced:
    "bg-[#E0E7FF] text-[#3730A3] dark:bg-[color-mix(in_oklab,#3730A3_50%,transparent)] dark:text-[#A5B4FC]",
};

export async function FeaturedCourses() {
  const courses = await getAllCourseManifests();

  return (
    <section className="bg-[var(--color-surface)] py-24 sm:py-28 dark:bg-[#0b1322]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Featured courses"
              title="Three places to start. Pick the one that fits."
            />
            <Link
              href="/courses"
              className="group inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[var(--color-primary-green)] transition-colors hover:text-[var(--color-deep-green)] dark:hover:text-[var(--color-accent-green)] sm:self-end"
            >
              View all courses
              <ArrowRight
                size={15}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </FadeIn>

        <FadeInStagger className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <FadeInItem key={course.slug} className="h-full">
              <Link
                href={`/courses/${course.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary-green)] hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-[#0F172A] dark:hover:border-[var(--color-accent-green)] dark:hover:shadow-[0_18px_40px_-22px_rgba(16,185,129,0.35)]"
                style={{ borderWidth: "0.5px" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${levelStyles[course.level]}`}
                  >
                    {course.level}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-semibold leading-tight text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                  {course.title}
                </h3>

                <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                  {course.subtitle}
                </p>

                <dl className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[var(--color-text-muted)] dark:text-slate-400">
                  <div className="inline-flex items-center gap-1">
                    <dt className="sr-only">Modules</dt>
                    <dd>{course.moduleCount} modules</dd>
                  </div>
                  <span aria-hidden="true">·</span>
                  <div className="inline-flex items-center gap-1">
                    <dt className="sr-only">Lessons</dt>
                    <dd>{course.lessonCount} lessons</dd>
                  </div>
                </dl>

                <div className="mt-auto flex items-end justify-between pt-7">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-[var(--color-text-muted)]">
                      One-time
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                      {course.priceDisplay}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary-green)] transition-transform group-hover:translate-x-0.5 dark:text-[var(--color-accent-green)]">
                    Learn more
                    <ArrowRight size={15} strokeWidth={2} />
                  </span>
                </div>
              </Link>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}

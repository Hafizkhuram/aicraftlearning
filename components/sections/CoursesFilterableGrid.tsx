"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";
import type { CourseLevel, CourseManifest } from "@/lib/courses";

type Props = {
  courses: CourseManifest[];
};

type LevelFilter = "All" | CourseLevel;

const LEVEL_FILTERS: LevelFilter[] = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

const levelStyles: Record<CourseLevel, string> = {
  Beginner:
    "bg-[var(--color-light-mint)] text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]",
  Intermediate:
    "bg-[#FEF3C7] text-[#92400E] dark:bg-[color-mix(in_oklab,#92400E_50%,transparent)] dark:text-[#FBBF24]",
  Advanced:
    "bg-[#E0E7FF] text-[#3730A3] dark:bg-[color-mix(in_oklab,#3730A3_50%,transparent)] dark:text-[#A5B4FC]",
};

export function CoursesFilterableGrid({ courses }: Props) {
  const [level, setLevel] = useState<LevelFilter>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (level !== "All" && c.level !== level) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q)
      );
    });
  }, [courses, level, query]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter courses by level"
          className="inline-flex flex-wrap gap-2"
        >
          {LEVEL_FILTERS.map((opt) => {
            const active = level === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setLevel(opt)}
                aria-pressed={active}
                className={[
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--color-deep-green)] text-white dark:bg-[var(--color-primary-green)]"
                    : "border border-[var(--color-border-subtle)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary-green)] hover:text-[var(--color-deep-green)] dark:border-slate-800 dark:bg-[#0F172A] dark:text-slate-300 dark:hover:border-[var(--color-accent-green)] dark:hover:text-[var(--color-accent-green)]",
                ].join(" ")}
                style={!active ? { borderWidth: "0.5px" } : undefined}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search courses</span>
          <Search
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses…"
            className="w-full rounded-full border border-[var(--color-border-subtle)] bg-white py-2 pr-4 pl-9 text-sm text-[var(--color-text-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary-green)] focus:outline-none dark:border-slate-800 dark:bg-[#0F172A] dark:text-[var(--color-text-light)]"
            style={{ borderWidth: "0.5px" }}
          />
        </label>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-14 text-center text-sm text-[var(--color-text-muted)]">
          No courses match those filters.
        </p>
      ) : (
        <FadeInStagger className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <FadeInItem key={course.slug} className="h-full">
              <Link
                href={`/courses/${course.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-white p-7 pl-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary-green)] hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-[#0F172A] dark:hover:border-[var(--color-accent-green)] dark:hover:shadow-[0_18px_40px_-22px_rgba(16,185,129,0.35)]"
                style={{ borderWidth: "0.5px" }}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-7 bottom-7 left-3 w-[3px] rounded-full bg-[var(--color-primary-green)]"
                />
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${levelStyles[course.level]}`}
                >
                  {course.level}
                </span>

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
                  <span aria-hidden="true">·</span>
                  <div className="inline-flex items-center gap-1">
                    <dt className="sr-only">Duration</dt>
                    <dd>{course.duration}</dd>
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
      )}
    </div>
  );
}

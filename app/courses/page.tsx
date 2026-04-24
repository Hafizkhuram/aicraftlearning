import type { Metadata } from "next";
import { CoursesFilterableGrid } from "@/components/sections/CoursesFilterableGrid";
import { FadeIn } from "@/components/ui/FadeIn";
import { getAllCourseManifests } from "@/lib/courses";
import { siteName, siteUrl } from "@/lib/constants";

const pageTitle = "Courses";
const pageDescription =
  "Three text-first AI courses for non-technical professionals — fundamentals, Claude Code, and AI agents. Learn AI as a craft, not a checklist.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: `${siteUrl}/courses` },
  openGraph: {
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
    url: `${siteUrl}/courses`,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
  },
};

type CoursesPageProps = {
  searchParams: Promise<{ recommended?: string | string[] }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const courses = await getAllCourseManifests();
  const params = await searchParams;
  const rawRecommended = params.recommended;
  const recommendedRaw = Array.isArray(rawRecommended)
    ? rawRecommended[0]
    : rawRecommended;
  const recommended = recommendedRaw?.replace(/[^a-z0-9-]/gi, "") || null;
  const recommendedSlug =
    recommended && courses.some((c) => c.slug === recommended)
      ? recommended
      : null;

  return (
    <>
      {/* Hero */}
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

      {/* Filterable grid */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <CoursesFilterableGrid
          courses={courses}
          recommendedSlug={recommendedSlug}
        />
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Check } from "lucide-react";
import { EnrollButton } from "@/components/ui/EnrollButton";
import { FadeIn } from "@/components/ui/FadeIn";
import { CurriculumGrid } from "@/components/sections/CurriculumGrid";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { getCourseManifest } from "@/lib/courses";
import type { CourseLevel, CourseManifest } from "@/lib/courses";
import { getPrisma } from "@/lib/db";
import { siteName, siteUrl } from "@/lib/constants";

const levelStyles: Record<CourseLevel, string> = {
  Beginner:
    "bg-[color-mix(in_oklab,var(--color-primary-green)_22%,transparent)] text-[var(--color-accent-green)]",
  Intermediate:
    "bg-[color-mix(in_oklab,#FBBF24_22%,transparent)] text-[#FBBF24]",
  Advanced:
    "bg-[color-mix(in_oklab,#A5B4FC_22%,transparent)] text-[#C7D2FE]",
};

function buildMetaDescription(course: CourseManifest): string {
  const composed = `${course.subtitle} ${course.heroSubhead}`;
  if (composed.length <= 158) return composed;
  return composed.slice(0, 155).trimEnd() + "…";
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Per-request render so enrolment lookup reflects the signed-in user.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseManifest(slug);
  if (!course) {
    return {
      title: "Course not found",
      description: "The course you're looking for doesn't exist.",
    };
  }

  const description = buildMetaDescription(course);
  const url = `${siteUrl}/courses/${course.slug}`;

  return {
    title: course.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${course.title} · ${siteName}`,
      description,
      url,
      siteName,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} · ${siteName}`,
      description,
    },
  };
}

async function getEnrolment(courseSlug: string): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    if (!user) return false;
    const enrolment = await prisma.enrolment.findUnique({
      where: { userId_courseSlug: { userId: user.id, courseSlug } },
      select: { id: true },
    });
    return Boolean(enrolment);
  } catch {
    return false;
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseManifest(slug);
  if (!course) notFound();

  const isEnrolled = await getEnrolment(course.slug);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[var(--color-dark-bg)] text-[var(--color-text-light)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 -right-24 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.30),rgba(16,185,129,0)_65%)] blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.16),rgba(52,211,153,0)_70%)] blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <FadeIn>
            <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link
                    href="/courses"
                    className="transition-colors hover:text-[var(--color-accent-green)]"
                  >
                    Courses
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-300">{course.title}</li>
              </ol>
            </nav>
          </FadeIn>

          <FadeIn delay={0.06}>
            <span
              className={`mt-6 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${levelStyles[course.level]}`}
            >
              {course.level}
            </span>
          </FadeIn>

          <FadeIn delay={0.12}>
            <h1 className="mt-5 max-w-3xl font-display text-[34px] font-bold leading-[1.08] tracking-tight sm:text-[44px] lg:text-[54px]">
              {course.heroHeading}
            </h1>
          </FadeIn>

          <FadeIn delay={0.18}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {course.heroSubhead}
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <dl className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
              <div className="inline-flex items-center gap-1">
                <dt className="sr-only">Modules</dt>
                <dd>{course.moduleCount} modules</dd>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="inline-flex items-center gap-1">
                <dt className="sr-only">Lessons</dt>
                <dd>{course.lessonCount} lessons</dd>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="inline-flex items-center gap-1">
                <dt className="sr-only">Format</dt>
                <dd>Text + interactive</dd>
              </div>
            </dl>
          </FadeIn>

          <FadeIn delay={0.32}>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <EnrollButton
                courseSlug={course.slug}
                priceDisplay={course.priceDisplay}
                isEnrolled={isEnrolled}
                className="px-6 py-3 text-sm sm:text-[15px]"
              />
              {!isEnrolled ? (
                <p className="text-xs text-slate-400">
                  One-time payment · Lifetime access · 14-day refund
                </p>
              ) : null}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              Who it&rsquo;s for
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Made for the people most AI courses ignore
            </h2>
          </FadeIn>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {course.whoItsFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-white p-5 dark:border-slate-800 dark:bg-[#0F172A]"
                style={{ borderWidth: "0.5px" }}
              >
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-mint)] text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
                  <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="text-[15px] leading-relaxed text-[var(--color-text-dark)] dark:text-slate-200">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              What you&rsquo;ll learn
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Skills you&rsquo;ll walk away with
            </h2>
          </FadeIn>

          <ul className="mt-10 grid gap-3">
            {course.whatYoullLearn.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--color-text-dark)] sm:text-base dark:text-slate-200"
              >
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-green)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Curriculum */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              Curriculum
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              {course.moduleCount} modules · {course.lessonCount} lessons
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
              Each module ends with a short review that unlocks the next. The
              final assessment unlocks your certificate.
            </p>
          </FadeIn>

          <div className="mt-10">
            <CurriculumGrid
              modules={course.modules}
              assessmentConfig={course.assessmentConfig}
            />
          </div>
        </div>
      </section>

      {/* How this course works */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              How this course works
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Read. Try. Check. Move on.
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg dark:text-slate-300">
              Read the lesson. Do the short interactive exercise inside it. Take
              the quick {course.assessmentConfig.lessonCheckQuestionsPer}-question check.
              Move on. Module reviews unlock the next module. A final
              assessment unlocks your certificate.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              FAQ
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Common questions
            </h2>
          </FadeIn>

          <div className="mt-10">
            <FaqAccordion items={course.faqs} />
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:hidden">
        <div
          className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border-subtle)] bg-white p-3 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-[#0F172A]"
          style={{ borderWidth: "0.5px" }}
        >
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium tracking-[0.18em] uppercase text-[var(--color-text-muted)]">
              {course.level}
            </p>
            <p className="truncate font-display text-base font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
              {course.priceDisplay}
            </p>
          </div>
          <EnrollButton
            courseSlug={course.slug}
            priceDisplay={course.priceDisplay}
            isEnrolled={isEnrolled}
            className="px-4 py-2 text-sm"
          />
        </div>
      </div>
    </>
  );
}

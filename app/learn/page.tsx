import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getCourseManifest } from "@/lib/courses";
import type { CourseManifest } from "@/lib/courses";
import { getProgressForCourse } from "@/lib/progress";
import type { CourseProgress } from "@/lib/progress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Learning",
  description:
    "Your AICraft Learning dashboard — continue your courses and track progress.",
};

type EnrolmentSummary = {
  manifest: CourseManifest;
  progress: CourseProgress;
  hasCertificate: boolean;
  verificationId: string | null;
  enrolledAt: Date;
};

async function loadEnrolments(userId: string): Promise<EnrolmentSummary[]> {
  const prisma = getPrisma();
  const enrolments = await prisma.enrolment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const summaries = await Promise.all(
    enrolments.map(async (enrolment) => {
      const manifest = await getCourseManifest(enrolment.courseSlug);
      if (!manifest) return null;
      const [progress, cert] = await Promise.all([
        getProgressForCourse(userId, manifest),
        prisma.certificate.findUnique({
          where: {
            userId_courseSlug: { userId, courseSlug: enrolment.courseSlug },
          },
        }),
      ]);
      return {
        manifest,
        progress,
        hasCertificate: Boolean(cert),
        verificationId: cert?.verificationId ?? null,
        enrolledAt: enrolment.createdAt,
      } satisfies EnrolmentSummary;
    }),
  );

  return summaries.filter((s): s is EnrolmentSummary => s !== null);
}

function pickContinueLearning(
  summaries: EnrolmentSummary[],
): EnrolmentSummary | null {
  const eligible = summaries.filter(
    (s) => !s.progress.allLessonsComplete && s.progress.nextIncompleteLesson,
  );
  if (eligible.length === 0) return null;

  const withTimes = eligible.map((s) => {
    const status = Object.values(s.progress.lessonStatusBySlug);
    const mostRecent = status
      .map((x) => x.lastReadAt)
      .filter((d): d is Date => d !== null)
      .sort((a, b) => b.getTime() - a.getTime())[0];
    return {
      summary: s,
      mostRecentRead: mostRecent ?? s.enrolledAt,
    };
  });

  withTimes.sort((a, b) => b.mostRecentRead.getTime() - a.mostRecentRead.getTime());
  return withTimes[0]?.summary ?? null;
}

export default async function LearnDashboardPage() {
  const user = await getOrCreateUser();
  const clerk = await currentUser();
  const firstName = clerk?.firstName?.trim() || null;

  const enrolments = await loadEnrolments(user.id);
  const continueLearning = pickContinueLearning(enrolments);

  const greeting = firstName ? `Welcome back, ${firstName}.` : "Welcome back.";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header>
        <p className="accent-bar text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-primary-green)]">
          My learning
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-[var(--color-text-dark)] sm:text-4xl dark:text-[var(--color-text-light)]">
          {greeting}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
          Pick up where you left off. Your progress is saved as you go.
        </p>
      </header>

      {enrolments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {continueLearning ? (
            <ContinueLearning summary={continueLearning} />
          ) : null}
          <CourseGrid summaries={enrolments} />
        </>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 rounded-2xl border border-[var(--color-border-subtle)] bg-white/60 p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      <h2 className="font-display text-2xl font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
        You haven&apos;t enrolled in a course yet.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--color-text-muted)]">
        Browse the catalogue and start a short, text-first course you can finish
        over a weekend.
      </p>
      <div className="mt-6">
        <Link
          href="/courses"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-deep-green)]"
        >
          Browse courses →
        </Link>
      </div>
    </div>
  );
}

function ContinueLearning({ summary }: { summary: EnrolmentSummary }) {
  const lesson = summary.progress.nextIncompleteLesson;
  if (!lesson) return null;

  return (
    <section className="mt-12">
      <h2 className="font-display text-lg font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
        Continue learning
      </h2>
      <article className="relative mt-4 overflow-hidden rounded-2xl bg-[var(--color-dark-bg)] p-8 text-[var(--color-text-light)] shadow-lg sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-24 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.30),rgba(16,185,129,0)_65%)] blur-3xl"
        />
        <div className="relative">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-accent-green)] uppercase">
            {summary.manifest.title}
          </p>
          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight sm:text-3xl">
            {lesson.title}
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            {summary.progress.completedLessons} of{" "}
            {summary.progress.totalLessons} lessons complete · {lesson.minutes}{" "}
            min read
          </p>
          <div className="mt-6">
            <Link
              href={`/learn/${summary.manifest.slug}/${lesson.slug}`}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-green)] hover:text-[var(--color-dark-bg)]"
            >
              Resume →
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}

function CourseGrid({ summaries }: { summaries: EnrolmentSummary[] }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-lg font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
        Your courses
      </h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {summaries.map((summary) => (
          <CourseCard key={summary.manifest.slug} summary={summary} />
        ))}
      </div>
    </section>
  );
}

function CourseCard({ summary }: { summary: EnrolmentSummary }) {
  const { manifest, progress, hasCertificate, verificationId } = summary;
  const pct = progress.totalLessons
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0;

  return (
    <article className="flex flex-col rounded-2xl border border-[var(--color-border-subtle)] bg-white/60 p-6 shadow-sm transition-colors hover:border-[var(--color-primary-green)]/40 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
          {manifest.title}
        </h3>
        <span className="inline-flex shrink-0 items-center rounded-full bg-[color-mix(in_oklab,var(--color-primary-green)_18%,transparent)] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[var(--color-deep-green)] uppercase dark:text-[var(--color-accent-green)]">
          {manifest.level}
        </span>
      </div>
      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
        Text-based · self-paced
      </p>

      <div className="mt-5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border-subtle)] dark:bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--color-primary-green)] transition-[width]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          {progress.completedLessons} of {progress.totalLessons} lessons complete
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/learn/${manifest.slug}`}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--color-primary-green)] px-4 py-2 text-sm font-medium text-[var(--color-deep-green)] transition-colors hover:bg-[var(--color-primary-green)] hover:text-white dark:text-[var(--color-accent-green)]"
        >
          Go to course →
        </Link>
        {hasCertificate && verificationId ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--color-primary-green)_18%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]">
              ✓ Certified
            </span>
            <Link
              href={`/learn/${manifest.slug}/certificate`}
              className="text-sm font-medium text-[var(--color-deep-green)] underline-offset-4 transition-colors hover:text-[var(--color-primary-green)] hover:underline dark:text-[var(--color-accent-green)]"
            >
              View certificate →
            </Link>
          </>
        ) : null}
      </div>
    </article>
  );
}

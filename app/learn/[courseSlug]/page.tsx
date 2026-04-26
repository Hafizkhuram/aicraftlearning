import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getCourseManifest } from "@/lib/courses";
import type { CourseManifest, CourseLesson } from "@/lib/courses";
import { getProgressForCourse } from "@/lib/progress";
import type { CourseProgress } from "@/lib/progress";
import { EnrollButton } from "@/components/ui/EnrollButton";
import { PurchaseSuccessBanner } from "@/components/learn/PurchaseSuccessBanner";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = await getCourseManifest(courseSlug);
  if (!course) {
    return { title: "Course not found" };
  }
  return {
    title: course.title,
    description: course.subtitle,
  };
}

async function loadEnrolment(userId: string, courseSlug: string) {
  const prisma = getPrisma();
  return prisma.enrolment.findUnique({
    where: { userId_courseSlug: { userId, courseSlug } },
  });
}

async function loadCertificate(userId: string, courseSlug: string) {
  const prisma = getPrisma();
  return prisma.certificate.findUnique({
    where: { userId_courseSlug: { userId, courseSlug } },
  });
}

async function loadLatestAssessment(userId: string, courseSlug: string) {
  const prisma = getPrisma();
  return prisma.assessmentAttempt.findFirst({
    where: { userId, courseSlug },
    orderBy: { completedAt: "desc" },
  });
}

export default async function CourseHomePage({ params }: PageProps) {
  const { courseSlug } = await params;
  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) notFound();

  const user = await getOrCreateUser();
  const enrolment = await loadEnrolment(user.id, courseSlug);

  if (!enrolment) {
    return (
      <>
        <PurchaseSuccessBanner courseSlug={courseSlug} />
        <NotEnrolled course={manifest} />
      </>
    );
  }

  const [progress, certificate, latestAttempt] = await Promise.all([
    getProgressForCourse(user.id, manifest),
    loadCertificate(user.id, courseSlug),
    loadLatestAssessment(user.id, courseSlug),
  ]);

  const overallPct = progress.totalLessons
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0;

  const assessmentState = computeAssessmentState({
    progress,
    certificate,
    latestAttempt,
    cooldownHours: manifest.assessmentConfig.retakeCooldownHours,
  });

  return (
    <>
      <PurchaseSuccessBanner courseSlug={courseSlug} />
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-text-muted)]">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              href="/learn"
              className="transition-colors hover:text-[var(--color-deep-green)]"
            >
              My Learning
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
            {manifest.title}
          </li>
        </ol>
      </nav>

      <header className="mt-6">
        <p className="accent-bar text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-primary-green)]">
          {manifest.level}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-[var(--color-text-dark)] sm:text-4xl dark:text-[var(--color-text-light)]">
          {manifest.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
          {manifest.subtitle}
        </p>

        <div className="mt-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border-subtle)] dark:bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--color-primary-green)] transition-[width]"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {progress.completedLessons} of {progress.totalLessons} lessons
            complete · {overallPct}%
          </p>
        </div>
      </header>

      <div className="mt-10 space-y-8">
        {manifest.modules.map((module) => (
          <ModuleSection
            key={module.number}
            courseSlug={manifest.slug}
            moduleNumber={module.number}
            title={module.title}
            description={module.description}
            lessons={module.lessons}
            progress={progress}
          />
        ))}
      </div>

      <AssessmentCard
        courseSlug={manifest.slug}
        manifest={manifest}
        state={assessmentState}
      />
    </section>
    </>
  );
}

function NotEnrolled({ course }: { course: CourseManifest }) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="accent-bar mx-auto inline-block text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-primary-green)]">
        Not enrolled
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-[var(--color-text-dark)] sm:text-4xl dark:text-[var(--color-text-light)]">
        Enrol to start {course.title}.
      </h1>
      <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">
        You aren&apos;t enrolled in this course yet. Enrol to unlock the
        lessons, module reviews and final assessment.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <EnrollButton
          courseSlug={course.slug}
          priceDisplay={course.priceDisplay}
        />
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--color-primary-green)] px-5 py-2.5 text-sm font-medium text-[var(--color-deep-green)] transition-colors hover:bg-[var(--color-primary-green)] hover:text-white dark:text-[var(--color-accent-green)]"
        >
          See what&apos;s inside →
        </Link>
      </div>
    </section>
  );
}

function ModuleSection({
  courseSlug,
  moduleNumber,
  title,
  description,
  lessons,
  progress,
}: {
  courseSlug: string;
  moduleNumber: number;
  title: string;
  description: string;
  lessons: CourseLesson[];
  progress: CourseProgress;
}) {
  const nextIncompleteSlug = progress.nextIncompleteLesson?.slug ?? null;

  return (
    <article>
      <header>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-primary-green)] uppercase">
          Module {moduleNumber}
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {description}
        </p>
      </header>

      <ol className="mt-4 divide-y divide-[var(--color-border-subtle)] overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-white/60 dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.03]">
        {lessons.map((lesson) => {
          const status = progress.lessonStatusBySlug[lesson.slug];
          const isCompleted = status?.completed ?? false;
          const isResume = lesson.slug === nextIncompleteSlug;
          return (
            <li
              key={lesson.slug}
              className="flex items-center gap-4 px-4 py-3 sm:px-5"
            >
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                  isCompleted
                    ? "border-[var(--color-primary-green)] bg-[var(--color-primary-green)] text-white"
                    : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] dark:border-white/20"
                }`}
              >
                {isCompleted ? "✓" : ""}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
                    {lesson.title}
                  </p>
                  {lesson.isReview ? (
                    <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--color-warning)_22%,transparent)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#92400E] uppercase dark:text-[var(--color-warning)]">
                      Review
                    </span>
                  ) : null}
                  {isResume ? (
                    <span className="inline-flex items-center rounded-full bg-[color-mix(in_oklab,var(--color-primary-green)_18%,transparent)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--color-deep-green)] uppercase dark:text-[var(--color-accent-green)]">
                      Resume here
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {lesson.minutes} min
                </p>
              </div>

              <Link
                href={`/learn/${courseSlug}/${lesson.slug}`}
                className="shrink-0 text-sm font-medium text-[var(--color-deep-green)] underline-offset-4 transition-colors hover:text-[var(--color-primary-green)] hover:underline dark:text-[var(--color-accent-green)]"
              >
                {isCompleted ? "Review" : "Start"} →
              </Link>
            </li>
          );
        })}
      </ol>
    </article>
  );
}

type AssessmentState =
  | { kind: "locked"; lockedReason: string }
  | { kind: "available" }
  | {
      kind: "cooldown";
      hoursUntilRetake: number;
      lastAttemptAt: Date;
      lastScore: number;
      lastTotal: number;
    }
  | {
      kind: "passed";
      verificationId: string;
      issuedAt: Date;
    };

function computeAssessmentState({
  progress,
  certificate,
  latestAttempt,
  cooldownHours,
}: {
  progress: CourseProgress;
  certificate: { verificationId: string; issuedAt: Date } | null;
  latestAttempt: {
    passed: boolean;
    completedAt: Date;
    score: number;
    totalQuestions: number;
  } | null;
  cooldownHours: number;
}): AssessmentState {
  if (certificate) {
    return {
      kind: "passed",
      verificationId: certificate.verificationId,
      issuedAt: certificate.issuedAt,
    };
  }

  if (!progress.allLessonsComplete) {
    return {
      kind: "locked",
      lockedReason: `Finish all ${progress.totalLessons} lessons and module reviews to unlock the final assessment.`,
    };
  }

  if (latestAttempt && !latestAttempt.passed) {
    const cooldownMs = cooldownHours * 60 * 60 * 1000;
    const elapsed = Date.now() - latestAttempt.completedAt.getTime();
    if (elapsed < cooldownMs) {
      const remaining = Math.max(1, Math.ceil((cooldownMs - elapsed) / (60 * 60 * 1000)));
      return {
        kind: "cooldown",
        hoursUntilRetake: remaining,
        lastAttemptAt: latestAttempt.completedAt,
        lastScore: latestAttempt.score,
        lastTotal: latestAttempt.totalQuestions,
      };
    }
  }

  return { kind: "available" };
}

function AssessmentCard({
  courseSlug,
  manifest,
  state,
}: {
  courseSlug: string;
  manifest: CourseManifest;
  state: AssessmentState;
}) {
  const baseClasses =
    "mt-12 overflow-hidden rounded-2xl border p-7 sm:p-8 shadow-sm";

  if (state.kind === "passed") {
    return (
      <article
        className={`${baseClasses} border-[var(--color-primary-green)]/30 bg-[color-mix(in_oklab,var(--color-primary-green)_8%,transparent)]`}
      >
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-deep-green)] uppercase dark:text-[var(--color-accent-green)]">
          Certified ✓
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
          {manifest.title}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Issued {state.issuedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} ·
          ID {state.verificationId}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={`/learn/${courseSlug}/certificate`}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-deep-green)]"
          >
            View certificate →
          </Link>
          <Link
            href={`/certificate/${state.verificationId}`}
            className="text-sm font-medium text-[var(--color-deep-green)] underline-offset-4 transition-colors hover:text-[var(--color-primary-green)] hover:underline dark:text-[var(--color-accent-green)]"
          >
            Public verification page →
          </Link>
        </div>
      </article>
    );
  }

  if (state.kind === "available") {
    return (
      <article
        className={`${baseClasses} border-[var(--color-border-subtle)] bg-white/60 dark:border-white/10 dark:bg-white/[0.03]`}
      >
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-primary-green)] uppercase">
          Final assessment
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
          You&apos;ve completed the course. Time to earn your certificate.
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {manifest.assessmentConfig.questionCount} questions across all four
          modules. Pass with {manifest.assessmentConfig.passMarkPercent}% to
          earn your verifiable certificate.
        </p>
        <div className="mt-5">
          <Link
            href={`/learn/${courseSlug}/assessment`}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-deep-green)]"
          >
            Start the assessment →
          </Link>
        </div>
      </article>
    );
  }

  if (state.kind === "cooldown") {
    return (
      <article
        className={`${baseClasses} border-[var(--color-warning)]/40 bg-[color-mix(in_oklab,var(--color-warning)_10%,transparent)]`}
      >
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#92400E] uppercase dark:text-[var(--color-warning)]">
          Take a breath — retake in {state.hoursUntilRetake}h
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
          Last attempt: {state.lastScore} / {state.lastTotal}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          You attempted the assessment less than{" "}
          {manifest.assessmentConfig.retakeCooldownHours} hours ago. The retake
          unlocks in about {state.hoursUntilRetake} hour
          {state.hoursUntilRetake === 1 ? "" : "s"}.
        </p>
      </article>
    );
  }

  return (
    <article
      className={`${baseClasses} border-dashed border-[var(--color-border-subtle)] bg-white/40 dark:border-white/10 dark:bg-white/[0.02]`}
    >
      <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-text-muted)] uppercase">
        Final assessment · locked
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
        Keep going — you&apos;re on your way.
      </h2>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        {state.lockedReason}
      </p>
    </article>
  );
}

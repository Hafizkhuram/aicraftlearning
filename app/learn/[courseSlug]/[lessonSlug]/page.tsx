import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getCourseManifest } from "@/lib/courses";
import type { CourseLesson, CourseManifest } from "@/lib/courses";
import { getProgressForCourse, setLastRead } from "@/lib/progress";
import { LessonViewer } from "@/components/learn/LessonViewer";
import { LessonSidebar } from "@/components/learn/LessonSidebar";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) return { title: "Lesson not found" };
  const found = findLesson(manifest, lessonSlug);
  if (!found) return { title: "Lesson not found" };
  return {
    title: `${found.lesson.title} · ${manifest.title}`,
    description: manifest.subtitle,
  };
}

type FoundLesson = {
  lesson: CourseLesson;
  moduleNumber: number;
  indexInModule: number;
  flatIndex: number;
};

function findLesson(
  manifest: CourseManifest,
  lessonSlug: string,
): FoundLesson | null {
  let flatIndex = 0;
  for (const mod of manifest.modules) {
    let indexInModule = 0;
    for (const lesson of mod.lessons) {
      if (!lesson.isReview) indexInModule += 1;
      if (lesson.slug === lessonSlug) {
        return {
          lesson,
          moduleNumber: mod.number,
          indexInModule: lesson.isReview ? 0 : indexInModule,
          flatIndex,
        };
      }
      flatIndex += 1;
    }
  }
  return null;
}

function flatLessons(manifest: CourseManifest): CourseLesson[] {
  return manifest.modules.flatMap((m) => m.lessons);
}

export default async function LessonPage({ params }: PageProps) {
  const { courseSlug, lessonSlug } = await params;

  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) notFound();

  const found = findLesson(manifest, lessonSlug);
  if (!found) notFound();

  const user = await getOrCreateUser();

  const prisma = getPrisma();
  const enrolment = await prisma.enrolment.findUnique({
    where: { userId_courseSlug: { userId: user.id, courseSlug } },
    select: { id: true },
  });
  if (!enrolment) redirect(`/courses/${courseSlug}`);

  await setLastRead(user.id, courseSlug, lessonSlug);

  const [progress, certificate] = await Promise.all([
    getProgressForCourse(user.id, manifest),
    prisma.certificate.findUnique({
      where: { userId_courseSlug: { userId: user.id, courseSlug } },
      select: { verificationId: true },
    }),
  ]);

  const all = flatLessons(manifest);
  const next = all[found.flatIndex + 1] ?? null;

  const assessmentState: "locked" | "available" | "passed" = certificate
    ? "passed"
    : progress.allLessonsComplete
      ? "available"
      : "locked";

  return (
    <LessonViewer
      courseSlug={courseSlug}
      currentLesson={{
        slug: found.lesson.slug,
        title: found.lesson.title,
        minutes: found.lesson.minutes,
        htmlPath: found.lesson.htmlPath,
        moduleNumber: found.moduleNumber,
        indexInModule: found.indexInModule || 1,
      }}
      nextLesson={
        next
          ? { slug: next.slug, title: next.title }
          : null
      }
      sidebar={
        <LessonSidebar
          manifest={manifest}
          progress={progress}
          currentLessonSlug={lessonSlug}
          assessmentState={assessmentState}
        />
      }
    />
  );
}

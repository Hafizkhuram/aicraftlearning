import type { LessonProgress } from "@prisma/client";
import { getPrisma } from "./db";
import type { CourseManifest, CourseLesson } from "./courses";

export type LessonStatus = {
  slug: string;
  completed: boolean;
  lastReadAt: Date | null;
};

export type CourseProgress = {
  courseSlug: string;
  totalLessons: number;
  completedLessons: number;
  lessonStatusBySlug: Record<string, LessonStatus>;
  lastReadLessonSlug: string | null;
  nextIncompleteLesson: CourseLesson | null;
  allLessonsComplete: boolean;
};

function flattenLessons(manifest: CourseManifest): CourseLesson[] {
  return manifest.modules.flatMap((m) => m.lessons);
}

export async function getProgressForCourse(
  userId: string,
  manifest: CourseManifest,
): Promise<CourseProgress> {
  const prisma = getPrisma();
  const rows = await prisma.lessonProgress.findMany({
    where: { userId, courseSlug: manifest.slug },
  });

  const byLesson = new Map<string, LessonProgress>();
  for (const row of rows) byLesson.set(row.lessonSlug, row);

  const allLessons = flattenLessons(manifest);
  const lessonStatusBySlug: Record<string, LessonStatus> = {};
  for (const lesson of allLessons) {
    const row = byLesson.get(lesson.slug);
    lessonStatusBySlug[lesson.slug] = {
      slug: lesson.slug,
      completed: row?.completed ?? false,
      lastReadAt: row?.lastReadAt ?? null,
    };
  }

  const completedLessons = allLessons.filter(
    (l) => lessonStatusBySlug[l.slug].completed,
  ).length;

  const sortedByLastRead = [...rows]
    .filter((r) => r.lastReadAt)
    .sort((a, b) => b.lastReadAt.getTime() - a.lastReadAt.getTime());
  const lastReadLessonSlug = sortedByLastRead[0]?.lessonSlug ?? null;

  const nextIncompleteLesson =
    allLessons.find((l) => !lessonStatusBySlug[l.slug].completed) ?? null;

  return {
    courseSlug: manifest.slug,
    totalLessons: allLessons.length,
    completedLessons,
    lessonStatusBySlug,
    lastReadLessonSlug,
    nextIncompleteLesson,
    allLessonsComplete: completedLessons === allLessons.length,
  };
}

export async function setLastRead(
  userId: string,
  courseSlug: string,
  lessonSlug: string,
): Promise<void> {
  const prisma = getPrisma();
  await prisma.lessonProgress.upsert({
    where: {
      userId_courseSlug_lessonSlug: { userId, courseSlug, lessonSlug },
    },
    create: {
      userId,
      courseSlug,
      lessonSlug,
      completed: false,
      lastReadAt: new Date(),
    },
    update: { lastReadAt: new Date() },
  });
}

export async function markLessonComplete(
  userId: string,
  courseSlug: string,
  lessonSlug: string,
): Promise<LessonProgress> {
  const prisma = getPrisma();
  return prisma.lessonProgress.upsert({
    where: {
      userId_courseSlug_lessonSlug: { userId, courseSlug, lessonSlug },
    },
    create: {
      userId,
      courseSlug,
      lessonSlug,
      completed: true,
      lastReadAt: new Date(),
    },
    update: { completed: true, lastReadAt: new Date() },
  });
}

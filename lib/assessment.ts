import type { AssessmentAttempt } from "@prisma/client";
import { getPrisma } from "./db";
import type { CourseManifest } from "./courses";
import { getProgressForCourse } from "./progress";

export type AssessmentGate = {
  allLessonsComplete: boolean;
  hasCertificate: boolean;
  verificationId: string | null;
  canRetake: boolean;
  hoursUntilRetake: number;
  lastAttempt: {
    id: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
    completedAt: Date;
  } | null;
};

export async function getAssessmentGate({
  userId,
  manifest,
}: {
  userId: string;
  manifest: CourseManifest;
}): Promise<AssessmentGate> {
  const prisma = getPrisma();
  const [progress, certificate, lastAttempt] = await Promise.all([
    getProgressForCourse(userId, manifest),
    prisma.certificate.findUnique({
      where: {
        userId_courseSlug: { userId, courseSlug: manifest.slug },
      },
    }),
    prisma.assessmentAttempt.findFirst({
      where: { userId, courseSlug: manifest.slug },
      orderBy: { completedAt: "desc" },
    }),
  ]);

  const cooldownMs = manifest.assessmentConfig.retakeCooldownHours * 60 * 60 * 1000;
  let canRetake = true;
  let hoursUntilRetake = 0;

  if (lastAttempt && !lastAttempt.passed) {
    const elapsed = Date.now() - lastAttempt.completedAt.getTime();
    if (elapsed < cooldownMs) {
      canRetake = false;
      hoursUntilRetake = Math.max(
        1,
        Math.ceil((cooldownMs - elapsed) / (60 * 60 * 1000)),
      );
    }
  }

  return {
    allLessonsComplete: progress.allLessonsComplete,
    hasCertificate: Boolean(certificate),
    verificationId: certificate?.verificationId ?? null,
    canRetake,
    hoursUntilRetake,
    lastAttempt: lastAttempt
      ? {
          id: lastAttempt.id,
          score: lastAttempt.score,
          totalQuestions: lastAttempt.totalQuestions,
          passed: lastAttempt.passed,
          completedAt: lastAttempt.completedAt,
        }
      : null,
  };
}

export async function recordAttempt({
  userId,
  courseSlug,
  answers,
  score,
  totalQuestions,
  passed,
}: {
  userId: string;
  courseSlug: string;
  answers: boolean[];
  score: number;
  totalQuestions: number;
  passed: boolean;
}): Promise<AssessmentAttempt> {
  const prisma = getPrisma();
  return prisma.assessmentAttempt.create({
    data: {
      userId,
      courseSlug,
      score,
      totalQuestions,
      passed,
      answers: answers as unknown as object,
    },
  });
}

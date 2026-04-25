import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getCourseManifest } from "@/lib/courses";
import { getProgressForCourse } from "@/lib/progress";
import { getAssessmentGate } from "@/lib/assessment";
import { AssessmentShell } from "@/components/learn/AssessmentShell";
import { LessonSidebar } from "@/components/learn/LessonSidebar";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) return { title: "Final assessment" };
  return {
    title: `Final assessment · ${manifest.title}`,
    description: `Final assessment for ${manifest.title}.`,
  };
}

export default async function AssessmentPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) notFound();

  const user = await getOrCreateUser();
  const prisma = getPrisma();
  const enrolment = await prisma.enrolment.findUnique({
    where: { userId_courseSlug: { userId: user.id, courseSlug } },
    select: { id: true },
  });
  if (!enrolment) redirect(`/courses/${courseSlug}`);

  const gate = await getAssessmentGate({ userId: user.id, manifest });

  if (gate.hasCertificate) redirect(`/learn/${courseSlug}/certificate`);
  if (!gate.allLessonsComplete) redirect(`/learn/${courseSlug}`);
  if (!gate.canRetake) redirect(`/learn/${courseSlug}`);

  const progress = await getProgressForCourse(user.id, manifest);

  return (
    <AssessmentShell
      courseSlug={courseSlug}
      courseTitle={manifest.title}
      assessmentHtmlPath={manifest.assessmentHtmlPath}
      passMarkPercent={manifest.assessmentConfig.passMarkPercent}
      totalQuestions={manifest.assessmentConfig.questionCount}
      sidebar={
        <LessonSidebar
          manifest={manifest}
          progress={progress}
          currentLessonSlug={null}
          assessmentState="available"
          isAssessmentActive
        />
      }
    />
  );
}

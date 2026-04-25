import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getCourseManifest } from "@/lib/courses";
import { markLessonComplete } from "@/lib/progress";

type Body = {
  courseSlug?: unknown;
  lessonSlug?: unknown;
  score?: unknown;
  total?: unknown;
};

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const courseSlug =
    typeof body.courseSlug === "string" ? body.courseSlug : null;
  const lessonSlug =
    typeof body.lessonSlug === "string" ? body.lessonSlug : null;
  if (!courseSlug || !lessonSlug) {
    return NextResponse.json(
      { error: "courseSlug and lessonSlug are required" },
      { status: 400 },
    );
  }

  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }
  const lessonExists = manifest.modules.some((m) =>
    m.lessons.some((l) => l.slug === lessonSlug),
  );
  if (!lessonExists) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const user = await getOrCreateUser();

  const prisma = getPrisma();
  const enrolment = await prisma.enrolment.findUnique({
    where: { userId_courseSlug: { userId: user.id, courseSlug } },
    select: { id: true },
  });
  if (!enrolment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  const progress = await markLessonComplete(user.id, courseSlug, lessonSlug);

  return NextResponse.json({
    ok: true,
    progress: {
      lessonSlug: progress.lessonSlug,
      completed: progress.completed,
      lastReadAt: progress.lastReadAt,
    },
  });
}

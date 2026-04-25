import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { getCourseManifest } from "@/lib/courses";
import { getAssessmentGate } from "@/lib/assessment";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get("courseSlug");
  if (!courseSlug) {
    return NextResponse.json(
      { error: "courseSlug query param required" },
      { status: 400 },
    );
  }

  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const user = await getOrCreateUser();
  const gate = await getAssessmentGate({ userId: user.id, manifest });

  return NextResponse.json({
    allLessonsComplete: gate.allLessonsComplete,
    canRetake: gate.canRetake,
    hoursUntilRetake: gate.hoursUntilRetake,
    hasCertificate: gate.hasCertificate,
    verificationId: gate.verificationId,
  });
}

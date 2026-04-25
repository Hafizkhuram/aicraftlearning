import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getCourseManifest } from "@/lib/courses";
import { issueCertificate } from "@/lib/certificates";

type Body = {
  courseSlug?: unknown;
  name?: unknown;
};

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
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
  const rawName = typeof body.name === "string" ? body.name.trim() : "";

  if (!courseSlug) {
    return NextResponse.json(
      { error: "courseSlug is required" },
      { status: 400 },
    );
  }
  if (rawName.length < 2 || rawName.length > 80) {
    return NextResponse.json(
      { error: "name must be between 2 and 80 characters" },
      { status: 400 },
    );
  }

  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const user = await getOrCreateUser();
  const prisma = getPrisma();

  // Must have at least one passing attempt for this course.
  const passingAttempt = await prisma.assessmentAttempt.findFirst({
    where: { userId: user.id, courseSlug, passed: true },
  });
  if (!passingAttempt) {
    return NextResponse.json(
      { error: "No passing attempt found" },
      { status: 403 },
    );
  }

  const certificate = await issueCertificate({
    userId: user.id,
    manifest,
    learnerName: rawName,
  });

  return NextResponse.json({
    ok: true,
    verificationId: certificate.verificationId,
    learnerName: certificate.learnerName,
  });
}

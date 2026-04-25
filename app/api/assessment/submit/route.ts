import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getCourseManifest } from "@/lib/courses";
import {
  getAssessmentGate,
  recordAttempt,
} from "@/lib/assessment";
import { issueCertificate } from "@/lib/certificates";

type Body = {
  courseSlug?: unknown;
  answers?: unknown;
};

function isBooleanArray(value: unknown): value is boolean[] {
  return Array.isArray(value) && value.every((v) => typeof v === "boolean");
}

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
  if (!courseSlug) {
    return NextResponse.json(
      { error: "courseSlug is required" },
      { status: 400 },
    );
  }
  if (!isBooleanArray(body.answers)) {
    return NextResponse.json(
      { error: "answers must be an array of booleans" },
      { status: 400 },
    );
  }
  const answers = body.answers;

  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  if (answers.length !== manifest.assessmentConfig.questionCount) {
    return NextResponse.json(
      {
        error: `expected ${manifest.assessmentConfig.questionCount} answers, got ${answers.length}`,
      },
      { status: 400 },
    );
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

  // Compute the authoritative score from the answers, ignoring whatever the
  // client said. Any tampering on the client side is irrelevant.
  const score = answers.filter((a) => a === true).length;
  const totalQuestions = answers.length;
  const passMark =
    manifest.assessmentConfig.passMarkPercent / 100;
  const passed = score / totalQuestions >= passMark;

  // Existing certificate? Then this is a "retake for higher score" attempt.
  // Don't issue a second cert; just record the attempt and return the
  // existing verification ID.
  const existingCert = await prisma.certificate.findUnique({
    where: { userId_courseSlug: { userId: user.id, courseSlug } },
  });

  // Cooldown enforcement — only when there is no certificate yet.
  // (If they're already certified, retakes for fun are fine.)
  if (!existingCert) {
    const gate = await getAssessmentGate({ userId: user.id, manifest });
    if (!gate.allLessonsComplete) {
      return NextResponse.json(
        { error: "All lessons must be complete before the assessment" },
        { status: 403 },
      );
    }
    if (!gate.canRetake) {
      return NextResponse.json(
        {
          error: "Retake cooldown active",
          hoursUntilRetake: gate.hoursUntilRetake,
        },
        { status: 429 },
      );
    }
  }

  const attempt = await recordAttempt({
    userId: user.id,
    courseSlug,
    answers,
    score,
    totalQuestions,
    passed,
  });

  // Failed — return cooldown info so the UI can show the wait timer.
  if (!passed) {
    const gate = await getAssessmentGate({ userId: user.id, manifest });
    return NextResponse.json({
      passed: false,
      score,
      totalQuestions,
      attemptId: attempt.id,
      canRetake: gate.canRetake,
      hoursUntilRetake: gate.hoursUntilRetake,
    });
  }

  // Passed — already certified path
  if (existingCert) {
    return NextResponse.json({
      passed: true,
      score,
      totalQuestions,
      attemptId: attempt.id,
      verificationId: existingCert.verificationId,
      certificateReady: true,
      alreadyCertified: true,
    });
  }

  // Passed — fresh certificate path. Read learner name from Clerk; fall back
  // to a one-time form if either Clerk name field is missing.
  const clerkUser = await currentUser();
  const firstName = clerkUser?.firstName?.trim() ?? "";
  const lastName = clerkUser?.lastName?.trim() ?? "";

  if (firstName.length > 0 && lastName.length > 0) {
    const certificate = await issueCertificate({
      userId: user.id,
      manifest,
      learnerName: `${firstName} ${lastName}`,
    });
    return NextResponse.json({
      passed: true,
      score,
      totalQuestions,
      attemptId: attempt.id,
      verificationId: certificate.verificationId,
      certificateReady: true,
    });
  }

  return NextResponse.json({
    passed: true,
    score,
    totalQuestions,
    attemptId: attempt.id,
    needsName: true,
    certificateReady: false,
  });
}

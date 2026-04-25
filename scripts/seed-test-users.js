#!/usr/bin/env node

/*
 * Developer-only seed script for QA. Brings the listed test users to a
 * fully-enrolled, fully-progressed, certified state in all three
 * self-serve courses, so the dashboard / course home / sidebar /
 * certificate viewer / public certificate URL flows can be walked
 * without hand-completing 50 quizzes.
 *
 * Run commands:
 *   Seed:    SEED_CONFIRM=yes npx tsx scripts/seed-test-users.js
 *   Cleanup: SEED_CONFIRM=yes npx tsx scripts/seed-test-users.js --cleanup
 *
 * Writes seed data to the live Neon DB for development QA only.
 * See the test user list at the top of this file.
 * Idempotent — safe to re-run.
 *
 * Why npx tsx (not plain node)?
 *   This script imports issueCertificate from lib/certificates.ts so
 *   the verification-ID generator stays single-source. Plain node
 *   can't load TypeScript; tsx provides the runtime transpile.
 *
 * Why @clerk/backend (not @clerk/clerk-sdk-node)?
 *   @clerk/backend is the modern Clerk v6 Node SDK and is already
 *   installed as a transitive dep of @clerk/nextjs. The older
 *   @clerk/clerk-sdk-node package is being phased out.
 *
 * AIOS Mastery is excluded — high-touch programme with no /learn page.
 */

// ----- Hard guard: refuse to run without explicit confirmation. -----
if (process.env.SEED_CONFIRM !== "yes") {
  console.error(
    "Refusing to run without SEED_CONFIRM=yes. Aborting.\n" +
      "Use: SEED_CONFIRM=yes npx tsx scripts/seed-test-users.js [--cleanup]",
  );
  process.exit(1);
}

// Load .env.local so DATABASE_URL and CLERK_SECRET_KEY are available.
require("dotenv").config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const { createClerkClient } = require("@clerk/backend");
const { getPrisma } = require("../lib/db");
const { issueCertificate } = require("../lib/certificates");

// ============================================================
// Config — edit this list to add or remove seeded test users.
// ============================================================
const TEST_USER_EMAILS = [
  "soha.fatima03@gmail.com",
  "khuram-shahzad@outlook.com",
];

const COURSE_SLUGS = [
  "ai-fundamentals",
  "claude-code-mastery",
  "ai-agents-workflows",
];

// ============================================================
const isCleanup = process.argv.includes("--cleanup");

if (!process.env.CLERK_SECRET_KEY) {
  console.error("CLERK_SECRET_KEY is not set (check .env.local). Aborting.");
  process.exit(1);
}

const prisma = getPrisma();
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// ----- Banner + pause -----

function padRight(str, width) {
  // Trim any over-long strings rather than disrupt the box.
  const s = String(str);
  if (s.length >= width) return s.slice(0, width);
  return s + " ".repeat(width - s.length);
}

function printBanner(lines) {
  const innerWidth = 61; // 63 - 2 padding spaces
  const top = "┌" + "─".repeat(innerWidth + 2) + "┐";
  const sep = "├" + "─".repeat(innerWidth + 2) + "┤";
  const bottom = "└" + "─".repeat(innerWidth + 2) + "┘";

  console.log(top);
  for (const line of lines) {
    if (line === "---") {
      console.log(sep);
    } else {
      console.log(`│ ${padRight(line, innerWidth)} │`);
    }
  }
  console.log(bottom);
}

function userListLines(emails) {
  return emails.map((e) => `  - ${e}`);
}

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function announceSeed() {
  printBanner([
    "AICRAFT SEED SCRIPT — WRITING TO LIVE NEON DB",
    "---",
    "Target users:",
    ...userListLines(TEST_USER_EMAILS),
    "",
    "This will create real Enrolment, LessonProgress,",
    "AssessmentAttempt, and Certificate rows that will be",
    "visible on the live Railway site immediately.",
    "",
    "Verification certificate URLs will be publicly viewable.",
    "",
    "Run with --cleanup to remove all seed data before launch.",
  ]);
  console.log("\nProceeding in 3 seconds. Ctrl+C to abort.\n");
  await pause(3000);
}

async function announceCleanup() {
  printBanner([
    "AICRAFT SEED SCRIPT — DELETING FROM LIVE NEON DB",
    "---",
    "Target users:",
    ...userListLines(TEST_USER_EMAILS),
    "",
    "This will delete every Certificate, AssessmentAttempt,",
    "LessonProgress, and Enrolment row owned by these users",
    "for the three self-serve courses. Deletes are irreversible.",
    "",
    "User rows themselves are NOT deleted (Clerk owns identity).",
    "",
    "Public certificate URLs will 404 immediately after this runs.",
  ]);
  console.log("\nProceeding in 3 seconds. Ctrl+C to abort.\n");
  await pause(3000);
}

// ----- Helpers -----

function readManifest(slug) {
  const fp = path.join(__dirname, "..", "content", "courses", `${slug}.json`);
  return JSON.parse(fs.readFileSync(fp, "utf8"));
}

function pickPrimaryEmail(clerkUser) {
  const primary = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId,
  );
  return primary?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? null;
}

function pickLearnerName(clerkUser, fallbackEmail) {
  const first = (clerkUser.firstName || "").trim();
  const last = (clerkUser.lastName || "").trim();
  const joined = `${first} ${last}`.trim();
  if (joined.length > 0) return joined;
  return fallbackEmail.split("@")[0];
}

async function lookupClerkUser(email) {
  const list = await clerk.users.getUserList({ emailAddress: [email] });
  // Recent @clerk/backend versions return a paginated { data, totalCount }
  // shape; older ones return a plain array. Handle both.
  const data = Array.isArray(list) ? list : list?.data;
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

// ----- Seed one (user × course) -----

async function seedUserCourse({ dbUserId, courseSlug, learnerName }) {
  const manifest = readManifest(courseSlug);

  // Enrolment — keyed on (userId, courseSlug).
  // stripeSessionId is null on purpose: marks this as seed data, not a
  // real Stripe purchase. The column is nullable as of the 2026-04-25
  // schema reconciliation with the live Neon DB.
  await prisma.enrolment.upsert({
    where: { userId_courseSlug: { userId: dbUserId, courseSlug } },
    create: {
      userId: dbUserId,
      courseSlug,
      stripeSessionId: null,
    },
    update: {},
  });

  // LessonProgress — every lesson AND every module review.
  const allItems = manifest.modules.flatMap((m) => m.lessons);
  const now = new Date();
  for (const lesson of allItems) {
    await prisma.lessonProgress.upsert({
      where: {
        userId_courseSlug_lessonSlug: {
          userId: dbUserId,
          courseSlug,
          lessonSlug: lesson.slug,
        },
      },
      create: {
        userId: dbUserId,
        courseSlug,
        lessonSlug: lesson.slug,
        completed: true,
        lastReadAt: now,
      },
      update: {
        completed: true,
        lastReadAt: now,
      },
    });
  }

  // AssessmentAttempt — perfect score, only insert if no passing attempt
  // exists for this (userId, courseSlug). The schema has no unique
  // constraint on attempts (users can retake), so we guard manually.
  const existingPass = await prisma.assessmentAttempt.findFirst({
    where: { userId: dbUserId, courseSlug, passed: true },
  });
  if (!existingPass) {
    const total = manifest.assessmentConfig.questionCount;
    await prisma.assessmentAttempt.create({
      data: {
        userId: dbUserId,
        courseSlug,
        score: total,
        totalQuestions: total,
        passed: true,
        // {} satisfies the non-null Json column without fabricating
        // realistic-looking answers. The reconciled schema requires non-null.
        answers: {},
      },
    });
  }

  // Certificate — delegated to the canonical issuer in lib/certificates.ts.
  // issueCertificate is idempotent: returns the existing row if one exists,
  // otherwise creates a new one with a crypto-random verification ID.
  await issueCertificate({
    userId: dbUserId,
    manifest,
    learnerName,
  });

  return { lessonsTouched: allItems.length };
}

// ----- Cleanup one (user × course) -----

async function cleanupUserCourse({ dbUserId, courseSlug }) {
  // Delete order: Certificate → AssessmentAttempt → LessonProgress → Enrolment.
  // FK targets are all User; this order is safe per the schema.
  await prisma.certificate.deleteMany({
    where: { userId: dbUserId, courseSlug },
  });
  await prisma.assessmentAttempt.deleteMany({
    where: { userId: dbUserId, courseSlug },
  });
  await prisma.lessonProgress.deleteMany({
    where: { userId: dbUserId, courseSlug },
  });
  await prisma.enrolment.deleteMany({
    where: { userId: dbUserId, courseSlug },
  });
}

// ----- Main -----

async function main() {
  // Banner + 3s pause is the last gate before any DB write happens.
  // Cheap insurance against accidental runs in the wrong terminal session.
  if (isCleanup) {
    await announceCleanup();
  } else {
    await announceSeed();
  }

  console.log(`Targeting ${TEST_USER_EMAILS.length} user(s) × ${COURSE_SLUGS.length} course(s).\n`);

  const summary = [];

  for (const email of TEST_USER_EMAILS) {
    const clerkUser = await lookupClerkUser(email);
    if (!clerkUser) {
      console.warn(`  SKIP  ${email} — no Clerk user found.`);
      continue;
    }

    const dbEmail = pickPrimaryEmail(clerkUser) ?? email;
    const dbUser = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      create: { clerkId: clerkUser.id, email: dbEmail },
      update: { email: dbEmail },
    });

    const learnerName = pickLearnerName(clerkUser, email);
    const display =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      email;

    if (isCleanup) {
      let removed = 0;
      for (const courseSlug of COURSE_SLUGS) {
        await cleanupUserCourse({ dbUserId: dbUser.id, courseSlug });
        removed += 1;
      }
      console.log(`  CLEANED  ${display}  (${removed} courses)`);
      summary.push(`  ${display} — ${removed} enrolments removed`);
    } else {
      let lessonsTotal = 0;
      let coursesSeeded = 0;
      for (const courseSlug of COURSE_SLUGS) {
        const r = await seedUserCourse({
          dbUserId: dbUser.id,
          courseSlug,
          learnerName,
        });
        lessonsTotal += r.lessonsTouched;
        coursesSeeded += 1;
      }
      console.log(`  SEEDED  ${display}  (${coursesSeeded} courses, ${lessonsTotal} lessons + reviews)`);
      summary.push(
        `  ${display} — ${coursesSeeded} enrolments, ${lessonsTotal} lessons + reviews complete, ${coursesSeeded} certificates issued`,
      );
    }
  }

  console.log(isCleanup ? "\nCleanup complete:" : "\nSeed complete:");
  for (const line of summary) console.log(line);
}

main()
  .catch((err) => {
    console.error("\nFATAL:", err instanceof Error ? err.stack : err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

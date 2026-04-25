import { randomBytes } from "crypto";
import type { Certificate } from "@prisma/client";
import { getPrisma } from "./db";
import type { CourseManifest } from "./courses";

const COURSE_PREFIX: Record<string, string> = {
  "ai-fundamentals": "AICL-FUND",
  "claude-code-mastery": "AICL-CODE",
  "ai-agents-workflows": "AICL-AGNT",
};

export function getCoursePrefix(courseSlug: string): string {
  return COURSE_PREFIX[courseSlug] ?? "AICL-CERT";
}

function generateVerificationId(courseSlug: string): string {
  const prefix = getCoursePrefix(courseSlug);
  // 4 random bytes → 8 hex chars (uppercase 0-9 / A-F).
  const hex = randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}

export async function findCertificate(
  userId: string,
  courseSlug: string,
): Promise<Certificate | null> {
  const prisma = getPrisma();
  return prisma.certificate.findUnique({
    where: { userId_courseSlug: { userId, courseSlug } },
  });
}

export async function issueCertificate({
  userId,
  manifest,
  learnerName,
}: {
  userId: string;
  manifest: CourseManifest;
  learnerName: string;
}): Promise<Certificate> {
  const prisma = getPrisma();

  const existing = await prisma.certificate.findUnique({
    where: { userId_courseSlug: { userId, courseSlug: manifest.slug } },
  });
  if (existing) return existing;

  const trimmedName = learnerName.trim().slice(0, 80);
  if (trimmedName.length < 1) {
    throw new Error("learnerName cannot be empty");
  }

  // Two attempts is plenty; verificationId collision over 4 bytes is ~1 in 4 billion.
  for (let attempt = 0; attempt < 2; attempt++) {
    const verificationId = generateVerificationId(manifest.slug);
    try {
      return await prisma.certificate.create({
        data: {
          userId,
          courseSlug: manifest.slug,
          courseTitle: manifest.title,
          learnerName: trimmedName,
          verificationId,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const isUniqueViolation =
        message.includes("Unique constraint") ||
        message.includes("verificationId");
      if (!isUniqueViolation || attempt === 1) throw err;
      // else retry once
    }
  }

  // Unreachable — the loop either returns or throws.
  throw new Error("Certificate issuance failed after retries");
}

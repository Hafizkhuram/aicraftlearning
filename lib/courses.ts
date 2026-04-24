import { promises as fs } from "fs";
import path from "path";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseLesson = {
  slug: string;
  title: string;
  minutes: number;
  htmlPath: string;
  isReview?: boolean;
};

export type CourseModule = {
  number: number;
  title: string;
  description: string;
  lessonCount: number;
  quizQuestionCount: number;
  lessons: CourseLesson[];
};

export type CourseAssessmentConfig = {
  questionCount: number;
  passMarkPercent: number;
  retakeCooldownHours: number;
  lessonCheckQuestionsPer: number;
  moduleReviewQuestionsPer: number;
};

export type CourseFaq = {
  question: string;
  answer: string;
};

export type CourseManifest = {
  slug: string;
  title: string;
  subtitle: string;
  level: CourseLevel;
  lessonCount: number;
  moduleCount: number;
  price: number;
  priceDisplay: string;
  stripePriceId: string;
  heroHeading: string;
  heroSubhead: string;
  whoItsFor: string[];
  whatYoullLearn: string[];
  assessmentConfig: CourseAssessmentConfig;
  modules: CourseModule[];
  assessmentHtmlPath: string;
  certificateHtmlPath: string;
  faqs: CourseFaq[];
};

const COURSES_DIR = path.join(process.cwd(), "content", "courses");

const LEVEL_ORDER: Record<CourseLevel, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

export async function getCourseManifest(
  slug: string,
): Promise<CourseManifest | null> {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "");
  if (!safeSlug || safeSlug !== slug) return null;

  const filePath = path.join(COURSES_DIR, `${safeSlug}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as CourseManifest;
  } catch {
    return null;
  }
}

export async function getAllCourseManifests(): Promise<CourseManifest[]> {
  const entries = await fs.readdir(COURSES_DIR);
  const slugs = entries
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""));

  const manifests = await Promise.all(slugs.map((s) => getCourseManifest(s)));
  return manifests
    .filter((m): m is CourseManifest => m !== null)
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
}

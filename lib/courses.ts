import { promises as fs } from "fs";
import path from "path";

export type CourseLesson = {
  slug: string;
  title: string;
  duration?: string;
};

export type CourseManifest = {
  slug: string;
  title: string;
  tagline?: string;
  description?: string;
  priceGBP: number;
  stripePriceId?: string;
  lessons: CourseLesson[];
  [key: string]: unknown;
};

export async function getCourseManifest(
  slug: string,
): Promise<CourseManifest | null> {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "");
  if (!safeSlug || safeSlug !== slug) return null;

  const filePath = path.join(
    process.cwd(),
    "content",
    "courses",
    `${safeSlug}.json`,
  );

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as CourseManifest;
  } catch {
    return null;
  }
}

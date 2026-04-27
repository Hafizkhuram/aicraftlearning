import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/constants";
import { getAllCourseManifests } from "@/lib/courses";

export const dynamic = "force-static";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/courses", priority: 0.9, changeFrequency: "weekly" },
  { path: "/aios-program", priority: 0.9, changeFrequency: "monthly" },
  { path: "/certification", priority: 0.7, changeFrequency: "monthly" },
  { path: "/assessment", priority: 0.7, changeFrequency: "monthly" },
  { path: "/for-business", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }),
  );

  const courses = await getAllCourseManifests();
  const courseEntries: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${siteUrl}/courses/${course.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...courseEntries];
}

import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturedCourses } from "@/components/sections/FeaturedCourses";
import { WhyAICraft } from "@/components/sections/WhyAICraft";
import { AssessmentTeaser } from "@/components/sections/AssessmentTeaser";
import { FinalCTA } from "@/components/sections/FinalCTA";

// Future: a "Trusted by" strip and a Testimonials band sit between hero/courses
// and the final CTA respectively. Pulled from v4 polish — re-add once we have
// real partner logos and real learner quotes (no invented brands or names).
import { siteName, siteUrl } from "@/lib/constants";
import { jsonLdScript, organizationSchema } from "@/lib/structured-data";

const homeTitle = `${siteName} — AI courses for tool-fatigued professionals`;
const homeDescription =
  "Text-first AI courses for non-technical professionals. Learn Claude, Claude Code, and AI workflows that actually fit how you work. Real craft, no hype.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: siteUrl,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationSchema()) }}
      />
      <Hero />
      <HowItWorks />
      <FeaturedCourses />
      <WhyAICraft />
      <AssessmentTeaser />
      <FinalCTA />
    </>
  );
}

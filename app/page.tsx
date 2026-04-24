import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturedCourses } from "@/components/sections/FeaturedCourses";
import { WhyAICraft } from "@/components/sections/WhyAICraft";
import { AssessmentTeaser } from "@/components/sections/AssessmentTeaser";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { siteName, siteUrl } from "@/lib/constants";

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
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <FeaturedCourses />
      <WhyAICraft />
      <AssessmentTeaser />
      <Testimonials />
      <FinalCTA />
    </>
  );
}

import type { Metadata } from "next";
import { AssessmentEmbed } from "@/components/sections/AssessmentEmbed";
import { siteName, siteUrl } from "@/lib/constants";

const pageTitle = "Discover your AI level";
const pageDescription =
  "A free 5-minute interactive assessment that maps your current AI skills and recommends the AICraft course that fits where you are right now.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: `${siteUrl}/assessment` },
  openGraph: {
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
    url: `${siteUrl}/assessment`,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} · ${siteName}`,
    description: pageDescription,
  },
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] dark:bg-[#0b1322]">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <header className="mb-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
            Free assessment
          </p>
          <h1 className="accent-bar mt-3 font-display text-3xl font-semibold leading-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
            Discover your AI level
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
            Takes about 5 minutes. Personalised course recommendation at the end.
          </p>
        </header>

        <AssessmentEmbed />
      </div>
    </div>
  );
}

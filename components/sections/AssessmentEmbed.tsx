"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const COURSE_SLUGS = new Set([
  "ai-fundamentals",
  "claude-code-mastery",
  "ai-agents-workflows",
]);

export function AssessmentEmbed() {
  const router = useRouter();

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;

      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type !== "aicraft:assessment-recommendation") return;

      const recommended = Array.isArray(data.recommendedCourses)
        ? data.recommendedCourses
        : [];
      const top =
        typeof recommended[0] === "string" ? recommended[0].trim() : "";

      if (top && COURSE_SLUGS.has(top)) {
        router.push(`/courses?recommended=${encodeURIComponent(top)}`);
      } else {
        router.push("/courses");
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return (
    <iframe
      src="/assessment/discover-your-ai-level.html"
      title="AI Level Assessment"
      className="w-full rounded-xl border-0 bg-white shadow-sm"
      style={{ height: "calc(100vh - 14rem)", minHeight: "640px" }}
    />
  );
}

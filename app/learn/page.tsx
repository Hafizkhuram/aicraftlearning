import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Learning",
  description:
    "Your AICraft Learning dashboard — continue your courses and track progress.",
};

export default function LearnIndexPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="accent-bar text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-primary-green)]">
        My learning
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-[var(--color-text-dark)] sm:text-4xl dark:text-[var(--color-text-light)]">
        Welcome back.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
        Your enrolled courses will appear here. The full dashboard is built in a
        later phase.
      </p>
    </section>
  );
}

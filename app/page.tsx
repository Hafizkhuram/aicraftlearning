import { siteName } from "@/lib/constants";

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="accent-bar text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-primary-green)]">
        AI education, done properly
      </p>
      <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-[var(--color-text-dark)] sm:text-5xl dark:text-[var(--color-text-light)]">
        {siteName} — coming soon.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
        The full site is being built phase by phase. Scaffolding, layout,
        navbar, and footer are live. The real homepage arrives next.
      </p>
    </section>
  );
}

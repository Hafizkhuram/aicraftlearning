import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundSearch } from "@/components/layout/NotFoundSearch";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "AIOS Programme", href: "/aios-program" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-white py-24 sm:py-32 dark:bg-[var(--color-dark-bg)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),rgba(16,185,129,0)_65%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.28),rgba(16,185,129,0)_65%)]" />
        <div className="absolute -bottom-40 -left-24 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.10),rgba(52,211,153,0)_70%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.18),rgba(52,211,153,0)_70%)]" />
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
          404
        </p>

        <h1 className="accent-bar mt-3 font-display text-[34px] font-bold leading-[1.08] tracking-tight text-[var(--color-deep-green)] sm:text-[44px] dark:text-[var(--color-text-light)]">
          Looks like this page got automated away.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg dark:text-slate-300">
          This URL doesn&rsquo;t lead anywhere we know about. Try one of these:
        </p>

        <ul className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
          {QUICK_LINKS.map((link, idx) => (
            <li key={link.href} className="flex items-center gap-2">
              <Link
                href={link.href}
                className="font-medium text-[var(--color-deep-green)] underline decoration-[var(--color-primary-green)] underline-offset-4 transition-colors hover:text-[var(--color-primary-green)] dark:text-[var(--color-text-light)] dark:hover:text-[var(--color-accent-green)]"
              >
                {link.label}
              </Link>
              {idx < QUICK_LINKS.length - 1 ? (
                <span aria-hidden="true" className="text-[var(--color-text-muted)]">
                  ·
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <NotFoundSearch />
      </div>
    </section>
  );
}

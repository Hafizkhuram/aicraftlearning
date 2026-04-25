import Link from "next/link";

export default function CertificateNotFound() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="accent-bar inline-block text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-primary-green)]">
        Certificate not found
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-[var(--color-text-dark)] sm:text-4xl dark:text-[var(--color-text-light)]">
        We couldn&apos;t verify that ID.
      </h1>
      <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">
        The verification ID you visited doesn&apos;t match any certificate we
        have on file. Check the link for typos, or verify a different one
        below.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/certification"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-deep-green)]"
        >
          Verify another certificate →
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-[var(--color-primary-green)] px-5 py-2.5 text-sm font-medium text-[var(--color-deep-green)] transition-colors hover:bg-[var(--color-primary-green)] hover:text-white dark:text-[var(--color-accent-green)]"
        >
          Back to AICraft Learning
        </Link>
      </div>
    </section>
  );
}

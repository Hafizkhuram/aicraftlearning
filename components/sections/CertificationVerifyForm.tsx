"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function CertificationVerifyForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Enter a certificate ID to verify.");
      return;
    }
    const safe = trimmed.replace(/[^a-zA-Z0-9-_]/g, "");
    if (!safe) {
      setError("Certificate IDs only contain letters, numbers, dashes, and underscores.");
      return;
    }
    setError(null);
    router.push(`/certificate/${encodeURIComponent(safe)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-[#0F172A]"
      style={{ borderWidth: "0.5px" }}
    >
      <span
        aria-hidden="true"
        className="absolute top-7 bottom-7 left-0 w-[3px] rounded-r-full bg-[var(--color-primary-green)]"
      />

      <div className="flex flex-col gap-6 pl-3 sm:pl-4">
        <div className="flex items-start gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-mint)] text-[var(--color-deep-green)] sm:inline-flex dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
            <ShieldCheck size={22} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              Verify a certificate
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
              Check that a certificate is real
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
              Paste the certificate ID printed at the bottom of any AICraft certificate.
              We&rsquo;ll open the verifiable record.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Certificate ID</span>
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. AICRAFT-2026-0001"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "verify-error" : undefined}
              className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-white px-4 py-3 text-sm text-[var(--color-text-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary-green)] focus:outline-none dark:border-slate-800 dark:bg-[#0b1322] dark:text-[var(--color-text-light)]"
              style={{ borderWidth: "0.5px" }}
            />
          </label>
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-green)] px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)]"
          >
            Verify
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>

        {error ? (
          <p
            id="verify-error"
            role="alert"
            className="text-xs font-medium text-[#B91C1C] dark:text-[#FCA5A5]"
          >
            {error}
          </p>
        ) : (
          <p className="text-xs text-[var(--color-text-muted)]">
            All certificates are verifiable at aicraftlearning.com/verify.
          </p>
        )}
      </div>
    </form>
  );
}

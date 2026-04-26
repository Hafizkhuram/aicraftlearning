"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

type Props = {
  courseSlug: string;
};

export function PurchaseSuccessBanner({ courseSlug }: Props) {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("purchase") === "success";
  const storageKey = `aicraft:dismissed-purchase-success:${courseSlug}`;

  const [hydrated, setHydrated] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(storageKey) === "1") {
        setDismissed(true);
      }
    } catch {
      // sessionStorage unavailable (private mode, etc.) — banner just stays until reload
    }
    setHydrated(true);
  }, [storageKey]);

  function handleDismiss() {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // ignore
    }
  }

  if (!isSuccess || !hydrated || dismissed) return null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
      <div
        role="status"
        aria-live="polite"
        className="relative flex items-start gap-4 rounded-xl border border-[var(--color-primary-green)] bg-[var(--color-light-mint)] py-3 pr-12 pl-4 text-[var(--color-deep-green)] dark:border-[var(--color-accent-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_45%,transparent)] dark:text-[var(--color-text-light)]"
        style={{ borderWidth: "0.5px", borderLeftWidth: "3px" }}
      >
        <CheckCircle2
          size={20}
          strokeWidth={2}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Payment received</p>
          <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-deep-green)]/85 dark:text-slate-200">
            Your enrolment is being processed &mdash; refresh in a moment if you
            don&rsquo;t see it.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss payment confirmation"
          className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-deep-green)]/70 transition-colors hover:bg-white/60 hover:text-[var(--color-deep-green)] focus:ring-2 focus:ring-[var(--color-primary-green)] focus:ring-offset-2 focus:ring-offset-[var(--color-light-mint)] focus:outline-none dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

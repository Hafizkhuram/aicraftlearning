"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, RefreshCw, X } from "lucide-react";
import { supportEmail } from "@/lib/constants";

type Props = {
  courseSlug: string;
  alreadyEnrolled: boolean;
};

type Phase = "idle" | "polling" | "enrolled" | "recovery";

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 12000;
const ENROLLED_CELEBRATE_MS = 1000;

export function PurchaseSuccessBanner({ courseSlug, alreadyEnrolled }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSuccess = searchParams.get("purchase") === "success";
  const sessionId = searchParams.get("session_id");
  const storageKey = `aicraft:dismissed-purchase-success:${courseSlug}`;

  const [hydrated, setHydrated] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [phase, setPhase] = useState<Phase>(alreadyEnrolled ? "enrolled" : "polling");
  const [pollAttempt, setPollAttempt] = useState(0);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // sessionStorage unavailable (private mode, etc.) — soft-dismiss only
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(storageKey) === "1") {
        setDismissed(true);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [storageKey]);

  // Keep the local phase aligned with the alreadyEnrolled prop. After a
  // successful poll triggers router.refresh(), the server component re-renders
  // with alreadyEnrolled=true and we want to drop into the celebrate state
  // rather than continue polling.
  useEffect(() => {
    if (alreadyEnrolled && phase !== "enrolled") {
      setPhase("enrolled");
    }
  }, [alreadyEnrolled, phase]);

  // Poll the enrolment status until it flips, or we hit the timeout.
  useEffect(() => {
    if (!hydrated || dismissed || !isSuccess) return;
    if (phase !== "polling") return;

    let cancelled = false;
    const startedAt = Date.now();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(
          `/api/enrolment/status?courseSlug=${encodeURIComponent(courseSlug)}`,
          { cache: "no-store" },
        );
        if (!cancelled && res.ok) {
          const data = (await res.json()) as { enrolled?: boolean };
          if (data.enrolled) {
            setPhase("enrolled");
            router.refresh();
            return;
          }
        }
      } catch {
        // network blip — keep trying within the budget
      }
      if (cancelled) return;
      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        setPhase("recovery");
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    timer = setTimeout(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [hydrated, dismissed, isSuccess, phase, courseSlug, router, pollAttempt]);

  // Auto-dismiss the celebratory state after a short beat.
  useEffect(() => {
    if (!hydrated || dismissed || !isSuccess) return;
    if (phase !== "enrolled") return;
    const t = setTimeout(handleDismiss, ENROLLED_CELEBRATE_MS);
    return () => clearTimeout(t);
  }, [hydrated, dismissed, isSuccess, phase, handleDismiss]);

  if (!isSuccess || !hydrated || dismissed) return null;

  const showRecovery = phase === "recovery";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
      <div
        role="status"
        aria-live="polite"
        className="relative flex items-start gap-4 rounded-xl border border-[var(--color-primary-green)] bg-[var(--color-light-mint)] py-3 pr-12 pl-4 text-[var(--color-deep-green)] dark:border-[var(--color-accent-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_45%,transparent)] dark:text-[var(--color-text-light)]"
        style={{ borderWidth: "0.5px", borderLeftWidth: "3px" }}
      >
        <BannerIcon phase={phase} />

        <div className="min-w-0 flex-1">
          <BannerCopy phase={phase} sessionId={sessionId} />

          {showRecovery ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPhase("polling");
                  setPollAttempt((n) => n + 1);
                  router.refresh();
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary-green)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-deep-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-light-mint)] dark:focus-visible:ring-offset-slate-900"
              >
                <RefreshCw size={13} strokeWidth={2.2} aria-hidden="true" />
                Refresh
              </button>
              <a
                href={buildSupportMailto({ courseSlug, sessionId })}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-primary-green)]/60 px-3 py-1.5 text-xs font-medium text-[var(--color-deep-green)] transition-colors hover:bg-white/60 dark:border-[var(--color-accent-green)]/60 dark:text-[var(--color-text-light)] dark:hover:bg-white/10"
              >
                Email support
              </a>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss payment confirmation"
          className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-deep-green)]/70 transition-colors hover:bg-white/60 hover:text-[var(--color-deep-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-light-mint)] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function BannerIcon({ phase }: { phase: Phase }) {
  if (phase === "polling") {
    return (
      <Loader2
        size={20}
        strokeWidth={2}
        aria-hidden="true"
        className="mt-0.5 shrink-0 animate-spin text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]"
      />
    );
  }
  return (
    <CheckCircle2
      size={20}
      strokeWidth={2}
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]"
    />
  );
}

function BannerCopy({ phase, sessionId }: { phase: Phase; sessionId: string | null }) {
  if (phase === "polling") {
    return (
      <>
        <p className="text-sm font-semibold">Payment received</p>
        <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-deep-green)]/85 dark:text-slate-200">
          Finalising your enrolment&hellip;
        </p>
      </>
    );
  }
  if (phase === "recovery") {
    return (
      <>
        <p className="text-sm font-semibold">Payment received</p>
        <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-deep-green)]/85 dark:text-slate-200">
          Your enrolment is taking longer than usual to finalise. You aren&rsquo;t
          stuck &mdash; refresh, or email support and we&rsquo;ll sort it
          straight away.
          {sessionId ? (
            <>
              {" "}
              <span className="text-xs text-[var(--color-text-muted)]">
                (Reference: {sessionId.slice(0, 18)}…)
              </span>
            </>
          ) : null}
        </p>
      </>
    );
  }
  // enrolled — brief celebration before auto-dismiss
  return (
    <>
      <p className="text-sm font-semibold">Payment received</p>
      <p className="mt-0.5 text-sm leading-relaxed text-[var(--color-deep-green)]/85 dark:text-slate-200">
        You&rsquo;re enrolled &mdash; jump in below.
      </p>
    </>
  );
}

function buildSupportMailto({
  courseSlug,
  sessionId,
}: {
  courseSlug: string;
  sessionId: string | null;
}): string {
  const subject = `Enrolment not finalising — ${courseSlug}`;
  const bodyLines = [
    "Hi AICraft team,",
    "",
    `My payment for "${courseSlug}" went through but my enrolment hasn't appeared after waiting a few minutes.`,
    "",
    sessionId ? `Stripe session reference: ${sessionId}` : "",
    "",
    "Thanks!",
  ].filter(Boolean);
  const params = new URLSearchParams({
    subject,
    body: bodyLines.join("\n"),
  });
  return `mailto:${supportEmail}?${params.toString()}`;
}

"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AssessmentSubmitResponse =
  | {
      passed: true;
      score: number;
      totalQuestions: number;
      attemptId: string;
      verificationId: string;
      certificateReady: true;
      alreadyCertified?: boolean;
    }
  | {
      passed: true;
      score: number;
      totalQuestions: number;
      attemptId: string;
      needsName: true;
      certificateReady: false;
    }
  | {
      passed: false;
      score: number;
      totalQuestions: number;
      attemptId: string;
      canRetake: boolean;
      hoursUntilRetake: number;
    }
  | { error: string; hoursUntilRetake?: number };

type AssessmentShellProps = {
  courseSlug: string;
  courseTitle: string;
  assessmentHtmlPath: string;
  passMarkPercent: number;
  totalQuestions: number;
  sidebar: ReactNode;
};

type LocalState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "needs-name"; attemptId: string; score: number; total: number }
  | { kind: "issuing-cert" }
  | {
      kind: "failed";
      score: number;
      total: number;
      hoursUntilRetake: number;
      cooldownEnds: number;
    }
  | { kind: "error"; message: string };

export function AssessmentShell({
  courseSlug,
  courseTitle,
  assessmentHtmlPath,
  passMarkPercent,
  totalQuestions,
  sidebar,
}: AssessmentShellProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [state, setState] = useState<LocalState>({ kind: "idle" });
  const [name, setName] = useState("");
  const [now, setNow] = useState(() => Date.now());

  // Tick a clock so the cooldown countdown updates roughly every minute.
  useEffect(() => {
    if (state.kind !== "failed") return;
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, [state.kind]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as
        | {
            type?: string;
            score?: number;
            total?: number;
            passed?: boolean;
            answers?: unknown;
          }
        | null
        | undefined;
      if (!data || typeof data !== "object" || !data.type) return;

      if (data.type === "aicraft:assessment-complete") {
        if (state.kind !== "idle") return; // Don't double-submit.
        const answers = Array.isArray(data.answers)
          ? data.answers.map((a) => a === true)
          : [];
        if (answers.length !== totalQuestions) {
          setState({
            kind: "error",
            message: `Expected ${totalQuestions} answers, the assessment sent ${answers.length}. Please refresh and try again.`,
          });
          return;
        }
        submit(answers);
        return;
      }

      if (data.type === "aicraft:assessment-navigate-certificate") {
        router.push(`/learn/${courseSlug}/certificate`);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, totalQuestions, state.kind]);

  async function submit(answers: boolean[]) {
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, answers }),
      });
      const data = (await res.json()) as AssessmentSubmitResponse;

      if (!res.ok || "error" in data) {
        const message =
          ("error" in data && data.error) ||
          `Submission failed (${res.status})`;
        setState({ kind: "error", message });
        return;
      }

      if (data.passed && "certificateReady" in data && data.certificateReady) {
        router.push(`/learn/${courseSlug}/certificate`);
        router.refresh();
        return;
      }

      if (data.passed && "needsName" in data && data.needsName) {
        setState({
          kind: "needs-name",
          attemptId: data.attemptId,
          score: data.score,
          total: data.totalQuestions,
        });
        return;
      }

      if (!data.passed) {
        const cooldownEnds =
          Date.now() + (data.hoursUntilRetake ?? 24) * 60 * 60 * 1000;
        setState({
          kind: "failed",
          score: data.score,
          total: data.totalQuestions,
          hoursUntilRetake: data.hoursUntilRetake ?? 24,
          cooldownEnds,
        });
        return;
      }
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  async function submitName() {
    if (state.kind !== "needs-name") return;
    setState({ kind: "issuing-cert" });
    try {
      const res = await fetch(
        "/api/assessment/issue-certificate-with-name",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseSlug, name }),
        },
      );
      const data = (await res.json()) as
        | { ok: true; verificationId: string }
        | { error: string };
      if (!res.ok || "error" in data) {
        const message =
          ("error" in data && data.error) ||
          `Could not issue certificate (${res.status})`;
        setState({ kind: "error", message });
        return;
      }
      router.push(`/learn/${courseSlug}/certificate`);
      router.refresh();
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  const showIframe = state.kind === "idle" || state.kind === "submitting";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-bg)]">
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[280px] shrink-0 border-r border-[var(--color-border-subtle)] bg-white/80 lg:block dark:border-white/10 dark:bg-white/[0.02]">
        {sidebar}
      </aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-[var(--color-dark-bg)]/60"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-[280px] max-w-[80vw] flex-col bg-white shadow-xl dark:bg-[var(--color-dark-bg)]">
            <div className="flex justify-end border-b border-[var(--color-border-subtle)] px-3 py-2 dark:border-white/10">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] dark:hover:text-[var(--color-text-light)]"
              >
                Close ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebar}</div>
          </aside>
        </div>
      ) : null}

      <main className="min-w-0 flex-1">
        <div className="border-b border-[var(--color-border-subtle)] bg-white/70 px-4 py-3 sm:px-6 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-[var(--color-border-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-dark)] lg:hidden dark:border-white/10 dark:hover:text-[var(--color-text-light)]"
                aria-label="Open course outline"
              >
                ☰ Outline
              </button>
              <p className="text-[12px] text-[var(--color-text-muted)]">
                Final assessment · {courseTitle} · pass mark {passMarkPercent}%
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 pt-3 pb-6 sm:px-6 sm:pt-4">
          {showIframe ? (
            <iframe
              src={assessmentHtmlPath}
              title={`Final assessment — ${courseTitle}`}
              sandbox="allow-scripts allow-same-origin"
              className="h-[calc(100vh-10rem)] w-full rounded-lg border-0 bg-white shadow-sm"
            />
          ) : (
            <ResultPanel
              state={state}
              now={now}
              passMarkPercent={passMarkPercent}
              name={name}
              setName={setName}
              onSubmitName={submitName}
              onClearError={() => setState({ kind: "idle" })}
            />
          )}
          {state.kind === "submitting" ? (
            <p
              role="status"
              className="mt-3 text-center text-sm text-[var(--color-text-muted)]"
            >
              Recording your result…
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function ResultPanel({
  state,
  now,
  passMarkPercent,
  name,
  setName,
  onSubmitName,
  onClearError,
}: {
  state: LocalState;
  now: number;
  passMarkPercent: number;
  name: string;
  setName: (n: string) => void;
  onSubmitName: () => void;
  onClearError: () => void;
}) {
  const remainingMinutes = useMemo(() => {
    if (state.kind !== "failed") return 0;
    return Math.max(1, Math.ceil((state.cooldownEnds - now) / (60 * 1000)));
  }, [state, now]);

  if (state.kind === "needs-name") {
    return (
      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-[var(--color-border-subtle)] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-primary-green)] uppercase">
          You passed — {state.score} / {state.total}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
          What name should appear on your certificate?
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          We don&apos;t have your full name on file from sign-up. Use the name
          you&apos;d want on a credential — this is captured once and locked
          to your certificate.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim().length >= 2) onSubmitName();
          }}
          className="mt-5"
        >
          <label
            htmlFor="learner-name"
            className="block text-xs font-medium text-[var(--color-text-muted)]"
          >
            Full name
          </label>
          <input
            id="learner-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alexandra Hawthorne-Jones"
            maxLength={80}
            autoComplete="name"
            className="mt-1 w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-3 py-2 text-sm text-[var(--color-text-dark)] outline-none transition focus:border-[var(--color-primary-green)] focus:ring-1 focus:ring-[var(--color-primary-green)] dark:border-white/15 dark:bg-white/[0.04] dark:text-[var(--color-text-light)]"
          />
          <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">
            2–80 characters. This is captured once and never changes.
          </p>
          <div className="mt-5">
            <button
              type="submit"
              disabled={name.trim().length < 2}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-deep-green)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Generate my certificate →
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (state.kind === "issuing-cert") {
    return (
      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-[var(--color-border-subtle)] bg-white p-7 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-sm text-[var(--color-text-muted)]">
          Issuing your certificate…
        </p>
      </div>
    );
  }

  if (state.kind === "failed") {
    const hoursLeft = Math.ceil(remainingMinutes / 60);
    const minutesLabel =
      remainingMinutes < 60
        ? `${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}`
        : `${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}`;
    return (
      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-[var(--color-warning)]/40 bg-[color-mix(in_oklab,var(--color-warning)_10%,transparent)] p-7 shadow-sm">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#92400E] uppercase dark:text-[var(--color-warning)]">
          Not this time — {state.score} / {state.total}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
          Take a breath, then come back fresh.
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          The pass mark is {passMarkPercent}%. The retake unlocks in{" "}
          {minutesLabel}. The short gap helps you notice what to revisit
          before going again.
        </p>
        <p className="mt-4 text-sm">
          <Link
            href={`/learn`}
            className="font-medium text-[var(--color-deep-green)] underline-offset-4 hover:underline dark:text-[var(--color-accent-green)]"
          >
            ← Back to My Learning
          </Link>
        </p>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-red-300 bg-red-50 p-7 shadow-sm dark:border-red-900/40 dark:bg-red-950/20">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-red-800 uppercase dark:text-red-300">
          Something went wrong
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold text-red-900 dark:text-red-100">
          {state.message}
        </h2>
        <div className="mt-5">
          <button
            type="button"
            onClick={onClearError}
            className="inline-flex items-center justify-center rounded-lg border border-red-400 bg-white px-4 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-100 dark:bg-transparent dark:text-red-200 dark:hover:bg-red-900/20"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return null;
}

"use client";

import { useEffect, useRef, useState } from "react";

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const SUCCESS_RESET_MS = 3500;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<FormState>({ kind: "idle" });
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;
    setState({ kind: "submitting" });

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });

      if (res.ok) {
        setEmail("");
        setState({ kind: "success" });
        successTimerRef.current = setTimeout(() => {
          setState({ kind: "idle" });
        }, SUCCESS_RESET_MS);
        return;
      }

      let payload: { error?: string } = {};
      try {
        payload = (await res.json()) as { error?: string };
      } catch {
        // ignore
      }

      if (res.status === 400 || payload.error === "invalid_email") {
        setState({
          kind: "error",
          message: "That email looks off — try again.",
        });
        return;
      }

      if (res.status === 503 || payload.error === "newsletter_unavailable") {
        setState({
          kind: "error",
          message:
            "Newsletter signup is being configured. Email hello@aicraftlearning.com to get notified.",
        });
        return;
      }

      setState({
        kind: "error",
        message: "Something went wrong. Please try again.",
      });
    } catch {
      setState({
        kind: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <p
        role="status"
        className="text-sm font-medium text-[var(--color-accent-green)]"
      >
        You&rsquo;re subscribed. Welcome.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state.kind === "error") setState({ kind: "idle" });
        }}
        placeholder="you@example.com"
        disabled={state.kind === "submitting"}
        aria-invalid={state.kind === "error" ? true : undefined}
        aria-describedby={state.kind === "error" ? "newsletter-error" : undefined}
        className="flex-1 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-[var(--color-text-light)] placeholder:text-slate-500 focus:border-[var(--color-accent-green)] focus:outline-none disabled:opacity-60"
      />
      {/* Honeypot — hidden from real users, visible to bots that fill every field. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        aria-hidden="true"
        className="hidden"
      />
      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="inline-flex items-center justify-center rounded-lg bg-primary-green px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[var(--color-accent-green)] disabled:opacity-60"
      >
        {state.kind === "submitting" ? "Subscribing…" : "Subscribe"}
      </button>
      {state.kind === "error" ? (
        <p
          id="newsletter-error"
          role="alert"
          className="basis-full text-xs text-amber-400"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

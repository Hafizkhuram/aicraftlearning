"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Phase 1: visual only. Real backend wiring happens alongside analytics in a later phase.
    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <p className="text-sm text-[var(--color-accent-green)]">
        Thanks — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-[var(--color-text-light)] placeholder:text-slate-500 focus:border-[var(--color-accent-green)] focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-primary-green px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[var(--color-accent-green)]"
      >
        Subscribe
      </button>
    </form>
  );
}

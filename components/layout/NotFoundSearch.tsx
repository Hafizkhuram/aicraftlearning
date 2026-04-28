"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { siteName } from "@/lib/constants";

export function NotFoundSearch() {
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const q = encodeURIComponent(`site:aicraftlearning.com ${trimmed}`);
    window.location.href = `https://www.google.com/search?q=${q}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="not-found-search" className="sr-only">
        Search {siteName}
      </label>
      <div className="relative flex-1">
        <Search
          size={16}
          strokeWidth={1.9}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          id="not-found-search"
          name="q"
          type="search"
          required
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the site"
          className="w-full rounded-lg border bg-white px-3 py-2.5 pl-10 text-sm text-[var(--color-text-dark)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-green)] focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-[var(--color-text-light)] dark:focus-visible:ring-offset-slate-900"
          style={{ borderColor: "var(--color-border-subtle)", borderWidth: "0.5px" }}
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-green)] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shadow-[0_8px_24px_-12px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)]"
      >
        Search
      </button>
    </form>
  );
}

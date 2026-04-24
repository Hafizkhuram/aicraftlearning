"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

type EnrollButtonProps = {
  courseSlug: string;
  priceGBP: number;
  isEnrolled?: boolean;
  label?: string;
  className?: string;
};

const priceFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function EnrollButton({
  courseSlug,
  priceGBP,
  isEnrolled = false,
  label,
  className,
}: EnrollButtonProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const base =
    "inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-green)] px-5 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[var(--color-deep-green)] disabled:cursor-not-allowed disabled:opacity-60";
  const classes = className ? `${base} ${className}` : base;

  if (isEnrolled) {
    return (
      <a href={`/learn/${courseSlug}`} className={classes}>
        Go to course →
      </a>
    );
  }

  const defaultLabel = label ?? `Enrol · ${priceFormatter.format(priceGBP)}`;

  async function handleClick() {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push(`/sign-up?redirect_url=/courses/${courseSlug}`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      const data = (await res.json()) as {
        url?: string;
        redirectTo?: string;
        alreadyEnrolled?: boolean;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }
      if (data.alreadyEnrolled && data.redirectTo) {
        router.push(data.redirectTo);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || !isLoaded}
        className={classes}
      >
        {loading ? "Redirecting…" : defaultLabel}
      </button>
      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

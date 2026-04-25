"use client";

import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {
        // Silent — clipboard API isn't always available, the URL is still visible above.
      });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-green)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-deep-green)]"
    >
      {copied ? "✓ Link copied" : "Copy link"}
    </button>
  );
}

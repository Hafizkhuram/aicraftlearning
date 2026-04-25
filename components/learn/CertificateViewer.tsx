"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type CertificateViewerProps = {
  certificateHtmlPath: string;
  learnerName: string;
  issuedAtISO: string;
  verificationId: string;
  publicShareUrl: string;
  courseTitle: string;
};

export function CertificateViewer({
  certificateHtmlPath,
  learnerName,
  issuedAtISO,
  verificationId,
  publicShareUrl,
  courseTitle,
}: CertificateViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [copied, setCopied] = useState(false);

  const src = `${certificateHtmlPath}?name=${encodeURIComponent(
    learnerName,
  )}&date=${encodeURIComponent(issuedAtISO)}&id=${encodeURIComponent(
    verificationId,
  )}`;

  function handleCopy() {
    navigator.clipboard
      .writeText(publicShareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {
        // No-op — most modern browsers permit clipboard write from a click handler.
      });
  }

  function handlePrint() {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.focus();
      win.print();
    } catch {
      // Fallback to printing the parent if same-origin print is blocked.
      window.print();
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="text-xs text-[var(--color-text-muted)]"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              href="/learn"
              className="transition-colors hover:text-[var(--color-deep-green)]"
            >
              My Learning
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/learn/${publicShareUrl.split("/").pop()?.startsWith("AICL-") ? "" : ""}`}
              className="hidden"
            />
          </li>
          <li className="text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
            Certificate · {courseTitle}
          </li>
        </ol>
      </nav>

      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[var(--color-primary-green)]/30 bg-[color-mix(in_oklab,var(--color-primary-green)_8%,transparent)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--color-deep-green)] uppercase dark:text-[var(--color-accent-green)]">
            Share this certificate with employers
          </p>
          <p
            className="mt-1 truncate font-mono text-sm text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]"
            title={publicShareUrl}
          >
            {publicShareUrl}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-lg border border-[var(--color-primary-green)] bg-white px-3.5 py-2 text-xs font-medium text-[var(--color-deep-green)] transition-colors hover:bg-[var(--color-primary-green)] hover:text-white dark:bg-transparent dark:text-[var(--color-accent-green)]"
          >
            {copied ? "✓ Copied" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary-green)] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--color-deep-green)]"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="mt-4">
        <iframe
          ref={iframeRef}
          src={src}
          title={`Certificate — ${courseTitle}`}
          sandbox="allow-scripts allow-same-origin allow-modals"
          className="h-[calc(100vh-12rem)] min-h-[640px] w-full rounded-lg border border-[var(--color-border-subtle)] bg-white shadow-sm"
        />
      </div>
    </section>
  );
}

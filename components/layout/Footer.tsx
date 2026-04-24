import Link from "next/link";
import Image from "next/image";
import {
  contactEmail,
  enterpriseEmail,
  primaryNavLinks,
  siteName,
  socialLinks,
  supportEmail,
  tagline,
} from "@/lib/constants";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[var(--color-dark-bg)] text-[var(--color-text-light)]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link href="/" aria-label={`${siteName} home`} className="inline-flex">
            <Image
              src="/aicraft-logo-primary.svg"
              alt={siteName}
              width={180}
              height={36}
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            {tagline}. AI education for the tool-fatigued and oversold — real
            skills, no hype.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="accent-bar font-display text-sm font-semibold tracking-wide uppercase text-[var(--color-text-light)]">
            Quick links
          </h3>
          <ul className="mt-5 space-y-3">
            {primaryNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-400 transition-colors hover:text-[var(--color-accent-green)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="accent-bar font-display text-sm font-semibold tracking-wide uppercase text-[var(--color-text-light)]">
            Contact
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${contactEmail}`}
                className="text-slate-400 transition-colors hover:text-[var(--color-accent-green)]"
              >
                {contactEmail}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${supportEmail}`}
                className="text-slate-400 transition-colors hover:text-[var(--color-accent-green)]"
              >
                {supportEmail}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${enterpriseEmail}`}
                className="text-slate-400 transition-colors hover:text-[var(--color-accent-green)]"
              >
                {enterpriseEmail}
              </a>
            </li>
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={socialLinks.linkedin}
              aria-label="AICraft Learning on LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-colors hover:border-[var(--color-accent-green)] hover:text-[var(--color-accent-green)]"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S.02 4.881.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.02h4.56V23H.22V8.02zM8.02 8.02h4.37v2.05h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 7v8.29h-4.56v-7.35c0-1.75-.03-4-2.44-4-2.44 0-2.81 1.9-2.81 3.87V23H8.02V8.02z" />
              </svg>
            </a>
            <a
              href={socialLinks.twitter}
              aria-label="AICraft Learning on X / Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-colors hover:border-[var(--color-accent-green)] hover:text-[var(--color-accent-green)]"
            >
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2H21.5l-7.52 8.59L22.75 22h-6.828l-5.35-6.99L4.3 22H1.04l8.06-9.21L1.25 2h6.987l4.83 6.39L18.244 2zm-2.394 18h1.894L7.23 4H5.21l10.64 16z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="accent-bar font-display text-sm font-semibold tracking-wide uppercase text-[var(--color-text-light)]">
            Newsletter
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-slate-400">
            Weekly AI tips for non-technical professionals. No
            tool-of-the-week nonsense.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[var(--color-accent-green)]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-[var(--color-accent-green)]"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

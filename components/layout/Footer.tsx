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
                className="break-all text-slate-400 transition-colors hover:text-[var(--color-accent-green)]"
              >
                {contactEmail}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${supportEmail}`}
                className="break-all text-slate-400 transition-colors hover:text-[var(--color-accent-green)]"
              >
                {supportEmail}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${enterpriseEmail}`}
                className="break-all text-slate-400 transition-colors hover:text-[var(--color-accent-green)]"
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
              href={socialLinks.facebook}
              aria-label="AICraft Learning on Facebook"
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
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.99 22 12z" />
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
            Occasional notes from Khuram. Course launches, AIOS openings, the
            rare worth-reading link.
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

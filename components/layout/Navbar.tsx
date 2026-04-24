"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { primaryNavLinks, siteName } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border-subtle)] bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-[color-mix(in_oklab,var(--color-dark-bg)_85%,transparent)]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 nav:h-18 lg:px-8">
        {/* Left — logo */}
        <Link
          href="/"
          aria-label={`${siteName} home`}
          className="flex shrink-0 items-center"
        >
          <Image
            src="/aicraft-logo-primary.svg"
            alt={siteName}
            width={210}
            height={40}
            priority
            className="h-9 w-auto nav:h-10 dark:brightness-0 dark:invert"
          />
        </Link>

        {/* Centre — flat nav links (desktop) */}
        <nav
          aria-label="Primary"
          className="hidden nav:flex items-center gap-7"
        >
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium whitespace-nowrap text-[var(--color-text-dark)] transition-colors hover:text-primary-green dark:text-[var(--color-text-light)] dark:hover:text-[var(--color-accent-green)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — theme toggle + auth (desktop) */}
        <div className="hidden nav:flex items-center gap-3">
          <ThemeToggle />
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-sm font-medium whitespace-nowrap text-[var(--color-text-dark)] transition-colors hover:text-primary-green dark:text-[var(--color-text-light)] dark:hover:text-[var(--color-accent-green)]"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-lg bg-primary-green px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[var(--color-deep-green)]"
            >
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/learn"
              className="text-sm font-medium whitespace-nowrap text-[var(--color-text-dark)] transition-colors hover:text-primary-green dark:text-[var(--color-text-light)] dark:hover:text-[var(--color-accent-green)]"
            >
              My Learning
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>
        </div>

        {/* Right — hamburger (mobile/tablet) */}
        <div className="flex nav:hidden items-center">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

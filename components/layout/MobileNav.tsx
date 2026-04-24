"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { primaryNavLinks } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-dark)] transition-colors hover:text-primary-green dark:text-[var(--color-text-light)] dark:hover:text-accent-green"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex h-full w-[85vw] max-w-sm flex-col bg-white shadow-xl outline-none dark:bg-[var(--color-dark-bg)]"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-5 py-4 dark:border-slate-800">
            <Dialog.Title className="font-display text-lg font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
              Menu
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-dark)] hover:text-primary-green dark:text-[var(--color-text-light)] dark:hover:text-accent-green"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex flex-col gap-1 px-5 py-6">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium whitespace-nowrap text-[var(--color-text-dark)] transition-colors hover:bg-[var(--color-light-mint)] hover:text-[var(--color-deep-green)] dark:text-[var(--color-text-light)] dark:hover:bg-slate-800 dark:hover:text-[var(--color-accent-green)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-[var(--color-border-subtle)] px-5 py-6 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">
                Theme
              </span>
              <ThemeToggle />
            </div>
            <SignedOut>
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border-subtle)] px-4 py-2.5 text-sm font-medium whitespace-nowrap text-[var(--color-text-dark)] transition-colors hover:border-primary-green hover:text-primary-green dark:border-slate-700 dark:text-[var(--color-text-light)] dark:hover:border-accent-green dark:hover:text-accent-green"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-lg bg-primary-green px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[var(--color-deep-green)]"
              >
                Sign up
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/learn"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-lg bg-primary-green px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[var(--color-deep-green)]"
              >
                My Learning
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-text-muted)]">
                  Account
                </span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

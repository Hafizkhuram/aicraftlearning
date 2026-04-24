import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your AICraft Learning account to continue your courses and track your progress.",
};

export default function SignInPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="accent-bar text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-primary-green)]">
            Welcome back
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-[var(--color-text-dark)] sm:text-4xl dark:text-[var(--color-text-light)]">
            Sign in to your account
          </h1>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-[var(--color-primary-green)] hover:bg-[var(--color-deep-green)] text-white text-sm font-medium normal-case",
              card: "shadow-sm border border-[var(--color-border-subtle)] rounded-xl",
              headerTitle: "font-display",
              footerActionLink:
                "text-[var(--color-primary-green)] hover:text-[var(--color-deep-green)]",
            },
            variables: {
              colorPrimary: "#10B981",
              fontFamily: "var(--font-dm-sans)",
              borderRadius: "0.5rem",
            },
          }}
        />
      </div>
    </section>
  );
}

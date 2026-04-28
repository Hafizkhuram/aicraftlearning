"use client";

// Enterprise contact form. Kept separate from GeneralContactForm because the
// enterprise field set (company name, team size) and register differ enough
// that a shared form would need a config layer that isn't justified by two
// callers.

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const TEAM_SIZES = ["1–10", "11–50", "51–200", "200+"] as const;

type FormErrors = {
  companyName?: string;
  fullName?: string;
  email?: string;
  message?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EnterpriseContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState<string>(TEAM_SIZES[1]);
  const [message, setMessage] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState(""); // honeypot

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!companyName.trim()) next.companyName = "Company name is required.";
    if (!fullName.trim()) next.fullName = "Your name is required.";
    if (!email.trim()) {
      next.email = "Work email is required.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = "Enter a valid work email.";
    }
    if (!message.trim()) next.message = "A short message helps us respond well.";
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "enterprise",
          companyName: companyName.trim(),
          fullName: fullName.trim(),
          email: email.trim(),
          teamSize,
          message: message.trim(),
          company_website: companyWebsite,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          fields?: Partial<FormErrors>;
        };
        if (res.status === 400 && data.fields) {
          setErrors(data.fields as FormErrors);
        } else {
          setSubmitError(
            data.error ||
              "Something went wrong sending your enquiry. Please try again.",
          );
        }
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError(
        "Couldn't reach our servers. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="relative overflow-hidden rounded-2xl border border-[var(--color-primary-green)] bg-[var(--color-light-mint)] p-8 sm:p-10 dark:border-[var(--color-accent-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_45%,transparent)]"
        style={{ borderWidth: "0.5px", borderTopWidth: "3px" }}
      >
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-deep-green)] shadow-[0_4px_14px_-6px_rgba(6,95,70,0.35)] dark:bg-[var(--color-dark-bg)] dark:text-[var(--color-accent-green)]">
            <CheckCircle2 size={26} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              Message received
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
              Thanks — we&rsquo;ll be in touch within one business day.
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-deep-green)] dark:text-slate-200">
              In the meantime, feel free to email{" "}
              <a
                href="mailto:enterprise@aicraftlearning.com"
                className="font-medium underline decoration-[var(--color-primary-green)] underline-offset-2 hover:text-[var(--color-primary-green)] dark:hover:text-[var(--color-accent-green)]"
              >
                enterprise@aicraftlearning.com
              </a>{" "}
              if anything else comes to mind.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-[#0F172A]"
      style={{ borderWidth: "0.5px" }}
    >
      <span
        aria-hidden="true"
        className="absolute top-7 bottom-7 left-0 w-[3px] rounded-r-full bg-[var(--color-primary-green)]"
      />

      <div className="flex flex-col gap-5 pl-3 sm:pl-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
            Talk to us
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
            Tell us about your team
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
            A few details help us route your enquiry to the right person and
            come prepared.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="company-name"
            label="Company name"
            required
            error={errors.companyName}
          >
            <input
              id="company-name"
              type="text"
              autoComplete="organization"
              value={companyName}
              onChange={(event) => {
                setCompanyName(event.target.value);
                if (errors.companyName) {
                  setErrors((prev) => ({ ...prev, companyName: undefined }));
                }
              }}
              aria-invalid={errors.companyName ? "true" : undefined}
              aria-describedby={
                errors.companyName ? "company-name-error" : undefined
              }
              className={inputClass(Boolean(errors.companyName))}
              style={{ borderWidth: "0.5px" }}
            />
          </Field>

          <Field
            id="full-name"
            label="Your name"
            required
            error={errors.fullName}
          >
            <input
              id="full-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: undefined }));
                }
              }}
              aria-invalid={errors.fullName ? "true" : undefined}
              aria-describedby={errors.fullName ? "full-name-error" : undefined}
              className={inputClass(Boolean(errors.fullName))}
              style={{ borderWidth: "0.5px" }}
            />
          </Field>

          <Field id="email" label="Work email" required error={errors.email}>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass(Boolean(errors.email))}
              style={{ borderWidth: "0.5px" }}
            />
          </Field>

          <Field id="team-size" label="Team size">
            <select
              id="team-size"
              value={teamSize}
              onChange={(event) => setTeamSize(event.target.value)}
              className={inputClass(false)}
              style={{ borderWidth: "0.5px" }}
            >
              {TEAM_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field id="message" label="Message" required error={errors.message}>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (errors.message) {
                setErrors((prev) => ({ ...prev, message: undefined }));
              }
            }}
            aria-invalid={errors.message ? "true" : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            placeholder="Roughly how many seats, what your team does, and what 'good' looks like."
            className={`${inputClass(Boolean(errors.message))} resize-y`}
            style={{ borderWidth: "0.5px" }}
          />
        </Field>

        {/* Honeypot — must stay invisible to humans, bots fill anything */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Company website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={companyWebsite}
              onChange={(event) => setCompanyWebsite(event.target.value)}
            />
          </label>
        </div>

        {submitError ? (
          <div
            role="alert"
            className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B] dark:border-[#7F1D1D] dark:bg-[color-mix(in_oklab,#7F1D1D_30%,transparent)] dark:text-[#FECACA]"
            style={{ borderWidth: "0.5px" }}
          >
            {submitError}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--color-text-muted)]">
            We reply within one business day.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-green)] px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[var(--color-primary-green)]"
          >
            {submitting ? "Sending…" : "Send enquiry"}
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </form>
  );
}

function inputClass(invalid: boolean) {
  return [
    "w-full rounded-xl bg-white px-4 py-3 text-sm text-[var(--color-text-dark)]",
    "placeholder:text-[var(--color-text-muted)] focus:outline-none",
    "focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
    "dark:bg-[#0b1322] dark:text-[var(--color-text-light)]",
    invalid
      ? "border border-[#B91C1C] focus:border-[#B91C1C] focus-visible:ring-[#B91C1C] dark:border-[#FCA5A5]"
      : "border border-[var(--color-border-subtle)] focus:border-[var(--color-primary-green)] focus-visible:ring-[var(--color-primary-green)] dark:border-slate-800",
  ].join(" ");
}

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--color-text-muted)]">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-[var(--color-primary-green)]">
            {" *"}
          </span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-[#B91C1C] dark:text-[#FCA5A5]"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}

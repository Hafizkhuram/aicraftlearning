"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const SUBJECT_OPTIONS = [
  { value: "general", label: "General" },
  { value: "course-question", label: "Course question" },
  { value: "aios-program", label: "AIOS programme" },
  { value: "assessment", label: "Assessment" },
  { value: "corporate", label: "Corporate" },
  { value: "certification", label: "Certification" },
  { value: "partnership", label: "Partnership" },
] as const;

type SubjectValue = (typeof SUBJECT_OPTIONS)[number]["value"];

const SUBJECT_VALUES = SUBJECT_OPTIONS.map((opt) => opt.value) as SubjectValue[];

// Aliases from inbound CTAs map onto the canonical dropdown values so the
// AIOS-business spotlight on /for-business and the discovery-call CTAs on
// /aios-program all funnel into the AIOS programme entry.
const SUBJECT_ALIASES: Record<string, SubjectValue> = {
  "aios-discovery-call": "aios-program",
  "aios-business": "aios-program",
};

function resolveSubject(raw: string | null): SubjectValue {
  if (!raw) return "general";
  if ((SUBJECT_VALUES as string[]).includes(raw)) return raw as SubjectValue;
  if (raw in SUBJECT_ALIASES) return SUBJECT_ALIASES[raw];
  return "general";
}

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState = () => ({
  name: "",
  email: "",
  phone: "",
  message: "",
});

export function GeneralContactForm() {
  const searchParams = useSearchParams();
  const initialSubject = resolveSubject(searchParams.get("subject"));

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<SubjectValue>(initialSubject);
  const [message, setMessage] = useState("");

  // Re-resolve if the user navigates between /contact?subject=X URLs without a
  // hard refresh (e.g. clicking another contact CTA from a sibling page).
  useEffect(() => {
    setSubject(resolveSubject(searchParams.get("subject")));
  }, [searchParams]);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (name.trim().length < 2) {
      next.name = "Please enter your name.";
    }
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (message.trim().length < 10) {
      next.message = "A short message (at least 10 characters) helps us respond well.";
    }
    return next;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    // TODO Phase 10: wire form submit to /api/contact endpoint, share with /for-business
    setSubmitted(true);
  }

  function reset() {
    const fresh = initialState();
    setName(fresh.name);
    setEmail(fresh.email);
    setPhone(fresh.phone);
    setMessage(fresh.message);
    setSubject(resolveSubject(searchParams.get("subject")));
    setErrors({});
    setSubmitted(false);
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
              Thanks &mdash; we&rsquo;ll reply within one business day.
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-deep-green)] dark:text-slate-200">
              <button
                type="button"
                onClick={reset}
                className="font-medium underline decoration-[var(--color-primary-green)] underline-offset-2 hover:text-[var(--color-primary-green)] dark:hover:text-[var(--color-accent-green)]"
              >
                Send another message
              </button>
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
            Send a message
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
            Tell us what you&rsquo;re looking for
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
            A few details help us route your enquiry to the right person and
            reply with something useful.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="name" label="Name" required error={errors.name}>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              aria-invalid={errors.name ? "true" : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClass(Boolean(errors.name))}
              style={{ borderWidth: "0.5px" }}
            />
          </Field>

          <Field id="email" label="Email" required error={errors.email}>
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

          <Field id="phone" label="Phone (optional)">
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={inputClass(false)}
              style={{ borderWidth: "0.5px" }}
            />
          </Field>

          <Field id="subject" label="Subject" required>
            <select
              id="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value as SubjectValue)}
              className={inputClass(false)}
              style={{ borderWidth: "0.5px" }}
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
            placeholder="A few sentences on what you need or what you&rsquo;re curious about."
            className={`${inputClass(Boolean(errors.message))} resize-y`}
            style={{ borderWidth: "0.5px" }}
          />
        </Field>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--color-text-muted)]">
            We reply within one business day.
          </p>
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-green)] px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)]"
          >
            Send message
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
    "dark:bg-[#0b1322] dark:text-[var(--color-text-light)]",
    invalid
      ? "border border-[#B91C1C] focus:border-[#B91C1C] dark:border-[#FCA5A5]"
      : "border border-[var(--color-border-subtle)] focus:border-[var(--color-primary-green)] dark:border-slate-800",
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

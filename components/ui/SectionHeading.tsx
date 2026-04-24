import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isDark = tone === "dark";

  return (
    <div
      className={[
        isCenter ? "mx-auto text-center" : "text-left",
        "max-w-2xl",
        className ?? "",
      ].join(" ")}
    >
      {eyebrow ? (
        <p
          className={[
            "text-xs font-semibold tracking-[0.2em] uppercase",
            isDark
              ? "text-[var(--color-accent-green)]"
              : "text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]",
          ].join(" ")}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={[
          "font-display font-semibold leading-[1.1] tracking-tight",
          "text-3xl sm:text-4xl",
          eyebrow ? "mt-3" : "",
          isDark
            ? "text-[var(--color-text-light)]"
            : "text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]",
          isCenter ? "" : "accent-bar",
        ].join(" ")}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={[
            "mt-4 text-base leading-relaxed sm:text-lg",
            isDark
              ? "text-slate-300"
              : "text-[var(--color-text-muted)] dark:text-slate-300",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { ChevronDown } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import type { CourseModule } from "@/lib/courses";

type Props = {
  modules: CourseModule[];
};

export function CurriculumAccordion({ modules }: Props) {
  return (
    <Accordion.Root
      type="multiple"
      defaultValue={[`module-${modules[0]?.number ?? 1}`]}
      className="flex flex-col gap-3"
    >
      {modules.map((module) => (
        <Accordion.Item
          key={module.number}
          value={`module-${module.number}`}
          className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-white dark:border-slate-800 dark:bg-[#0F172A]"
          style={{ borderWidth: "0.5px" }}
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--color-surface)] dark:hover:bg-[#0b1322]">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-sm font-semibold tracking-wide text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
                  Module {module.number}
                </span>
                <span className="font-display text-base font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)] sm:text-lg">
                  {module.title}
                </span>
              </div>
              <ChevronDown
                size={18}
                strokeWidth={2}
                className="shrink-0 text-[var(--color-text-muted)] transition-transform duration-300 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[accordion-up_220ms_ease] data-[state=open]:animate-[accordion-down_220ms_ease]">
            <ul className="border-t border-[var(--color-border-subtle)] dark:border-slate-800" style={{ borderTopWidth: "0.5px" }}>
              {module.lessons.map((lesson, idx) => (
                <li
                  key={lesson.slug}
                  className={[
                    "flex items-center justify-between gap-4 px-5 py-3 text-sm",
                    idx > 0
                      ? "border-t border-[var(--color-border-subtle)] dark:border-slate-800"
                      : "",
                  ].join(" ")}
                  style={idx > 0 ? { borderTopWidth: "0.5px" } : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-text-muted)]">
                      {lesson.isReview ? "Review" : `${idx + 1}.`}
                    </span>
                    <span className="text-[var(--color-text-dark)] dark:text-slate-200">
                      {lesson.title}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
                    {lesson.minutes} min
                  </span>
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

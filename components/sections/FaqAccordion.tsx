"use client";

import { ChevronDown } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import type { CourseFaq } from "@/lib/courses";

type Props = {
  items: CourseFaq[];
};

export function FaqAccordion({ items }: Props) {
  return (
    <Accordion.Root type="multiple" className="flex flex-col gap-3">
      {items.map((item, idx) => (
        <Accordion.Item
          key={idx}
          value={`faq-${idx}`}
          className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-white dark:border-slate-800 dark:bg-[#0F172A]"
          style={{ borderWidth: "0.5px" }}
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--color-surface)] dark:hover:bg-[#0b1322]">
              <span className="font-display text-base font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                strokeWidth={2}
                className="shrink-0 text-[var(--color-text-muted)] transition-transform duration-300 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            forceMount
            className="data-[state=closed]:hidden"
          >
            <p
              className="border-t border-[var(--color-border-subtle)] px-5 py-4 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:border-slate-800 dark:text-slate-300"
              style={{ borderTopWidth: "0.5px" }}
            >
              {item.answer}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

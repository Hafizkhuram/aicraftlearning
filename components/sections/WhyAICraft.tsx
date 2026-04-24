import { Hammer, FileText, Wrench, BadgeCheck, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";

type Differentiator = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const items: Differentiator[] = [
  {
    icon: Hammer,
    title: "Craft over theory",
    body:
      "We teach the how, not the what. Every lesson ends with something you can actually do — not a definition you can google.",
  },
  {
    icon: FileText,
    title: "Text-first",
    body:
      "No video filler, no padded lectures. Read at your pace, copy the prompts, skip what you already know.",
  },
  {
    icon: Wrench,
    title: "Tool-specific",
    body:
      "Claude, Claude Code, Make. Real tools we use ourselves — not vague 'AI in general' content that ages out in a quarter.",
  },
  {
    icon: BadgeCheck,
    title: "Certificate-verified",
    body:
      "Finish a course and get a verifiable URL. Employers can confirm it in one click — no PDF gymnastics.",
  },
];

export function WhyAICraft() {
  return (
    <section className="bg-[var(--color-light-mint)] py-24 sm:py-28 dark:bg-[#0a1f1a]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Why AICraft Learning"
            title="The opposite of AI-slop courses."
            description="We built this because we were tired of the alternatives. Here's what makes it different."
          />
        </FadeIn>

        <FadeInStagger className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2">
          {items.map(({ icon: Icon, title, body }) => (
            <FadeInItem key={title}>
              <article
                className="flex h-full gap-5 rounded-2xl border border-[var(--color-deep-green)]/10 bg-white p-7 transition-colors dark:border-slate-800 dark:bg-[#0f2a23]"
                style={{ borderWidth: "0.5px" }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-mint)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)]">
                  <Icon
                    size={22}
                    strokeWidth={1.75}
                    className="text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="accent-bar font-display text-lg font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                    {body}
                  </p>
                </div>
              </article>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}

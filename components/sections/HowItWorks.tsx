import { BookOpen, Hammer, Sparkles, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";

type Step = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    icon: BookOpen,
    title: "Read",
    body:
      "Short, focused text lessons you can finish on a coffee break. No padding, no autoplay videos — just the parts that matter.",
  },
  {
    icon: Hammer,
    title: "Practice",
    body:
      "Interactive exercises baked into every lesson. Try the prompt, see the output, and iterate until the technique sticks.",
  },
  {
    icon: Sparkles,
    title: "Apply",
    body:
      "End each module with a real-world brief. You finish with something you can use on Monday morning, not a certificate of attendance.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-24 sm:py-28 dark:bg-[var(--color-dark-bg)]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="How it works"
            title="Built around how adults actually learn."
            description="Every course follows the same simple loop. No fluff — just a clean rhythm of reading, doing, and applying."
          />
        </FadeIn>

        <FadeInStagger className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-7">
          {steps.map(({ icon: Icon, title, body }) => (
            <FadeInItem key={title}>
              <article className="h-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 transition-colors dark:border-slate-800 dark:bg-[#0b1322]"
                style={{ borderWidth: "0.5px" }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-light-mint)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)]">
                  <Icon
                    size={26}
                    strokeWidth={1.75}
                    className="text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]"
                  />
                </div>
                <h3 className="accent-bar mt-7 font-display text-xl font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                  {title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                  {body}
                </p>
              </article>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}

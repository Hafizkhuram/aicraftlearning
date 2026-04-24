import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// [PLACEHOLDER] copy — swap with real testimonials before launch.
const testimonials: Testimonial[] = [
  {
    quote:
      "The first AI course I've taken that respects my time. Read a lesson on the train, used the technique in a meeting that afternoon.",
    name: "Priya Chandra",
    role: "Marketing Lead",
  },
  {
    quote:
      "Finally — concrete patterns instead of 'AI will change everything' platitudes. The Claude Code module alone paid for the course three times over.",
    name: "Daniel Rhys",
    role: "Operations Manager",
  },
  {
    quote:
      "I came in skeptical and left with a workflow that saves me a day a week. Quietly excellent material.",
    name: "Sofia Alvares",
    role: "Independent Consultant",
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-24 sm:py-28 dark:bg-[var(--color-dark-bg)]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="What learners say"
            title="Quiet praise from people who don't have time for hype."
          />
        </FadeIn>

        <FadeInStagger className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
          {testimonials.map((t) => (
            <FadeInItem key={t.name}>
              <figure
                className="relative h-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 pl-8 dark:border-slate-800 dark:bg-[#0b1322]"
                style={{ borderWidth: "0.5px" }}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-7 bottom-7 left-0 w-[3px] rounded-r-full bg-[var(--color-primary-green)]"
                />
                <blockquote className="font-display text-[17px] leading-relaxed text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="block font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-accent-green)]">
                    {t.name}
                  </span>
                  <span className="block text-[var(--color-text-muted)]">
                    {t.role}
                  </span>
                </figcaption>
              </figure>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}

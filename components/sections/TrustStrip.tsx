import { FadeIn } from "@/components/ui/FadeIn";

// Placeholder trust marks — non-clickable wordmarks rendered as text so we don't
// imply real partnerships. Replace with actual logos when relationships exist.
const placeholders = [
  "Northwind Co.",
  "Helix Group",
  "Brightside",
  "Oakline",
  "Meridian Studio",
  "Castor & Co.",
];

export function TrustStrip() {
  return (
    <section className="border-y border-[var(--color-border-subtle)] bg-white dark:border-slate-800 dark:bg-[#0b1322]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-center text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-text-muted)]">
            Trusted by professionals at
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <ul className="mt-6 grid grid-cols-2 items-center gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
            {placeholders.map((name) => (
              <li
                key={name}
                className="text-center font-display text-base font-semibold tracking-tight text-slate-400 grayscale opacity-70 transition-opacity hover:opacity-100 dark:text-slate-500"
              >
                {name}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

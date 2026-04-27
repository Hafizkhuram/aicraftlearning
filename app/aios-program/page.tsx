import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Check,
  ChevronUp,
  FileText,
  GraduationCap,
  Layers,
  Mail,
  PhoneCall,
  Send,
  Sparkles,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/ui/FadeIn";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { getAiosProgram } from "@/lib/aiosProgram";
import { siteName, siteUrl } from "@/lib/constants";
import { courseSchema, jsonLdScript } from "@/lib/structured-data";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  BarChart3,
  Brain,
  Workflow,
  Send,
  Sparkles,
  Layers,
  PhoneCall,
  FileText,
};

function pickIcon(name: string): LucideIcon {
  return iconMap[name] ?? BookOpen;
}

export async function generateMetadata(): Promise<Metadata> {
  const program = await getAiosProgram();
  const url = `${siteUrl}${program.metadata.canonical}`;
  return {
    title: program.metadata.title,
    description: program.metadata.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${program.metadata.title} · ${siteName}`,
      description: program.metadata.description,
      url,
      siteName,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${program.metadata.title} · ${siteName}`,
      description: program.metadata.description,
    },
  };
}

export default async function AiosProgramPage() {
  const program = await getAiosProgram();
  const { hero, stack, craftDifference, curriculum, tools, whoItsFor, valueLadder, pricing, faqs } =
    program;

  const programUrl = `${siteUrl}${program.metadata.canonical}`;
  const programJsonLd = courseSchema({
    name: program.metadata.title,
    description: `${program.metadata.description} From $2,499; final scope confirmed via discovery call.`,
    url: programUrl,
    price: 2499,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(programJsonLd) }}
      />
      {/* Hero — dark */}
      <section className="relative isolate overflow-hidden bg-[var(--color-dark-bg)] text-[var(--color-text-light)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 -right-24 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.30),rgba(16,185,129,0)_65%)] blur-3xl" />
          <div className="absolute -bottom-44 -left-32 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.16),rgba(52,211,153,0)_70%)] blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <FadeIn>
            <p className="accent-bar text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-accent-green)]">
              {hero.eyebrow}
            </p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <h1 className="mt-5 max-w-4xl font-display text-[40px] font-bold leading-[1.05] tracking-tight sm:text-[56px] lg:text-[68px]">
              {hero.headline}
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {hero.subhead}
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <dl className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-2 sm:gap-x-5">
              {hero.stats.map((stat, idx) => (
                <div key={stat.label} className="flex items-baseline gap-x-3 sm:gap-x-5">
                  <div className="inline-flex items-baseline gap-2">
                    <dd className="font-display text-3xl font-semibold leading-none text-[var(--color-accent-green)] sm:text-4xl">
                      {stat.value}
                    </dd>
                    <dt className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-300">
                      {stat.label}
                    </dt>
                  </div>
                  {idx < hero.stats.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="text-slate-600"
                    >
                      ·
                    </span>
                  ) : null}
                </div>
              ))}
            </dl>
          </FadeIn>

          <FadeIn delay={0.32}>
            <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Link
                href={hero.primaryCta.href}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary-green)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)] sm:text-[15px]"
              >
                {hero.primaryCta.label}
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-200 transition-colors hover:text-[var(--color-accent-green)] sm:text-[15px]"
              >
                {hero.secondaryCta.label}
                <ChevronUp
                  size={15}
                  strokeWidth={2}
                  className="rotate-180 transition-transform group-hover:translate-y-0.5"
                />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What is an AIOS — white */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              What is an AIOS
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Not software you install. The way you organise your work.
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="mt-7 text-base leading-relaxed text-[var(--color-text-dark)] sm:text-lg sm:leading-[1.7] dark:text-slate-200">
              {program.whatIsAios}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Five-layer stack — mint */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              {stack.eyebrow}
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              {stack.heading}
            </h2>
          </FadeIn>

          <FadeInStagger
            className="mt-12 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-white shadow-[0_24px_50px_-30px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-[#0F172A]"
            delayStep={0.08}
          >
            {stack.layers.map((layer, idx) => {
              const Icon = pickIcon(layer.icon);
              const total = stack.layers.length;
              const isLast = idx === total - 1;
              // Lower layers (closer to foundation) carry more visual weight.
              // depth=0 is top (Output, lightest); depth=total-1 is bottom (Context, heaviest).
              const depth = idx;
              const accentOpacity = 0.35 + (depth / (total - 1)) * 0.6;
              return (
                <FadeInItem key={layer.number}>
                  <div
                    className="group relative flex flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
                    style={
                      isLast
                        ? undefined
                        : {
                            borderBottomWidth: "0.5px",
                            borderBottomStyle: "solid",
                            borderBottomColor: "var(--color-border-subtle)",
                          }
                    }
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 left-0 w-[3px] bg-[var(--color-primary-green)]"
                      style={{ opacity: accentOpacity }}
                    />

                    <div className="flex items-center gap-5 sm:w-auto">
                      <span className="font-display text-base font-semibold text-[var(--color-text-muted)]">
                        {layer.number}
                      </span>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-mint)] text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
                        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-xl font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                        {layer.name}
                      </h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                        {layer.tagline}
                      </p>
                    </div>

                    <span className="self-start whitespace-nowrap rounded-full bg-[var(--color-light-mint)] px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-deep-green)] sm:self-auto dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
                      {layer.module}
                    </span>
                  </div>
                </FadeInItem>
              );
            })}
          </FadeInStagger>

          {/* Ground-line — visual cue that Context is the load-bearing foundation */}
          <div
            aria-hidden="true"
            className="mt-3 flex items-center gap-3 px-1 sm:px-2"
          >
            <span className="h-px flex-1 bg-[var(--color-primary-green)]/45" />
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[var(--color-text-muted)]">
              Foundation
            </span>
            <span className="h-px flex-1 bg-[var(--color-primary-green)]/45" />
          </div>

          <FadeIn delay={0.12}>
            <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:text-base dark:text-slate-300">
              {stack.footer}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* The craft difference — white */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              {craftDifference.eyebrow}
            </p>
            <h2 className="accent-bar mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              {craftDifference.heading}
            </h2>
          </FadeIn>

          <div className="mt-12 grid grid-cols-1 gap-3 sm:gap-4">
            <FadeInStagger
              className="hidden grid-cols-2 gap-4 text-[11px] font-semibold tracking-[0.2em] uppercase sm:grid"
              delayStep={0.05}
            >
              <FadeInItem>
                <p className="text-[var(--color-text-muted)]">
                  Generic AI courses
                </p>
              </FadeInItem>
              <FadeInItem>
                <p className="text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
                  Your business, your AIOS
                </p>
              </FadeInItem>
            </FadeInStagger>

            <FadeInStagger className="flex flex-col gap-3 sm:gap-4" delayStep={0.05}>
              {craftDifference.pairs.map((pair) => (
                <FadeInItem key={pair.left + pair.right}>
                  <div
                    className="grid grid-cols-1 gap-3 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 sm:grid-cols-2 sm:gap-6 sm:p-6 dark:border-slate-800 dark:bg-[#0b1322]"
                    style={{ borderWidth: "0.5px" }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-muted)]"
                      />
                      <p className="text-[15px] leading-relaxed text-[var(--color-text-muted)] line-through decoration-[var(--color-text-muted)]/40 sm:text-base dark:text-slate-400">
                        {pair.left}
                      </p>
                    </div>
                    <div className="flex items-start gap-3 border-t border-[var(--color-border-subtle)] pt-3 sm:border-t-0 sm:pt-0 sm:pl-6 sm:[border-left-width:0.5px] sm:border-l-[var(--color-border-subtle)] dark:sm:border-l-slate-800">
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-mint)] text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
                        <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      <p className="text-[15px] leading-relaxed font-medium text-[var(--color-deep-green)] sm:text-base dark:text-[var(--color-text-light)]">
                        {pair.right}
                      </p>
                    </div>
                  </div>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* Curriculum — mint */}
      <section
        id="curriculum"
        className="scroll-mt-24 bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              {curriculum.eyebrow}
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              {curriculum.heading}
            </h2>
          </FadeIn>

          <div className="mt-14 flex flex-col gap-14">
            {curriculum.phases.map((phase) => (
              <div key={phase.name}>
                <FadeIn>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
                      {phase.name}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-[var(--color-deep-green)] sm:text-[26px] dark:text-[var(--color-text-light)]">
                      {phase.title}
                      <span className="ml-2 text-[var(--color-text-muted)]">
                        — {phase.subtitle}
                      </span>
                    </h3>
                  </div>
                </FadeIn>

                <FadeInStagger
                  className={`mt-7 grid grid-cols-1 gap-5 ${
                    phase.modules.length >= 4
                      ? "lg:grid-cols-2"
                      : phase.modules.length === 2
                        ? "md:grid-cols-2"
                        : ""
                  }`}
                  delayStep={0.06}
                >
                  {phase.modules.map((module) => (
                    <FadeInItem key={module.number} className="h-full">
                      <article
                        className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 ${
                          module.isCapstone
                            ? "border-[var(--color-primary-green)] bg-[var(--color-light-mint)] dark:border-[var(--color-accent-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_45%,transparent)]"
                            : "border-[var(--color-border-subtle)] bg-white dark:border-slate-800 dark:bg-[#0F172A]"
                        }`}
                        style={{
                          borderWidth: "0.5px",
                          borderTopWidth: module.isCapstone ? "3px" : "0.5px",
                        }}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-[var(--color-light-mint)] px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
                            {module.number}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-[var(--color-border-subtle)] bg-white px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-[var(--color-text-muted)] dark:border-slate-700 dark:bg-[#0b1322] dark:text-slate-300">
                            {module.layer}
                          </span>
                          {module.isCapstone ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-deep-green)] px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-white dark:bg-[var(--color-primary-green)]">
                              <GraduationCap size={12} strokeWidth={2} aria-hidden="true" />
                              Capstone
                            </span>
                          ) : null}
                        </div>

                        <h4 className="mt-5 font-display text-xl font-semibold leading-snug text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
                          {module.title}
                        </h4>

                        <ul className="mt-5 flex flex-col gap-2.5">
                          {module.lessons.map((lesson) => (
                            <li
                              key={lesson}
                              className="flex items-start gap-3 text-[14.5px] leading-relaxed text-[var(--color-text-dark)] dark:text-slate-200"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-green)]"
                              />
                              <span>{lesson}</span>
                            </li>
                          ))}
                        </ul>

                        <div
                          className="mt-7 rounded-xl border border-[var(--color-primary-green)] bg-white px-4 py-3 dark:border-[var(--color-accent-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_30%,transparent)]"
                          style={{ borderWidth: "0.5px", borderLeftWidth: "3px" }}
                        >
                          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
                            Outcome
                          </p>
                          <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-deep-green)] dark:text-slate-100">
                            {module.outcome}
                          </p>
                        </div>
                      </article>
                    </FadeInItem>
                  ))}
                </FadeInStagger>
              </div>
            ))}
          </div>

          <FadeIn delay={0.1}>
            <p className="mt-12 max-w-2xl text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:text-base dark:text-slate-300">
              {curriculum.footer}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Tool stack — white */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              {tools.eyebrow}
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              {tools.heading}
            </h2>
          </FadeIn>

          <FadeInStagger
            className="mt-10 flex flex-wrap gap-3"
            delayStep={0.05}
          >
            {tools.chips.map((chip) => {
              const Icon = pickIcon(chip.icon);
              return (
                <FadeInItem key={chip.label}>
                  <span
                    className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-light-mint)] px-4 py-2.5 text-sm font-semibold text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]"
                  >
                    <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
                    <span>{chip.label}</span>
                    <span className="text-[12px] font-medium text-[var(--color-deep-green)]/70 dark:text-[var(--color-accent-green)]/70">
                      · {chip.sublabel}
                    </span>
                  </span>
                </FadeInItem>
              );
            })}
          </FadeInStagger>

          <FadeIn delay={0.12}>
            <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:text-base dark:text-slate-300">
              {tools.footer}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Who this is for — mint */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              {whoItsFor.eyebrow}
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              {whoItsFor.heading}
            </h2>
          </FadeIn>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FadeIn>
              <article
                className="relative h-full rounded-2xl border border-[var(--color-border-subtle)] bg-white p-7 sm:p-8 dark:border-slate-800 dark:bg-[#0F172A]"
                style={{ borderWidth: "0.5px" }}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-8 bottom-8 left-0 w-[3px] rounded-r-full bg-[var(--color-primary-green)]"
                />
                <div className="pl-3">
                  <h3 className="font-display text-xl font-semibold text-[var(--color-deep-green)] sm:text-2xl dark:text-[var(--color-text-light)]">
                    {whoItsFor.forYou.title}
                  </h3>
                  <ul className="mt-6 flex flex-col gap-3.5">
                    {whoItsFor.forYou.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-mint)] text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
                          <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span className="text-[15px] leading-relaxed text-[var(--color-text-dark)] dark:text-slate-200">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </FadeIn>

            <FadeIn delay={0.1}>
              <article
                className="relative h-full rounded-2xl border border-[var(--color-border-subtle)] bg-white p-7 sm:p-8 dark:border-slate-800 dark:bg-[#0F172A]"
                style={{ borderWidth: "0.5px" }}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-8 bottom-8 left-0 w-[3px] rounded-r-full bg-[var(--color-text-muted)]/40"
                />
                <div className="pl-3">
                  <h3 className="font-display text-xl font-semibold text-[var(--color-deep-green)] sm:text-2xl dark:text-[var(--color-text-light)]">
                    {whoItsFor.notForYou.title}
                  </h3>
                  <ul className="mt-6 flex flex-col gap-3.5">
                    {whoItsFor.notForYou.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-border-subtle)] text-[var(--color-text-muted)] dark:bg-slate-800 dark:text-slate-400">
                          <X size={13} strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span className="text-[15px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Value ladder — dark */}
      <section className="relative isolate overflow-hidden bg-[var(--color-dark-bg)] py-20 text-[var(--color-text-light)] sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 right-1/4 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.22),rgba(16,185,129,0)_65%)] blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.14),rgba(52,211,153,0)_70%)] blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="accent-bar text-xs font-semibold tracking-[0.22em] uppercase text-[var(--color-accent-green)]">
              {valueLadder.eyebrow}
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
              {valueLadder.heading}
            </h2>
          </FadeIn>

          <FadeInStagger
            className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
            delayStep={0.08}
          >
            {valueLadder.steps.map((step, idx) => {
              const isCapstone = Boolean(step.isCapstone);
              const intensity = idx;
              const accentBg = [
                "bg-[color-mix(in_oklab,var(--color-primary-green)_8%,#0b1322)]",
                "bg-[color-mix(in_oklab,var(--color-primary-green)_14%,#0b1322)]",
                "bg-[color-mix(in_oklab,var(--color-primary-green)_20%,#0b1322)]",
                "bg-[color-mix(in_oklab,var(--color-primary-green)_30%,#0b1322)]",
              ][intensity];
              return (
                <FadeInItem key={step.title} className="h-full">
                  <Link
                    href={step.href}
                    className={`group relative flex h-full flex-col rounded-2xl border p-6 transition-all sm:p-7 ${
                      isCapstone
                        ? `border-[var(--color-accent-green)] ${accentBg} hover:-translate-y-0.5 hover:border-[var(--color-primary-green)]`
                        : "border-slate-800 bg-[color-mix(in_oklab,var(--color-dark-bg)_60%,#0b1322)] hover:-translate-y-0.5 hover:border-[var(--color-accent-green)]"
                    }`}
                    style={{
                      borderWidth: "0.5px",
                      borderTopWidth: isCapstone ? "3px" : "0.5px",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-semibold text-[var(--color-accent-green)]">
                        {`Step ${idx + 1}`}
                      </span>
                      {isCapstone ? (
                        <span className="inline-flex items-center rounded-full bg-[var(--color-primary-green)] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-white">
                          Flagship programme
                        </span>
                      ) : null}
                    </div>
                    <h3
                      className={`mt-4 font-display font-semibold leading-snug ${
                        isCapstone
                          ? "text-2xl text-[var(--color-text-light)]"
                          : "text-xl text-[var(--color-text-light)]"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-slate-300">
                      {step.tagline}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-7 text-xs font-semibold text-[var(--color-accent-green)] transition-transform group-hover:translate-x-0.5">
                      {isCapstone ? "View programme" : "View course"}
                      <ArrowRight size={13} strokeWidth={2} />
                    </span>
                  </Link>
                </FadeInItem>
              );
            })}
          </FadeInStagger>

          <FadeIn delay={0.1}>
            <p className="mt-10 max-w-3xl text-[15px] leading-relaxed text-slate-300 sm:text-base">
              {valueLadder.footer}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing card — white */}
      <section className="bg-white py-20 sm:py-24 dark:bg-[var(--color-dark-bg)]">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              {pricing.eyebrow}
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              {pricing.heading}
            </h2>
          </FadeIn>

          <FadeIn delay={0.08}>
            <article
              className="relative mt-10 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-7 sm:p-10 dark:border-slate-800 dark:bg-[#0b1322]"
              style={{ borderWidth: "0.5px" }}
            >
              <span
                aria-hidden="true"
                className="absolute top-8 bottom-8 left-0 w-[3px] rounded-r-full bg-[var(--color-primary-green)]"
              />

              <div className="pl-3 sm:pl-4">
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
                  Flagship programme
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-[var(--color-deep-green)] sm:text-3xl dark:text-[var(--color-text-light)]">
                  AIOS Mastery — full programme
                </h3>

                <div className="mt-6 flex items-baseline gap-2">
                  <p className="font-display text-4xl font-semibold text-[var(--color-deep-green)] sm:text-5xl dark:text-[var(--color-text-light)]">
                    {pricing.displayString}
                  </p>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                  {pricing.priceFootnote}
                </p>

                <div className="my-7 h-px w-full bg-[var(--color-border-subtle)] dark:bg-slate-800" />

                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
                  What&rsquo;s included
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {pricing.included.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-mint)] text-[var(--color-deep-green)] dark:bg-[color-mix(in_oklab,var(--color-deep-green)_55%,transparent)] dark:text-[var(--color-accent-green)]">
                        <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-[var(--color-text-dark)] dark:text-slate-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    href={pricing.primaryCta.href}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-green)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-px hover:bg-[var(--color-deep-green)] sm:w-auto sm:text-[15px]"
                  >
                    {pricing.primaryCta.label}
                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                  <p className="mt-4 inline-flex items-start gap-2 text-[13px] leading-relaxed text-[var(--color-text-muted)] dark:text-slate-300">
                    <Mail
                      size={14}
                      strokeWidth={1.8}
                      className="mt-1 shrink-0 text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]"
                      aria-hidden="true"
                    />
                    <span>
                      Or email{" "}
                      <a
                        href={`mailto:${pricing.secondaryEmail}`}
                        className="font-medium text-[var(--color-deep-green)] underline decoration-[var(--color-primary-green)] underline-offset-2 hover:text-[var(--color-primary-green)] dark:text-[var(--color-text-light)] dark:hover:text-[var(--color-accent-green)]"
                      >
                        {pricing.secondaryEmail}
                      </a>{" "}
                      directly — we reply within 24 hours.
                    </span>
                  </p>
                </div>
              </div>
            </article>
          </FadeIn>

          <FadeIn delay={0.14}>
            <p className="mt-6 text-center text-[13px] font-medium tracking-wide text-[var(--color-text-muted)] sm:text-sm dark:text-slate-400">
              {pricing.reassuranceStrip}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FAQ — mint */}
      <section className="bg-[var(--color-surface)] py-20 sm:py-24 dark:bg-[#0b1322]">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-primary-green)] dark:text-[var(--color-accent-green)]">
              FAQ
            </p>
            <h2 className="accent-bar mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--color-deep-green)] sm:text-4xl dark:text-[var(--color-text-light)]">
              Common questions
            </h2>
          </FadeIn>

          <div className="mt-10">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:hidden">
        <div
          className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border-subtle)] bg-white p-3 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-[#0F172A]"
          style={{ borderWidth: "0.5px" }}
        >
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium tracking-[0.18em] uppercase text-[var(--color-text-muted)]">
              Flagship
            </p>
            <p className="truncate font-display text-base font-semibold text-[var(--color-deep-green)] dark:text-[var(--color-text-light)]">
              {pricing.displayString}
            </p>
          </div>
          <Link
            href={pricing.primaryCta.href}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary-green)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-deep-green)]"
          >
            Book a call
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </>
  );
}

import { promises as fs } from "fs";
import path from "path";

export type AiosCta = {
  label: string;
  href: string;
};

export type AiosStat = {
  value: string;
  label: string;
};

export type AiosLayer = {
  number: string;
  name: string;
  tagline: string;
  module: string;
  icon: string;
};

export type AiosPair = {
  left: string;
  right: string;
};

export type AiosModule = {
  number: string;
  layer: string;
  title: string;
  lessons: string[];
  outcome: string;
  isCapstone?: boolean;
};

export type AiosPhase = {
  name: string;
  title: string;
  subtitle: string;
  modules: AiosModule[];
};

export type AiosToolChip = {
  label: string;
  sublabel: string;
  icon: string;
};

export type AiosLadderStep = {
  title: string;
  tagline: string;
  price: string;
  href: string;
  isCapstone?: boolean;
};

export type AiosFaq = {
  question: string;
  answer: string;
};

export type AiosProgram = {
  slug: string;
  title: string;
  subtitle: string;
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    stats: AiosStat[];
    primaryCta: AiosCta;
    secondaryCta: AiosCta;
  };
  whatIsAios: string;
  stack: {
    eyebrow: string;
    heading: string;
    footer: string;
    layers: AiosLayer[];
  };
  craftDifference: {
    eyebrow: string;
    heading: string;
    pairs: AiosPair[];
  };
  curriculum: {
    eyebrow: string;
    heading: string;
    footer: string;
    phases: AiosPhase[];
  };
  tools: {
    eyebrow: string;
    heading: string;
    footer: string;
    chips: AiosToolChip[];
  };
  whoItsFor: {
    eyebrow: string;
    heading: string;
    forYou: { title: string; items: string[] };
    notForYou: { title: string; items: string[] };
  };
  valueLadder: {
    eyebrow: string;
    heading: string;
    footer: string;
    steps: AiosLadderStep[];
  };
  pricing: {
    eyebrow: string;
    heading: string;
    fromPrice: string;
    displayString: string;
    priceFootnote: string;
    included: string[];
    primaryCta: AiosCta;
    secondaryText: string;
    secondaryEmail: string;
    reassuranceStrip: string;
  };
  faqs: AiosFaq[];
  metadata: {
    title: string;
    description: string;
    canonical: string;
  };
};

const FILE_PATH = path.join(process.cwd(), "content", "aios-program.json");

export async function getAiosProgram(): Promise<AiosProgram> {
  const raw = await fs.readFile(FILE_PATH, "utf-8");
  return JSON.parse(raw) as AiosProgram;
}

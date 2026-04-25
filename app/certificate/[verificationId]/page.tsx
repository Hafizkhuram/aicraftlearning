import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPrisma } from "@/lib/db";
import { siteName, siteUrl } from "@/lib/constants";
import { CopyLinkButton } from "./CopyLinkButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ verificationId: string }>;
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function lookupCertificate(rawId: string) {
  const id = rawId.toUpperCase();
  if (!/^[A-Z0-9-]{6,40}$/.test(id)) return null;
  const prisma = getPrisma();
  return prisma.certificate.findUnique({
    where: { verificationId: id },
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { verificationId } = await params;
  const cert = await lookupCertificate(verificationId);

  if (!cert) {
    return {
      title: "Certificate not found",
      description:
        "This certificate ID does not match a published certificate.",
      robots: { index: false, follow: false },
    };
  }

  const title = `Certificate of Completion — ${cert.learnerName}`;
  const description = `${cert.learnerName} completed ${cert.courseTitle} at ${siteName}.`;
  const url = `${siteUrl}/certificate/${cert.verificationId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicCertificatePage({ params }: PageProps) {
  const { verificationId } = await params;
  const cert = await lookupCertificate(verificationId);
  if (!cert) notFound();

  const issued = formatDate(cert.issuedAt);
  const publicUrl = `${siteUrl}/certificate/${cert.verificationId}`;

  return (
    <article className="bg-white text-[var(--color-text-dark)] dark:bg-white">
      <style>{`@media print {
        nav, footer, .cert-actions { display: none !important; }
        body { background: #ffffff !important; }
        .cert-page { padding: 0 !important; }
      }`}</style>

      <section className="cert-page mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
        <div className="flex justify-center">
          <Image
            src="/aicraft-logo-primary.svg"
            alt="AICraft Learning"
            width={220}
            height={56}
            priority
          />
        </div>

        <header className="mt-10 text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[var(--color-deep-green)] uppercase">
            Certificate of Completion
          </p>
          <h1 className="mt-5 font-display text-[42px] leading-[1.05] font-medium text-[var(--color-text-dark)] sm:text-[56px]">
            {cert.learnerName}
          </h1>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            has successfully completed
          </p>
          <p className="mt-3 font-display text-2xl font-semibold text-[var(--color-deep-green)] sm:text-3xl">
            {cert.courseTitle}
          </p>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            on {issued}
          </p>
        </header>

        <div
          aria-hidden="true"
          className="mx-auto mt-10 h-px w-32 bg-[var(--color-primary-green)]"
        />

        <dl className="mt-10 grid grid-cols-1 gap-3 text-center sm:grid-cols-2 sm:text-left">
          <div>
            <dt className="text-[10px] font-semibold tracking-[0.18em] text-[var(--color-text-muted)] uppercase">
              Verification ID
            </dt>
            <dd className="mt-1 font-mono text-sm text-[var(--color-text-dark)]">
              {cert.verificationId}
            </dd>
          </div>
          <div className="sm:text-right">
            <dt className="text-[10px] font-semibold tracking-[0.18em] text-[var(--color-text-muted)] uppercase">
              Issued by
            </dt>
            <dd className="mt-1 text-sm text-[var(--color-text-dark)]">
              {siteName}
            </dd>
          </div>
        </dl>

        <div className="cert-actions mt-12 flex flex-wrap items-center justify-center gap-3 border-t border-[var(--color-border-subtle)] pt-8">
          <CopyLinkButton url={publicUrl} />
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--color-primary-green)] px-4 py-2 text-sm font-medium text-[var(--color-deep-green)] transition-colors hover:bg-[var(--color-primary-green)] hover:text-white"
          >
            Explore AICraft courses →
          </Link>
        </div>
      </section>
    </article>
  );
}

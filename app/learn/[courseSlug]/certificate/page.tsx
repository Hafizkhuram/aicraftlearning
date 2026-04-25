import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getCourseManifest } from "@/lib/courses";
import { CertificateViewer } from "@/components/learn/CertificateViewer";
import { siteUrl } from "@/lib/constants";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) return { title: "Certificate" };
  return {
    title: `Certificate · ${manifest.title}`,
    description: `Your AICraft Learning certificate for ${manifest.title}.`,
    robots: { index: false, follow: false },
  };
}

export default async function AuthenticatedCertificatePage({
  params,
}: PageProps) {
  const { courseSlug } = await params;
  const manifest = await getCourseManifest(courseSlug);
  if (!manifest) notFound();

  const user = await getOrCreateUser();
  const prisma = getPrisma();
  const certificate = await prisma.certificate.findUnique({
    where: { userId_courseSlug: { userId: user.id, courseSlug } },
  });
  if (!certificate) redirect(`/learn/${courseSlug}`);

  const publicShareUrl = `${siteUrl}/certificate/${certificate.verificationId}`;

  return (
    <CertificateViewer
      certificateHtmlPath={manifest.certificateHtmlPath}
      learnerName={certificate.learnerName}
      issuedAtISO={certificate.issuedAt.toISOString()}
      verificationId={certificate.verificationId}
      publicShareUrl={publicShareUrl}
      courseTitle={manifest.title}
    />
  );
}

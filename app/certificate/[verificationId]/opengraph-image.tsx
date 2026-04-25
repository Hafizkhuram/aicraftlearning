import { ImageResponse } from "next/og";
import { getPrisma } from "@/lib/db";

export const runtime = "nodejs";
export const alt = "AICraft Learning — Certificate of Completion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type RouteProps = { params: { verificationId: string } };

async function lookupCertificate(rawId: string) {
  const id = rawId.toUpperCase();
  if (!/^[A-Z0-9-]{6,40}$/.test(id)) return null;
  const prisma = getPrisma();
  return prisma.certificate.findUnique({ where: { verificationId: id } });
}

export default async function OpengraphImage({ params }: RouteProps) {
  const cert = await lookupCertificate(params.verificationId);

  const learnerName = cert?.learnerName ?? "Certificate of Completion";
  const courseTitle = cert?.courseTitle ?? "AICraft Learning";
  const verificationId = cert?.verificationId ?? "";

  const issued = cert
    ? cert.issuedAt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0F172A 0%, #065F46 100%)",
          color: "#F8FAFC",
          padding: "72px 88px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 460,
            height: 460,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(16,185,129,0.30), rgba(16,185,129,0) 65%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#A7F3D0",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          AICraft Learning · Certificate of Completion
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 60,
          }}
        >
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: -1.2,
            }}
          >
            {learnerName}
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 22,
              color: "#CBD5E1",
            }}
          >
            has successfully completed
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 38,
              fontWeight: 600,
              color: "#34D399",
            }}
          >
            {courseTitle}
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#94A3B8",
            fontSize: 18,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 14, letterSpacing: 2, color: "#64748B" }}>
              VERIFICATION ID
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 22, color: "#E2E8F0" }}>
              {verificationId}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
            <span style={{ fontSize: 14, letterSpacing: 2, color: "#64748B" }}>
              ISSUED
            </span>
            <span style={{ fontSize: 22, color: "#E2E8F0" }}>{issued}</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

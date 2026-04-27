import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { rateLimit } from "@/lib/rateLimit";
import { contactEmail } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SUBJECT_VALUES = [
  "general",
  "course-question",
  "aios-program",
  "assessment",
  "corporate",
  "certification",
  "partnership",
] as const;
type SubjectValue = (typeof SUBJECT_VALUES)[number];

const TEAM_SIZES = ["1–10", "11–50", "51–200", "200+"] as const;
type TeamSize = (typeof TEAM_SIZES)[number];

type GeneralPayload = {
  type: "general";
  name: string;
  email: string;
  phone?: string;
  subject: SubjectValue;
  message: string;
  company_website?: string; // honeypot
};

type EnterprisePayload = {
  type: "enterprise";
  companyName: string;
  fullName: string;
  email: string;
  teamSize: TeamSize;
  message: string;
  company_website?: string; // honeypot
};

type ValidationErrors = Record<string, string>;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function validateGeneral(p: Partial<GeneralPayload>): {
  data?: GeneralPayload;
  errors?: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const name = (p.name ?? "").trim();
  const email = (p.email ?? "").trim();
  const phone = (p.phone ?? "").trim();
  const subject = p.subject;
  const message = (p.message ?? "").trim();

  if (name.length < 2) errors.name = "Please enter your name.";
  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email address.";
  if (!subject || !(SUBJECT_VALUES as readonly string[]).includes(subject)) {
    errors.subject = "Choose a subject.";
  }
  if (message.length < 10) {
    errors.message =
      "A short message (at least 10 characters) helps us respond well.";
  }
  if (message.length > 5000) errors.message = "Message is too long.";

  if (Object.keys(errors).length > 0) return { errors };
  return {
    data: {
      type: "general",
      name,
      email,
      phone: phone || undefined,
      subject: subject as SubjectValue,
      message,
    },
  };
}

function validateEnterprise(p: Partial<EnterprisePayload>): {
  data?: EnterprisePayload;
  errors?: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const companyName = (p.companyName ?? "").trim();
  const fullName = (p.fullName ?? "").trim();
  const email = (p.email ?? "").trim();
  const teamSize = p.teamSize;
  const message = (p.message ?? "").trim();

  if (!companyName) errors.companyName = "Company name is required.";
  if (!fullName) errors.fullName = "Your name is required.";
  if (!email) errors.email = "Work email is required.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid work email.";
  if (!teamSize || !(TEAM_SIZES as readonly string[]).includes(teamSize)) {
    errors.teamSize = "Choose a team size.";
  }
  if (!message) errors.message = "A short message helps us respond well.";
  if (message.length > 5000) errors.message = "Message is too long.";

  if (Object.keys(errors).length > 0) return { errors };
  return {
    data: {
      type: "enterprise",
      companyName,
      fullName,
      email,
      teamSize: teamSize as TeamSize,
      message,
    },
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function buildEmail(payload: GeneralPayload | EnterprisePayload): {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
} {
  if (payload.type === "general") {
    const subject = `[Contact: ${payload.subject}] ${payload.name}`;
    const text =
      `New message from ${payload.name} <${payload.email}>\n` +
      `Subject: ${payload.subject}\n` +
      (payload.phone ? `Phone: ${payload.phone}\n` : "") +
      `\n${payload.message}\n`;
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:600px">
        <h2 style="margin:0 0 8px 0">New contact form message</h2>
        <p style="margin:0 0 16px 0;color:#475569">
          From <strong>${escapeHtml(payload.name)}</strong> &lt;${escapeHtml(payload.email)}&gt;
        </p>
        <table style="border-collapse:collapse;margin:0 0 16px 0">
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">Subject</td><td>${escapeHtml(payload.subject)}</td></tr>
          ${payload.phone ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Phone</td><td>${escapeHtml(payload.phone)}</td></tr>` : ""}
        </table>
        <div style="border-left:3px solid #10B981;padding:8px 12px;background:#F0FDF4">
          ${nl2br(payload.message)}
        </div>
      </div>
    `.trim();
    return { subject, text, html, replyTo: payload.email };
  }

  const subject = `[Enterprise enquiry] ${payload.companyName} (${payload.teamSize})`;
  const text =
    `New enterprise enquiry from ${payload.fullName} <${payload.email}>\n` +
    `Company: ${payload.companyName}\n` +
    `Team size: ${payload.teamSize}\n` +
    `\n${payload.message}\n`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:600px">
      <h2 style="margin:0 0 8px 0">New enterprise enquiry</h2>
      <p style="margin:0 0 16px 0;color:#475569">
        From <strong>${escapeHtml(payload.fullName)}</strong> &lt;${escapeHtml(payload.email)}&gt;
      </p>
      <table style="border-collapse:collapse;margin:0 0 16px 0">
        <tr><td style="padding:4px 12px 4px 0;color:#64748b">Company</td><td>${escapeHtml(payload.companyName)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#64748b">Team size</td><td>${escapeHtml(payload.teamSize)}</td></tr>
      </table>
      <div style="border-left:3px solid #10B981;padding:8px 12px;background:#F0FDF4">
        ${nl2br(payload.message)}
      </div>
    </div>
  `.trim();
  return { subject, text, html, replyTo: payload.email };
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — if a bot fills the hidden field, return a success-shaped 200
  // so they don't learn the field is a trap. Don't send the email.
  if (typeof body.company_website === "string" && body.company_website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(request);
  const limit = rateLimit("contact", ip, 5, 10 * 60 * 1000); // 5 / 10 min / IP
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const type = body.type;
  let validated;
  if (type === "general") {
    validated = validateGeneral(body as Partial<GeneralPayload>);
  } else if (type === "enterprise") {
    validated = validateEnterprise(body as Partial<EnterprisePayload>);
  } else {
    return NextResponse.json(
      { error: "Unknown form type" },
      { status: 400 },
    );
  }

  if (validated.errors) {
    return NextResponse.json(
      { error: "Validation failed", fields: validated.errors },
      { status: 400 },
    );
  }

  const payload = validated.data!;
  const to = process.env.CONTACT_TO_EMAIL || contactEmail;
  const from =
    process.env.CONTACT_FROM_EMAIL || `AICraft Learning <${contactEmail}>`;

  const email = buildEmail(payload);

  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    if (error) {
      console.error("[contact] Resend error", { error, type, ip });
      return NextResponse.json(
        { error: "Could not send message. Please try again." },
        { status: 502 },
      );
    }

    console.log(
      JSON.stringify({
        scope: "contact",
        msg: "delivered",
        type,
        ip,
        ts: new Date().toISOString(),
      }),
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[contact] send failed", { message, type, ip });
    return NextResponse.json(
      { error: "Could not send message. Please try again." },
      { status: 500 },
    );
  }
}

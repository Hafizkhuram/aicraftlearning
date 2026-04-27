import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  email?: unknown;
  website?: unknown; // honeypot
};

function isAlreadySubscribedError(err: { message?: string; name?: string } | null): boolean {
  if (!err) return false;
  const msg = (err.message ?? "").toLowerCase();
  return (
    msg.includes("already") ||
    msg.includes("exists") ||
    msg.includes("duplicate")
  );
}

export async function POST(request: Request) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — return a success-shaped 200 so bots don't learn the field is a trap.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "invalid_email" },
      { status: 400 },
    );
  }

  const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;
  if (!audienceId) {
    console.warn("[newsletter] RESEND_NEWSLETTER_AUDIENCE_ID not set");
    return NextResponse.json(
      { error: "newsletter_unavailable" },
      { status: 503 },
    );
  }

  try {
    const resend = getResend();
    const { data, error } = await resend.contacts.create({
      audienceId,
      email,
      unsubscribed: false,
    });

    if (error) {
      if (isAlreadySubscribedError(error)) {
        return NextResponse.json({ ok: true, alreadySubscribed: true });
      }
      // Surface Resend's error.name (e.g. "validation_error", "not_found") and
      // message verbatim so an audience/segment ID rejection is debuggable from
      // the deploy logs. The audienceId is logged in full — it's just an
      // identifier, not a secret.
      console.error(
        JSON.stringify({
          scope: "newsletter",
          msg: "resend_rejected",
          audienceId,
          errorName: error.name ?? null,
          errorMessage: error.message ?? null,
          errorRaw: error,
          ts: new Date().toISOString(),
        }),
      );
      return NextResponse.json(
        { error: "newsletter_unavailable" },
        { status: 503 },
      );
    }

    console.log(
      JSON.stringify({
        scope: "newsletter",
        msg: "subscribed",
        contactId: data?.id ?? null,
        ts: new Date().toISOString(),
      }),
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Defensive: any thrown error (network failure, malformed response,
    // unexpected SDK state) returns a clean 503. We log enough context to
    // distinguish "audience ID rejected" from a real outage.
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorName = err instanceof Error ? err.name : "UnknownError";
    const errorStack = err instanceof Error ? err.stack : undefined;
    console.error(
      JSON.stringify({
        scope: "newsletter",
        msg: "subscribe_threw",
        audienceId,
        errorName,
        errorMessage,
        errorStack,
        ts: new Date().toISOString(),
      }),
    );
    return NextResponse.json(
      { error: "newsletter_unavailable" },
      { status: 503 },
    );
  }
}

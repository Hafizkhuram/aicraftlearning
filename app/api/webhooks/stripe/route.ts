import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getPrisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function log(
  level: "info" | "warn" | "error",
  message: string,
  fields: Record<string, unknown> = {},
) {
  const entry = {
    level,
    scope: "stripe.webhook",
    message,
    ...fields,
    ts: new Date().toISOString(),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    log("warn", "Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  if (!webhookSecret) {
    log("error", "STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Invalid Stripe signature";
    log("warn", "Signature verification failed", { error: message });
    return NextResponse.json({ error: message }, { status: 400 });
  }

  log("info", "Event received", { eventId: event.id, eventType: event.type });

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  const courseSlug = session.metadata?.courseSlug;

  if (!userId || !courseSlug) {
    log("warn", "Session missing required metadata", {
      eventId: event.id,
      sessionId: session.id,
      hasUserId: Boolean(userId),
      hasCourseSlug: Boolean(courseSlug),
    });
    return NextResponse.json({ received: true, skipped: "missing_metadata" });
  }

  try {
    const prisma = getPrisma();
    const existing = await prisma.enrolment.findUnique({
      where: { userId_courseSlug: { userId, courseSlug } },
    });

    const enrolment = existing
      ? existing
      : await prisma.enrolment.upsert({
          where: { userId_courseSlug: { userId, courseSlug } },
          update: {},
          create: {
            userId,
            courseSlug,
            stripeSessionId: session.id,
          },
        });

    log("info", existing ? "Enrolment already existed" : "Enrolment created", {
      eventId: event.id,
      sessionId: session.id,
      enrolmentId: enrolment.id,
      userId,
      courseSlug,
    });

    return NextResponse.json({ received: true, enrolmentId: enrolment.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    log("error", "Failed to record enrolment", {
      eventId: event.id,
      sessionId: session.id,
      userId,
      courseSlug,
      error: message,
    });
    return NextResponse.json(
      { error: "enrolment_failed", message },
      { status: 500 },
    );
  }
}

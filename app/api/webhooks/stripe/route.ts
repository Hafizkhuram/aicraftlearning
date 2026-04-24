import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getPrisma } from "@/lib/db";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 400 },
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
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const courseSlug = session.metadata?.courseSlug;

    if (!userId || !courseSlug) {
      return NextResponse.json(
        { error: "Missing metadata on session" },
        { status: 400 },
      );
    }

    const prisma = getPrisma();
    const existing = await prisma.enrolment.findUnique({
      where: { userId_courseSlug: { userId, courseSlug } },
    });

    if (!existing) {
      await prisma.enrolment.create({
        data: {
          userId,
          courseSlug,
          stripeSessionId: session.id,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}

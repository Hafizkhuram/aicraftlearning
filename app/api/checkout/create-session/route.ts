import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { getOrCreateUser } from "@/lib/auth";
import { getCourseManifest } from "@/lib/courses";
import { getPrisma } from "@/lib/db";
import { siteUrl } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { courseSlug?: string } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const courseSlug = body.courseSlug?.trim();
    if (!courseSlug) {
      return NextResponse.json(
        { error: "courseSlug is required" },
        { status: 400 },
      );
    }

    const manifest = await getCourseManifest(courseSlug);
    if (!manifest) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const user = await getOrCreateUser();

    const prisma = getPrisma();
    const existing = await prisma.enrolment.findUnique({
      where: { userId_courseSlug: { userId: user.id, courseSlug } },
    });
    if (existing) {
      return NextResponse.json(
        { alreadyEnrolled: true, redirectTo: `/learn/${courseSlug}` },
        { status: 200 },
      );
    }

    const clerkUser = await currentUser();
    const email =
      clerkUser?.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress ?? user.email;

    const origin =
      request.headers.get("origin") ??
      (process.env.NODE_ENV === "production" ? siteUrl : "http://localhost:3000");

    if (!manifest.stripePriceId || manifest.stripePriceId.startsWith("price_PLACEHOLDER")) {
      return NextResponse.json(
        { error: "Course is not yet available for purchase" },
        { status: 503 },
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      client_reference_id: user.id,
      line_items: [
        {
          price: manifest.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        clerkId: userId,
        courseSlug,
      },
      success_url: `${origin}/learn/${courseSlug}?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/courses/${courseSlug}`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a session URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[create-session]", err);
    return NextResponse.json(
      {
        error: "checkout_failed",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

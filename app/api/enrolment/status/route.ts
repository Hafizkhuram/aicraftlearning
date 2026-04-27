import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("courseSlug");
  if (!courseSlug) {
    return NextResponse.json(
      { error: "courseSlug query param required" },
      { status: 400 },
    );
  }

  const user = await getOrCreateUser();
  const prisma = getPrisma();
  const enrolment = await prisma.enrolment.findUnique({
    where: { userId_courseSlug: { userId: user.id, courseSlug } },
    select: { id: true },
  });

  return NextResponse.json({
    courseSlug,
    enrolled: Boolean(enrolment),
  });
}

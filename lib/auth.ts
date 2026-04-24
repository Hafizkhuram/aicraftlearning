import { auth, currentUser } from "@clerk/nextjs/server";
import type { User as PrismaUser } from "@prisma/client";
import { getPrisma } from "./db";

export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export async function getOrCreateUser(): Promise<PrismaUser> {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Not authenticated");

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) throw new Error("User has no email on file");

  const prisma = getPrisma();
  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: { email: primaryEmail },
    create: { clerkId: clerkUser.id, email: primaryEmail },
  });
}

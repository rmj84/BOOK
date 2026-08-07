"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFollow(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const followerId = session.user.id;

  if (followerId === targetUserId) return;

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUserId,
        },
      },
    });
  } else {
    await prisma.follow.create({
      data: { followerId, followingId: targetUserId },
    });
  }

  revalidatePath(`/u/${targetUserId}`);
  revalidatePath("/feed");
}

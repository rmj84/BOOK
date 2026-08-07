"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleLike(reviewId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const existing = await prisma.like.findUnique({
    where: { userId_reviewId: { userId, reviewId } },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_reviewId: { userId, reviewId } },
    });
  } else {
    await prisma.like.create({ data: { userId, reviewId } });
  }

  revalidatePath(`/reviews/${reviewId}`);
  revalidatePath("/feed");
}

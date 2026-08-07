"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function addComment(reviewId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const content = String(formData.get("content") ?? "").trim();
  if (!content) throw new Error("댓글 내용을 입력해주세요.");

  await prisma.comment.create({
    data: { userId, reviewId, content },
  });

  revalidatePath(`/reviews/${reviewId}`);
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const existing = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!existing || existing.userId !== userId) {
    throw new Error("삭제 권한이 없습니다.");
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/reviews/${existing.reviewId}`);
}

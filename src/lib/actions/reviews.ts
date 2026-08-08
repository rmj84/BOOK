"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

function isValidRating(rating: number) {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating * 2);
}

type BookInput = {
  externalId: string | null;
  title: string;
  author: string | null;
  publisher: string | null;
  coverUrl: string | null;
  description: string | null;
  category: string | null;
};

async function resolveBook(book: BookInput) {
  if (book.externalId) {
    return prisma.book.upsert({
      where: { externalId: book.externalId },
      update: {},
      create: { ...book, externalId: book.externalId },
    });
  }
  return prisma.book.create({
    data: { ...book, externalId: null },
  });
}

export async function createReview(formData: FormData) {
  const userId = await requireUserId();

  const book: BookInput = {
    externalId: (formData.get("externalId") as string) || null,
    title: String(formData.get("title") ?? "").trim(),
    author: (formData.get("author") as string) || null,
    publisher: (formData.get("publisher") as string) || null,
    coverUrl: (formData.get("coverUrl") as string) || null,
    description: (formData.get("description") as string) || null,
    category: (formData.get("category") as string) || null,
  };

  if (!book.title) throw new Error("책 제목은 필수입니다.");

  const rating = Number(formData.get("rating") ?? 0);
  const content = String(formData.get("content") ?? "").trim();
  const isPublic = formData.get("isPublic") === "on";

  if (!isValidRating(rating))
    throw new Error("별점은 1~5 사이, 0.5점 단위여야 합니다.");
  if (!content) throw new Error("후기 내용을 입력해주세요.");

  const savedBook = await resolveBook(book);

  const review = await prisma.review.create({
    data: {
      userId,
      bookId: savedBook.id,
      rating,
      content,
      isPublic,
    },
  });

  revalidatePath("/");
  revalidatePath("/shelf");
  revalidatePath(`/u/${userId}`);
  redirect(`/reviews/${review.id}`);
}

export async function updateReview(reviewId: string, formData: FormData) {
  const userId = await requireUserId();

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing || existing.userId !== userId) {
    throw new Error("수정 권한이 없습니다.");
  }

  const rating = Number(formData.get("rating") ?? 0);
  const content = String(formData.get("content") ?? "").trim();
  const isPublic = formData.get("isPublic") === "on";

  if (!isValidRating(rating))
    throw new Error("별점은 1~5 사이, 0.5점 단위여야 합니다.");
  if (!content) throw new Error("후기 내용을 입력해주세요.");

  await prisma.review.update({
    where: { id: reviewId },
    data: { rating, content, isPublic },
  });

  revalidatePath(`/reviews/${reviewId}`);
  revalidatePath("/");
  revalidatePath("/shelf");
  redirect(`/reviews/${reviewId}`);
}

export async function deleteReview(reviewId: string) {
  const userId = await requireUserId();

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing || existing.userId !== userId) {
    throw new Error("삭제 권한이 없습니다.");
  }

  await prisma.review.delete({ where: { id: reviewId } });

  revalidatePath("/");
  revalidatePath("/shelf");
  revalidatePath(`/u/${userId}`);
  redirect(`/u/${userId}`);
}

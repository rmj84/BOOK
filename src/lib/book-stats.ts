import type { Book } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type BookWithStats = Book & { reviewCount: number; avgRating: number };

async function computeBookStats(): Promise<BookWithStats[]> {
  const reviews = await prisma.review.findMany({
    where: { isPublic: true },
    select: { bookId: true, rating: true, book: true },
  });

  const byBook = new Map<string, { book: Book; count: number; sum: number }>();
  for (const r of reviews) {
    const entry = byBook.get(r.bookId);
    if (entry) {
      entry.count += 1;
      entry.sum += r.rating;
    } else {
      byBook.set(r.bookId, { book: r.book, count: 1, sum: r.rating });
    }
  }

  return Array.from(byBook.values()).map(({ book, count, sum }) => ({
    ...book,
    reviewCount: count,
    avgRating: sum / count,
  }));
}

// 후기가 많은 순(트렌딩), 평점이 높은 순(추천)을 단일 쿼리로 함께 계산한다.
export async function getBookShelves(limit = 8) {
  const stats = await computeBookStats();

  const trending = [...stats]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);

  const recommended = [...stats]
    .sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
    .slice(0, limit);

  return { trending, recommended };
}

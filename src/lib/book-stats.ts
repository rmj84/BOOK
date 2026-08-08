import type { Book } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type BookWithStats = Book & { reviewCount: number; avgRating: number };

function splitGenres(category: string | null): string[] {
  if (!category) return [];
  return category
    .split(">")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getBookShelves(userId?: string, limit = 8) {
  const [reviews, myReviews] = await Promise.all([
    prisma.review.findMany({
      where: { isPublic: true },
      select: { bookId: true, rating: true, book: true },
    }),
    userId
      ? prisma.review.findMany({
          where: { userId },
          select: {
            bookId: true,
            rating: true,
            book: { select: { category: true } },
          },
        })
      : Promise.resolve([]),
  ]);

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

  const stats: BookWithStats[] = Array.from(byBook.values()).map(
    ({ book, count, sum }) => ({
      ...book,
      reviewCount: count,
      avgRating: sum / count,
    })
  );

  const trending = [...stats]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);

  const recommended = [...stats]
    .sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
    .slice(0, limit);

  // 내가 4점 이상 준 책들의 장르 빈도로 취향 프로필을 만들고,
  // 아직 안 읽은 책 중 같은 장르가 겹치는 책을 우선순위로 추천한다.
  let personalized: (BookWithStats & { matchCount: number })[] = [];
  if (userId && myReviews.length > 0) {
    const reviewedBookIds = new Set(myReviews.map((r) => r.bookId));
    const genreCounts = new Map<string, number>();
    for (const r of myReviews) {
      if (r.rating < 4) continue;
      for (const genre of splitGenres(r.book.category)) {
        genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
      }
    }
    const topGenres = [...genreCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre);

    if (topGenres.length > 0) {
      personalized = stats
        .filter((book) => !reviewedBookIds.has(book.id))
        .map((book) => ({
          ...book,
          matchCount: splitGenres(book.category).filter((g) =>
            topGenres.includes(g)
          ).length,
        }))
        .filter((book) => book.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount || b.avgRating - a.avgRating)
        .slice(0, limit);
    }
  }

  return { trending, recommended, personalized };
}

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

export async function getLandingStats() {
  const [reviewAgg, readerCount] = await Promise.all([
    prisma.review.aggregate({
      where: { isPublic: true },
      _count: { _all: true },
      _avg: { rating: true },
    }),
    prisma.user.count({ where: { reviews: { some: { isPublic: true } } } }),
  ]);

  return {
    reviewCount: reviewAgg._count._all,
    avgRating: reviewAgg._avg.rating ?? 0,
    readerCount,
  };
}

export type FeaturedShelf = {
  user: { id: string; name: string | null; image: string | null };
  reviewCount: number;
  books: { id: string; title: string; coverUrl: string | null }[];
};

// 로그인 전 방문자에게 "모두의 책장"을 미리 보여주기 위한 요약. 후기를 가장
// 많이 남긴 사람 순으로 몇 명만 뽑고, 각자 최근 후기 남긴 책 몇 권만 담는다.
export async function getFeaturedShelves(
  limit = 3,
  booksPerShelf = 6
): Promise<FeaturedShelf[]> {
  const reviews = await prisma.review.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    select: {
      book: { select: { id: true, title: true, coverUrl: true } },
      user: { select: { id: true, name: true, image: true } },
    },
  });

  const byUser = new Map<string, FeaturedShelf>();
  for (const r of reviews) {
    const entry = byUser.get(r.user.id);
    if (entry) {
      entry.reviewCount += 1;
      if (entry.books.length < booksPerShelf) entry.books.push(r.book);
    } else {
      byUser.set(r.user.id, { user: r.user, reviewCount: 1, books: [r.book] });
    }
  }

  return Array.from(byUser.values())
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

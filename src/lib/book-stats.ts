import type { Book } from "@prisma/client";
import { prisma } from "@/lib/prisma";

async function attachBooks<T extends { bookId: string }>(grouped: T[]) {
  const books = await prisma.book.findMany({
    where: { id: { in: grouped.map((g) => g.bookId) } },
  });
  const byId = new Map(books.map((b) => [b.id, b]));

  return grouped
    .map((g) => ({ ...g, book: byId.get(g.bookId) }))
    .filter(
      (g): g is T & { book: Book } => g.book !== undefined
    );
}

export async function getTrendingBooks(limit = 8) {
  const grouped = await prisma.review.groupBy({
    by: ["bookId"],
    where: { isPublic: true },
    _count: { bookId: true },
    orderBy: { _count: { bookId: "desc" } },
    take: limit,
  });
  if (grouped.length === 0) return [];

  const withBooks = await attachBooks(grouped);
  return withBooks.map((g) => ({
    ...g.book,
    reviewCount: g._count.bookId,
  }));
}

export async function getRecommendedBooks(limit = 8) {
  const grouped = await prisma.review.groupBy({
    by: ["bookId"],
    where: { isPublic: true },
    _avg: { rating: true },
    _count: { bookId: true },
    orderBy: [{ _avg: { rating: "desc" } }, { _count: { bookId: "desc" } }],
    take: limit,
  });
  if (grouped.length === 0) return [];

  const withBooks = await attachBooks(grouped);
  return withBooks.map((g) => ({
    ...g.book,
    avgRating: g._avg.rating ?? 0,
    reviewCount: g._count.bookId,
  }));
}

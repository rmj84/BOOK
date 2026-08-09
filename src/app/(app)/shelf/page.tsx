import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ShelfGrid, { type ShelfPerson } from "@/components/shelf-grid";

type RawReview = {
  id: string;
  rating: number;
  book: { id: string; title: string; coverUrl: string | null };
  user: { id: string; name: string | null; image: string | null };
};

function groupByUser(reviews: RawReview[], booksPerShelf = 8): ShelfPerson[] {
  const byUser = new Map<
    string,
    { user: RawReview["user"]; reviewCount: number; bookIds: Set<string>; books: ShelfPerson["books"] }
  >();

  for (const r of reviews) {
    let entry = byUser.get(r.user.id);
    if (!entry) {
      entry = { user: r.user, reviewCount: 0, bookIds: new Set(), books: [] };
      byUser.set(r.user.id, entry);
    }
    entry.reviewCount += 1;
    if (!entry.bookIds.has(r.book.id)) {
      entry.bookIds.add(r.book.id);
      if (entry.books.length < booksPerShelf) entry.books.push(r.book);
    }
  }

  return Array.from(byUser.values())
    .map(({ user, reviewCount, bookIds, books }) => ({
      user,
      reviewCount,
      bookCount: bookIds.size,
      books,
    }))
    .sort((a, b) => b.reviewCount - a.reviewCount);
}

export default async function ShelfPage() {
  const session = await auth();
  const viewerId = session?.user?.id ?? null;

  const select = {
    id: true,
    rating: true,
    book: { select: { id: true, title: true, coverUrl: true } },
    user: { select: { id: true, name: true, image: true } },
  } as const;

  const [publicReviews, myReviews, follows] = await Promise.all([
    prisma.review.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      select,
    }),
    viewerId
      ? prisma.review.findMany({
          where: { userId: viewerId },
          orderBy: { createdAt: "desc" },
          select,
        })
      : Promise.resolve([]),
    viewerId
      ? prisma.follow.findMany({ where: { followerId: viewerId }, select: { followingId: true } })
      : Promise.resolve([]),
  ]);

  return (
    <ShelfGrid
      allShelves={groupByUser(publicReviews)}
      myShelf={groupByUser(myReviews)}
      followingIds={follows.map((f) => f.followingId)}
      viewerId={viewerId}
    />
  );
}

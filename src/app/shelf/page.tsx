import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ShelfGrid from "@/components/shelf-grid";
import BookShelf from "@/components/book-shelf";
import { getBookShelves } from "@/lib/book-stats";

export default async function ShelfPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [
    follows,
    { trending: trendingBooks, recommended: recommendedBooks, personalized },
  ] = await Promise.all([
    userId
      ? prisma.follow.findMany({
          where: { followerId: userId },
          select: { followingId: true },
        })
      : Promise.resolve([]),
    getBookShelves(userId),
  ]);
  const followingIds = follows.map((f) => f.followingId);

  const isFollowingShelf = userId != null && followingIds.length > 0;

  const reviews = await prisma.review.findMany({
    where: isFollowingShelf
      ? {
          OR: [
            { userId, isPublic: true },
            { userId: { in: followingIds }, isPublic: true },
            { userId },
          ],
        }
      : { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 60,
    select: {
      id: true,
      rating: true,
      book: { select: { title: true, coverUrl: true } },
      user: { select: { id: true, name: true } },
    },
  });

  return (
    <div className="flex flex-col gap-8">
      {personalized.length > 0 && (
        <BookShelf title="🎯 취향 저격 추천" books={personalized} />
      )}
      <BookShelf title="🔥 최근 인기 도서" books={trendingBooks} />
      <BookShelf title="⭐ 평점 높은 추천 도서" books={recommendedBooks} />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {isFollowingShelf ? "내 책장" : "모두의 책장"}
          </h1>
          <Link href="/reviews/new" className="text-sm text-neutral-500">
            + 후기 쓰기
          </Link>
        </div>

        {!userId && (
          <p className="text-sm text-neutral-500">
            로그인하면 팔로우한 사람들의 책장만 모아볼 수 있어요.
          </p>
        )}

        <ShelfGrid reviews={reviews} />
      </div>
    </div>
  );
}

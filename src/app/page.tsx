import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewCard from "@/components/review-card";
import BookShelf from "@/components/book-shelf";
import { getBookShelves, getFeaturedShelves, getLandingStats } from "@/lib/book-stats";
import { AnonymousLanding } from "@/components/booklog-landing/AnonymousLanding";
import AppShell from "@/components/app-shell";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    const [{ trending, recommended }, stats, shelves] = await Promise.all([
      getBookShelves(),
      getLandingStats(),
      getFeaturedShelves(),
    ]);

    const top = [...recommended].sort((a, b) => b.avgRating - a.avgRating)[0] ?? null;

    return (
      <AnonymousLanding
        topBook={top ? { title: top.title, author: top.author, rating: top.avgRating } : null}
        stats={stats}
        recommended={recommended}
        trending={trending}
        shelves={shelves}
      />
    );
  }

  const [follows, { trending, recommended, personalized }] = await Promise.all(
    [
      prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      }),
      getBookShelves(userId),
    ]
  );
  const followingIds = follows.map((f) => f.followingId);
  const isFollowingFeed = followingIds.length > 0;

  const list = await prisma.review.findMany({
    where: isFollowingFeed
      ? {
          OR: [
            { userId, isPublic: true },
            { userId: { in: followingIds }, isPublic: true },
            { userId },
          ],
        }
      : { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      book: true,
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return (
    <AppShell user={session.user ?? null}>
      <div className="flex flex-col gap-8">
        {personalized.length > 0 && (
          <BookShelf title="🎯 취향 저격 추천" books={personalized} />
        )}
        <BookShelf title="🔥 최근 인기 도서" books={trending} />
        <BookShelf title="⭐ 평점 높은 추천 도서" books={recommended} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {isFollowingFeed ? "팔로우 피드" : "최근 후기"}
            </h1>
            <Link href="/reviews/new" className="text-sm text-ink/55">
              + 후기 쓰기
            </Link>
          </div>

          {list.length === 0 && (
            <p className="text-ink/55 text-sm py-10 text-center">
              아직 후기가 없어요.
            </p>
          )}

          {list.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              rating={review.rating}
              content={review.content}
              createdAt={review.createdAt}
              book={review.book}
              user={review.user}
              likeCount={review._count.likes}
              commentCount={review._count.comments}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

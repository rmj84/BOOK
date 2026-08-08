import Link from "next/link";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewCard from "@/components/review-card";
import BookShelf from "@/components/book-shelf";
import { getBookShelves } from "@/lib/book-stats";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <h1 className="text-3xl font-bold">읽은 책, 기록하고 공유하세요</h1>
        <p className="text-neutral-500 max-w-md">
          내가 읽은 책에 별점과 후기를 남기고, 친구들의 독서 기록도 팔로우해서
          받아보세요.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="rounded bg-neutral-900 text-white px-5 py-2.5 font-medium"
          >
            Google로 시작하기
          </button>
        </form>
      </div>
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
          <Link href="/reviews/new" className="text-sm text-neutral-500">
            + 후기 쓰기
          </Link>
        </div>

        {list.length === 0 && (
          <p className="text-neutral-500 text-sm py-10 text-center">
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
  );
}

import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewCard from "@/components/review-card";

export default async function FeedPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let followingIds: string[] = [];
  if (userId) {
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    followingIds = follows.map((f) => f.followingId);
  }

  const isFollowingFeed = userId != null && followingIds.length > 0;

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
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {isFollowingFeed ? "팔로우 피드" : "최근 후기"}
        </h1>
        <Link href="/reviews/new" className="text-sm text-neutral-500">
          + 후기 쓰기
        </Link>
      </div>

      {!userId && (
        <p className="text-sm text-neutral-500">
          로그인하면 팔로우한 사람들의 후기만 모아볼 수 있어요.
        </p>
      )}

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
        />
      ))}
    </div>
  );
}

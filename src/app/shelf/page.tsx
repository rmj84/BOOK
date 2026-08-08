import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ShelfGrid from "@/components/shelf-grid";

export default async function ShelfPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const follows = userId
    ? await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      })
    : [];
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {isFollowingShelf ? "내 책장" : "모두의 책장"}
        </h1>
        <Link href="/reviews/new" className="text-sm text-ink/55">
          + 후기 쓰기
        </Link>
      </div>

      {!userId && (
        <p className="text-sm text-ink/55">
          로그인하면 팔로우한 사람들의 책장만 모아볼 수 있어요.
        </p>
      )}

      <ShelfGrid reviews={reviews} />
    </div>
  );
}

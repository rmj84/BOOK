import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewCard from "@/components/review-card";
import { toggleFollow } from "@/lib/actions/follow";

type Params = { params: Promise<{ id: string }> };

export default async function ProfilePage({ params }: Params) {
  const { id } = await params;
  const profileUser = await prisma.user.findUnique({ where: { id } });
  if (!profileUser) notFound();

  const session = await auth();
  const viewerId = session?.user?.id;
  const isOwner = viewerId === id;

  const [reviews, followerCount, followingCount, isFollowing] =
    await Promise.all([
      prisma.review.findMany({
        where: isOwner ? { userId: id } : { userId: id, isPublic: true },
        orderBy: { createdAt: "desc" },
        include: {
          book: true,
          user: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.follow.count({ where: { followingId: id } }),
      prisma.follow.count({ where: { followerId: id } }),
      viewerId
        ? prisma.follow.findUnique({
            where: {
              followerId_followingId: { followerId: viewerId, followingId: id },
            },
          })
        : null,
    ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        {profileUser.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profileUser.image}
            alt={profileUser.name ?? ""}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-neutral-200" />
        )}
        <div className="flex-1">
          <h1 className="text-xl font-semibold">
            {profileUser.name ?? "익명"}
          </h1>
          <p className="text-sm text-neutral-500">
            팔로워 {followerCount} · 팔로잉 {followingCount}
          </p>
        </div>
        {!isOwner && viewerId && (
          <form action={toggleFollow.bind(null, id)}>
            <button
              type="submit"
              className={
                isFollowing
                  ? "rounded border border-neutral-300 px-3 py-1.5 text-sm"
                  : "rounded bg-neutral-900 text-white px-3 py-1.5 text-sm"
              }
            >
              {isFollowing ? "팔로잉" : "팔로우"}
            </button>
          </form>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {reviews.length === 0 && (
          <p className="text-neutral-500 text-sm py-10 text-center">
            아직 작성한 후기가 없어요.
          </p>
        )}
        {reviews.map((review) => (
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
    </div>
  );
}

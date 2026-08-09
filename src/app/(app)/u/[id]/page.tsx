import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewCard from "@/components/review-card";
import { toggleFollow } from "@/lib/actions/follow";
import SubmitButton from "@/components/submit-button";
import {
  FONT_SERIF,
  PAPER,
  coverPattern,
  monoLabel,
  pillButtonStyle,
} from "@/components/booklog-landing/theme";

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
          _count: { select: { likes: true, comments: true } },
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
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, paddingBottom: 26, marginBottom: 26, borderBottom: `1px solid ${PAPER.hair}` }}>
        {profileUser.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profileUser.image}
            alt={profileUser.name ?? ""}
            style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `1px solid ${PAPER.rule}`, flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: coverPattern(7), border: `1px solid ${PAPER.rule}`, flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontFamily: FONT_SERIF, fontSize: 24, fontWeight: 700, margin: 0, color: PAPER.rule }}>
            {profileUser.name ?? "익명"}
          </h1>
          <p style={{ ...monoLabel, marginTop: 6 }}>
            팔로워 {followerCount} · 팔로잉 {followingCount}
          </p>
        </div>
        {!isOwner && viewerId && (
          <form action={toggleFollow.bind(null, id)}>
            <SubmitButton pendingText="처리 중..." style={pillButtonStyle(!!isFollowing)}>
              {isFollowing ? "팔로잉" : "팔로우"}
            </SubmitButton>
          </form>
        )}
      </div>

      <div>
        {reviews.length === 0 && (
          <p style={{ ...monoLabel, padding: "40px 0", textAlign: "center" }}>아직 작성한 후기가 없어요.</p>
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
            likeCount={review._count.likes}
            commentCount={review._count.comments}
          />
        ))}
      </div>
    </div>
  );
}

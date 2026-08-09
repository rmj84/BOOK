import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ShelfGrid from "@/components/shelf-grid";
import { FONT_SERIF, PAPER, RULE_WEIGHT, ctaButtonStyle, monoLabel } from "@/components/booklog-landing/theme";

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
    <div>
      <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}` }}>
        <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
          Shelves
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: FONT_SERIF, fontSize: 30, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
            {isFollowingShelf ? "내 책장" : "모두의 책장"}
          </h1>
          <Link href="/reviews/new" style={ctaButtonStyle}>
            + 후기 쓰기
          </Link>
        </div>
        {!userId && (
          <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13.5, color: "#57534A", margin: "12px 0 0" }}>
            로그인하면 팔로우한 사람들의 책장만 모아볼 수 있어요.
          </p>
        )}
      </div>

      <ShelfGrid reviews={reviews} />
    </div>
  );
}

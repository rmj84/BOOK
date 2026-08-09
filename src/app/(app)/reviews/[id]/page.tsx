import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LeafScore from "@/components/leaf-score";
import { deleteReview } from "@/lib/actions/reviews";
import { toggleLike } from "@/lib/actions/likes";
import { addComment, deleteComment } from "@/lib/actions/comments";
import SubmitButton from "@/components/submit-button";
import BuyButton from "@/components/buy-button";
import {
  FONT_SERIF,
  PAPER,
  coverPattern,
  monoLabel,
  pillButtonStyle,
} from "@/components/booklog-landing/theme";

type Params = { params: Promise<{ id: string }> };

const inputStyle = {
  border: `1px solid ${PAPER.rule}`,
  background: PAPER.sheet,
  padding: "9px 12px",
  fontFamily: "'IBM Plex Sans KR',sans-serif",
  fontSize: 13.5,
  color: PAPER.rule,
  outline: "none",
  boxSizing: "border-box" as const,
};

const dangerPillStyle = {
  background: "transparent",
  color: "#8C3B2E",
  border: "1px solid #8C3B2E",
  padding: "8px 16px",
  fontFamily: "'IBM Plex Sans KR',sans-serif",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
};

async function getReview(id: string) {
  return prisma.review.findUnique({
    where: { id },
    include: {
      book: true,
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) return {};

  const title = `${review.book.title} - ${review.user.name ?? "익명"}의 후기`;
  const description = review.content.slice(0, 100);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: review.book.coverUrl ? [review.book.coverUrl] : [],
    },
  };
}

export default async function ReviewDetailPage({ params }: Params) {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) notFound();

  const session = await auth();
  const viewerId = session?.user?.id;
  const isOwner = viewerId === review.userId;

  if (!review.isPublic && !isOwner) notFound();

  const [isLiked, comments] = await Promise.all([
    viewerId
      ? prisma.like
          .findUnique({
            where: { userId_reviewId: { userId: viewerId, reviewId: id } },
          })
          .then(Boolean)
      : Promise.resolve(false),
    prisma.comment.findMany({
      where: { reviewId: id },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { id: true, name: true, image: true } } },
    }),
  ]);

  return (
    <article>
      <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>Review</div>

      <div style={{ display: "flex", gap: 18, paddingBottom: 24, marginBottom: 24, borderBottom: `1px solid ${PAPER.hair}` }}>
        {review.book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.book.coverUrl}
            alt={review.book.title}
            style={{ width: 88, height: 128, objectFit: "cover", border: `1px solid ${PAPER.rule}`, flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: 88, height: 128, background: coverPattern(9), border: `1px solid ${PAPER.rule}`, flexShrink: 0 }} />
        )}
        <div style={{ minWidth: 0 }}>
          <Link href={`/books/${review.book.id}`}>
            <h1 style={{ fontFamily: FONT_SERIF, fontSize: 24, fontWeight: 700, margin: 0, color: PAPER.rule, wordBreak: "keep-all" }}>
              {review.book.title}
            </h1>
          </Link>
          <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13, color: "#57534A", margin: "4px 0 10px" }}>
            {review.book.author}
          </p>
          <LeafScore score={review.rating} className="text-sm" />
          <div style={{ marginTop: 10 }}>
            <BuyButton url={review.book.purchaseUrl} />
          </div>
        </div>
      </div>

      <p
        style={{
          fontFamily: "'IBM Plex Sans KR',sans-serif",
          fontSize: 15,
          lineHeight: 1.85,
          color: "#221F1B",
          margin: "0 0 24px",
          whiteSpace: "pre-wrap",
        }}
      >
        {review.content}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <Link href={`/u/${review.user.id}`} style={{ fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 700, color: PAPER.rule }}>
          {review.user.name ?? "익명"}
        </Link>
        <span style={monoLabel}>{review.createdAt.toLocaleDateString("ko-KR")}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 28, marginBottom: 28, borderBottom: `1px solid ${PAPER.hair}` }}>
        <form action={toggleLike.bind(null, review.id)}>
          <SubmitButton pendingText="처리 중..." style={pillButtonStyle(isLiked)}>
            {isLiked ? "♥" : "♡"} 좋아요 {review._count.likes}
          </SubmitButton>
        </form>

        {isOwner && (
          <>
            <Link href={`/reviews/${review.id}/edit`} style={pillButtonStyle(false)}>
              수정
            </Link>
            <form action={deleteReview.bind(null, review.id)}>
              <SubmitButton pendingText="삭제 중..." style={dangerPillStyle}>
                삭제
              </SubmitButton>
            </form>
          </>
        )}
      </div>

      <section>
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700, margin: "0 0 16px", color: PAPER.rule }}>
          댓글 {comments.length}개
        </h2>

        {viewerId && (
          <form action={addComment.bind(null, review.id)} style={{ display: "flex", gap: 8, marginBottom: 22 }}>
            <input name="content" required placeholder="댓글을 남겨보세요" style={{ ...inputStyle, flex: 1 }} />
            <SubmitButton pendingText="등록 중..." style={pillButtonStyle(true)}>
              등록
            </SubmitButton>
          </form>
        )}

        <ul style={{ display: "flex", flexDirection: "column", gap: 16, padding: 0, listStyle: "none" }}>
          {comments.map((comment) => (
            <li key={comment.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <Link href={`/u/${comment.user.id}`} style={{ fontFamily: FONT_SERIF, fontSize: 13.5, fontWeight: 700, color: PAPER.rule }}>
                  {comment.user.name ?? "익명"}
                </Link>
                <span style={monoLabel}>{comment.createdAt.toLocaleDateString("ko-KR")}</span>
                {viewerId === comment.userId && (
                  <form action={deleteComment.bind(null, comment.id)}>
                    <SubmitButton pendingText="삭제 중..." style={{ ...monoLabel, background: "none", border: "none", padding: 0, cursor: "pointer", color: "#8C3B2E" }}>
                      삭제
                    </SubmitButton>
                  </form>
                )}
              </div>
              <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13.5, lineHeight: 1.7, color: "#3A362F", margin: 0 }}>
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

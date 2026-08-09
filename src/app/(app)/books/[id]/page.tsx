import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewCard from "@/components/review-card";
import LeafScore from "@/components/leaf-score";
import GenreTags from "@/components/genre-tags";
import BuyButton from "@/components/buy-button";
import { FONT_SERIF, PAPER, coverPattern, monoLabel } from "@/components/booklog-landing/theme";

type Params = { params: Promise<{ id: string }> };

export default async function BookDetailPage({ params }: Params) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const reviews = await prisma.review.findMany({
    where: userId
      ? { bookId: id, OR: [{ isPublic: true }, { userId }] }
      : { bookId: id, isPublic: true },
    orderBy: { createdAt: "desc" },
    include: {
      book: true,
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div>
      <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>Book</div>

      <div style={{ display: "flex", gap: 20, paddingBottom: 22 }}>
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            style={{ width: 104, height: 150, objectFit: "cover", border: `1px solid ${PAPER.rule}`, flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: 104, height: 150, background: coverPattern(9), border: `1px solid ${PAPER.rule}`, flexShrink: 0 }} />
        )}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 700, margin: 0, color: PAPER.rule, wordBreak: "keep-all" }}>
            {book.title}
          </h1>
          <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13.5, color: "#57534A", margin: "6px 0 12px" }}>
            {book.author}
            {book.publisher ? ` · ${book.publisher}` : ""}
          </p>
          {reviews.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <LeafScore score={avgRating} className="text-sm" />
              <span style={monoLabel}>
                {avgRating.toFixed(1)} ({reviews.length}명)
              </span>
            </div>
          )}
          <GenreTags category={book.category} />
        </div>
      </div>

      <div style={{ paddingBottom: 22, marginBottom: 26, borderBottom: `1px solid ${PAPER.hair}` }}>
        <BuyButton url={book.purchaseUrl} />
      </div>

      {book.description && (
        <p
          style={{
            fontFamily: "'IBM Plex Sans KR',sans-serif",
            fontSize: 14,
            lineHeight: 1.8,
            color: "#3A362F",
            whiteSpace: "pre-wrap",
            margin: "0 0 30px",
          }}
        >
          {book.description}
        </p>
      )}

      <div>
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: PAPER.rule }}>
          후기 {reviews.length}개
        </h2>
        {reviews.length === 0 && (
          <p style={{ ...monoLabel, padding: "36px 0", textAlign: "center" }}>아직 이 책에 대한 후기가 없어요.</p>
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

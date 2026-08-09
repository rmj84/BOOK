import Link from "next/link";
import LeafScore from "@/components/leaf-score";
import { FONT_SERIF, PAPER, coverPattern, monoLabel } from "@/components/booklog-landing/theme";

type ShelfReview = {
  id: string;
  rating: number;
  book: { title: string; coverUrl: string | null };
  user: { id: string; name: string | null };
};

export default function ShelfGrid({ reviews }: { reviews: ShelfReview[] }) {
  if (reviews.length === 0) {
    return <p style={{ ...monoLabel, padding: "40px 0", textAlign: "center" }}>아직 꽂힌 책이 없어요.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        borderTop: `1px solid ${PAPER.hair}`,
        borderLeft: `1px solid ${PAPER.hair}`,
      }}
    >
      {reviews.map((review) => (
        <Link
          key={review.id}
          href={`/reviews/${review.id}`}
          title={`${review.book.title} · ${review.user.name ?? "익명"}`}
          style={{
            padding: "20px 18px",
            borderRight: `1px solid ${PAPER.hair}`,
            borderBottom: `1px solid ${PAPER.hair}`,
            display: "block",
            color: PAPER.rule,
          }}
        >
          {review.book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.book.coverUrl}
              alt={review.book.title}
              style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", border: `1px solid ${PAPER.rule}`, marginBottom: 12 }}
            />
          ) : (
            <div style={{ aspectRatio: "2/3", background: coverPattern(8), border: `1px solid ${PAPER.rule}`, marginBottom: 12 }} />
          )}
          <div style={{ marginBottom: 6 }}>
            <LeafScore score={review.rating} className="text-xs" />
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 700, lineHeight: 1.3, wordBreak: "keep-all" }}>
            {review.book.title}
          </div>
          <div style={{ ...monoLabel, marginTop: 4 }}>{review.user.name ?? "익명"}</div>
        </Link>
      ))}
    </div>
  );
}

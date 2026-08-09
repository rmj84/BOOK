import Link from "next/link";
import LeafScore from "@/components/leaf-score";
import { FONT_SERIF, PAPER, coverPattern, monoLabel } from "@/components/booklog-landing/theme";

type ReviewCardProps = {
  id: string;
  rating: number;
  content: string;
  createdAt: Date;
  book: {
    id: string;
    title: string;
    author: string | null;
    coverUrl: string | null;
  };
  user: { id: string; name: string | null; image: string | null };
  likeCount?: number;
  commentCount?: number;
};

export default function ReviewCard({
  id,
  rating,
  content,
  createdAt,
  book,
  user,
  likeCount = 0,
  commentCount = 0,
}: ReviewCardProps) {
  return (
    <article style={{ display: "flex", gap: 18, padding: "22px 0", borderBottom: `1px solid ${PAPER.hair}` }}>
      {book.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.coverUrl}
          alt={book.title}
          style={{ width: 60, height: 86, objectFit: "cover", border: `1px solid ${PAPER.rule}`, flexShrink: 0 }}
        />
      ) : (
        <div style={{ width: 60, height: 86, background: coverPattern(7), border: `1px solid ${PAPER.rule}`, flexShrink: 0 }} />
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <Link href={`/books/${book.id}`} style={{ fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 700, color: PAPER.rule }}>
          {book.title}
        </Link>
        {book.author && <span style={{ ...monoLabel, marginLeft: 8 }}>{book.author}</span>}
        <div style={{ margin: "6px 0 8px" }}>
          <LeafScore score={rating} className="text-xs" />
        </div>
        <p
          style={{
            fontFamily: "'IBM Plex Sans KR',sans-serif",
            fontSize: 13.5,
            lineHeight: 1.7,
            color: "#3A362F",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {content}
        </p>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Link href={`/u/${user.id}`} style={{ fontFamily: FONT_SERIF, fontSize: 13, fontWeight: 700, color: PAPER.rule }}>
            {user.name ?? "익명"}
          </Link>
          <span style={monoLabel}>{createdAt.toLocaleDateString("ko-KR")}</span>
          <Link href={`/reviews/${id}`} style={monoLabel}>
            ♥ {likeCount} · 댓글 {commentCount}
          </Link>
        </div>
      </div>
    </article>
  );
}

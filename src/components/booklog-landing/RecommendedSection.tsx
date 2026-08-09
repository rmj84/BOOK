import Link from "next/link";
import { LeafMeter } from "./LeafMeter";
import { cardBase, cardShadow, FONT_BODY, FONT_DISPLAY, FONT_HEAD, INK, PALETTE } from "./theme";

export type LandingBook = {
  id: string;
  title: string;
  author: string | null;
  coverUrl: string | null;
  avgRating: number;
};

export function RecommendedSection({ books }: { books: LandingBook[] }) {
  if (books.length === 0) return null;

  return (
    <div style={{ padding: "72px 0 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <div>
          <h2 style={{ fontFamily: FONT_HEAD, fontSize: 28, color: INK, margin: 0, letterSpacing: "-0.01em" }}>
            🍃 취향 저격 추천
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#6E7D64", margin: "6px 0 0" }}>
            평소 좋아한 장르를 바탕으로 골라봤어요
          </p>
        </div>
        <Link
          href="/shelf"
          style={{ fontFamily: FONT_BODY, fontSize: 13, color: "#3E9B6B", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          더보기 →
        </Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
        {books.slice(0, 4).map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            style={{ ...cardBase, borderRadius: 22, padding: 14, ...cardShadow, display: "block" }}
          >
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverUrl}
                alt={book.title}
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  borderRadius: 14,
                  objectFit: "cover",
                  marginBottom: 12,
                  boxShadow: "0 8px 18px rgba(70,140,90,0.18)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  borderRadius: 14,
                  background: PALETTE.cover,
                  marginBottom: 12,
                  boxShadow: "0 8px 18px rgba(70,140,90,0.18)",
                }}
              />
            )}
            <div style={{ marginBottom: 7 }}>
              <LeafMeter rating={book.avgRating} size={13} gap={2} />
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: INK, lineHeight: 1.3 }}>
              {book.title}
            </div>
            {book.author && (
              <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#6E7D64", marginTop: 3 }}>
                {book.author}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

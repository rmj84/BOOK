import Link from "next/link";
import { cardBase, cardShadow, FONT_BODY, FONT_DISPLAY, FONT_HEAD, INK, PALETTE } from "./theme";
import type { LandingBook } from "./RecommendedSection";

export function PopularSection({ books }: { books: LandingBook[] }) {
  if (books.length === 0) return null;

  return (
    <div style={{ padding: "64px 0 0" }}>
      <h2 style={{ fontFamily: FONT_HEAD, fontSize: 28, color: INK, margin: 0, letterSpacing: "-0.01em" }}>
        🔥 요즘 다들 읽는 책
      </h2>
      <div style={{ display: "flex", gap: 16, marginTop: 20, overflow: "hidden" }}>
        {books.slice(0, 5).map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            style={{ ...cardBase, borderRadius: 22, padding: 14, flex: 1, minWidth: 0, ...cardShadow, display: "block" }}
          >
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverUrl}
                alt={book.title}
                style={{
                  width: "100%",
                  aspectRatio: "2/3",
                  borderRadius: 14,
                  objectFit: "cover",
                  opacity: 0.9,
                  marginBottom: 10,
                  boxShadow: "0 8px 18px rgba(70,140,90,0.16)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "2/3",
                  borderRadius: 14,
                  background: PALETTE.cover,
                  opacity: 0.9,
                  marginBottom: 10,
                  boxShadow: "0 8px 18px rgba(70,140,90,0.16)",
                }}
              />
            )}
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14.5, color: INK, lineHeight: 1.3 }}>
              {book.title}
            </div>
            {book.author && (
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: "#6E7D64", marginTop: 2 }}>
                {book.author}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

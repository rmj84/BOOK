import Link from "next/link";
import { FlameIcon } from "./icons";
import { LeafMeter } from "./LeafMeter";
import { FONT_SERIF, PAPER, RULE_WEIGHT, coverPattern, monoLabel } from "./theme";
import type { LandingBook } from "./RecommendedSection";

export function PopularSection({ books }: { books: LandingBook[] }) {
  if (books.length === 0) return null;
  const shown = books.slice(0, 5);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "22px 32px",
          borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
        }}
      >
        <span style={{ fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 9 }}>
          <FlameIcon />
          요즘 다들 읽는 책
        </span>
        <span style={{ ...monoLabel, textTransform: "uppercase", whiteSpace: "nowrap" }}>주간 순위</span>
      </div>
      <div style={{ borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}` }}>
        {shown.map((book, i) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "16px 32px",
              borderBottom: i < shown.length - 1 ? `1px solid ${PAPER.hair}` : "none",
              color: PAPER.rule,
            }}
          >
            <div style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 700, width: 46, flexShrink: 0 }}>
              0{i + 1}
            </div>
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverUrl}
                alt={book.title}
                style={{ width: 26, height: 38, objectFit: "cover", border: `1px solid ${PAPER.rule}`, flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: 26, height: 38, background: coverPattern(6), border: `1px solid ${PAPER.rule}`, flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700, lineHeight: 1.3, wordBreak: "keep-all" }}>
                {book.title}
              </div>
              {book.author && (
                <div style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 12.5, color: "#57534A", marginTop: 3 }}>
                  {book.author}
                </div>
              )}
            </div>
            {typeof book.reviewCount === "number" && (
              <div style={{ ...monoLabel, whiteSpace: "nowrap" }}>후기 {book.reviewCount}</div>
            )}
            <div style={{ display: "flex", width: 82, justifyContent: "flex-end" }}>
              <LeafMeter rating={book.avgRating} size={13} gap={3} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

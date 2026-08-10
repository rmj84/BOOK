import Link from "next/link";
import { LeafIcon } from "./icons";
import { LeafMeter } from "./LeafMeter";
import { FONT_SERIF, PAPER, RULE_WEIGHT, coverPattern, monoLabel } from "./theme";

export type LandingBook = {
  id: string;
  title: string;
  author: string | null;
  coverUrl: string | null;
  avgRating: number;
  reviewCount?: number;
};

export function RecommendedSection({ books }: { books: LandingBook[] }) {
  if (books.length === 0) return null;
  const shown = books.slice(0, 4);

  return (
    <>
      <div
        className="ed-px-32 ed-row-wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "22px 32px",
          borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 9 }}>
            <LeafIcon />
            취향 저격 추천
          </span>
          <span style={monoLabel}>평소 좋아한 장르를 바탕으로 골라봤어요</span>
        </div>
        <Link href="/shelf" style={{ ...monoLabel, textTransform: "uppercase", whiteSpace: "nowrap" }}>
          더보기 →
        </Link>
      </div>
      <div className="ed-grid-2" style={{ display: "grid", gridTemplateColumns: `repeat(${shown.length + 1}, 1fr)`, borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}` }}>
        {shown.map((book, i) => (
          <Link key={book.id} href={`/books/${book.id}`} className="ed-px-24" style={{ padding: "26px 24px", borderRight: `1px solid ${PAPER.hair}`, display: "block" }}>
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverUrl}
                alt={book.title}
                style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", border: `1px solid ${PAPER.rule}`, marginBottom: 14 }}
              />
            ) : (
              <div style={{ aspectRatio: "2/3", background: coverPattern(9), border: `1px solid ${PAPER.rule}`, marginBottom: 14 }} />
            )}
            <div style={{ ...monoLabel, letterSpacing: "0.1em", marginBottom: 7 }}>0{i + 1} · 추천</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 19, fontWeight: 700, lineHeight: 1.3, wordBreak: "keep-all", color: PAPER.rule }}>
              {book.title}
            </div>
            {book.author && (
              <div style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 12.5, color: "#57534A", marginTop: 4 }}>
                {book.author}
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <LeafMeter rating={book.avgRating} size={13} gap={3} />
            </div>
          </Link>
        ))}
        <div className="ed-px-24" style={{ padding: "26px 24px", background: PAPER.rule, color: PAPER.sheet, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="ed-h2-lg" style={{ fontFamily: FONT_SERIF, fontSize: 30, lineHeight: 1.35, fontWeight: 400, fontStyle: "italic", marginBottom: 18 }}>
            한 줄이면 충분해요
          </div>
          <Link href="/reviews/new" style={{ ...monoLabel, letterSpacing: "0.1em", color: "#A8A296" }}>
            + 후기 쓰기
          </Link>
        </div>
      </div>
    </>
  );
}

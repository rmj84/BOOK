import Link from "next/link";
import { toggleFollow } from "@/lib/actions/follow";
import type { FeaturedShelf } from "@/lib/book-stats";
import { FONT_SERIF, PAPER, RULE_WEIGHT, coverPattern, monoLabel, pillButtonStyle, shelfBookHeight } from "./theme";

export function ShelvesSection({ shelves }: { shelves: FeaturedShelf[] }) {
  if (shelves.length === 0) return null;

  return (
    <>
      <div className="ed-px-32" style={{ padding: "22px 32px", borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 700 }}>모두의 책장</span>
          <span style={monoLabel}>아직 팔로우가 없다면, 먼저 구경부터 해보세요</span>
        </div>
      </div>
      <div style={{ borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}` }}>
        {shelves.map((shelf, idx) => (
          <div key={shelf.user.id} className="ed-px-32" style={{ padding: "24px 32px", borderBottom: idx < shelves.length - 1 ? `1px solid ${PAPER.hair}` : "none" }}>
            <div className="ed-row-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
              <Link href={`/u/${shelf.user.id}`} style={{ display: "flex", alignItems: "center", gap: 12, color: PAPER.rule }}>
                {shelf.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={shelf.user.image}
                    alt={shelf.user.name ?? ""}
                    style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, objectFit: "cover", border: `1px solid ${PAPER.rule}` }}
                  />
                ) : (
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: coverPattern(6), border: `1px solid ${PAPER.rule}`, flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 17, fontWeight: 700, lineHeight: 1.25 }}>
                    {shelf.user.name ?? "익명"}
                  </div>
                  <div style={{ ...monoLabel, marginTop: 2 }}>후기 {shelf.reviewCount}개</div>
                </div>
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Link href={`/u/${shelf.user.id}`} style={{ ...monoLabel, whiteSpace: "nowrap" }}>
                  이 사람 책장 구경하기 →
                </Link>
                <form action={toggleFollow.bind(null, shelf.user.id)}>
                  <button type="submit" style={pillButtonStyle(false)}>
                    팔로우
                  </button>
                </form>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, minHeight: 112, padding: "0 2px", overflowX: "auto" }}>
              {shelf.books.map((book, k) => {
                const h = shelfBookHeight(idx, k);
                const w = Math.round(h * 0.62);
                return (
                  <Link key={book.id} href={`/books/${book.id}`} style={{ display: "flex", alignItems: "flex-end" }}>
                    {book.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        style={{ width: w, height: h, objectFit: "cover", border: `1px solid ${PAPER.rule}` }}
                      />
                    ) : (
                      <div
                        style={{
                          width: w,
                          height: h,
                          background: coverPattern(7),
                          border: `1px solid ${PAPER.rule}`,
                          display: "flex",
                          alignItems: "flex-end",
                          padding: "7px 6px",
                          boxSizing: "border-box",
                        }}
                      >
                        <div style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 10, fontWeight: 600, lineHeight: 1.35, color: PAPER.rule, wordBreak: "keep-all" }}>
                          {book.title}
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
            <div style={{ height: 6, background: PAPER.rule, marginTop: 6 }} />
          </div>
        ))}
      </div>
    </>
  );
}

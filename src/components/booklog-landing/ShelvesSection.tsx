import Link from "next/link";
import { toggleFollow } from "@/lib/actions/follow";
import type { FeaturedShelf } from "@/lib/book-stats";
import { cardBase, cardShadow, FONT_BODY, FONT_DISPLAY, FONT_HEAD, INK, PALETTE } from "./theme";

function bookGeometry(personIndex: number, bookIndex: number) {
  const h = 96 + ((personIndex * 2 + bookIndex * 3) % 4) * 9;
  const w = Math.round(h * 0.66);
  const opacity = 0.78 + ((personIndex + bookIndex) % 3) * 0.07;
  return { h, w, opacity };
}

export function ShelvesSection({ shelves }: { shelves: FeaturedShelf[] }) {
  if (shelves.length === 0) return null;

  return (
    <div style={{ padding: "72px 0 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 22,
        }}
      >
        <div>
          <h2 style={{ fontFamily: FONT_HEAD, fontSize: 28, color: INK, margin: 0, letterSpacing: "-0.01em" }}>
            모두의 책장
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#6E7D64", margin: "6px 0 0" }}>
            아직 팔로우가 없다면, 먼저 구경부터 해보세요
          </p>
        </div>
        <Link
          href="/shelf"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            ...cardBase,
            borderRadius: 999,
            padding: "11px 18px",
            minWidth: 250,
            ...cardShadow,
            fontFamily: FONT_BODY,
            fontSize: 13,
            color: "#3B4A34",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6E7D64" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          모두의 책장에서 더 보기
        </Link>
      </div>

      <div style={{ ...cardBase, borderRadius: 28, ...cardShadow }}>
        {shelves.map((shelf, idx) => (
          <div key={shelf.user.id} style={{ padding: "26px 30px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 14,
              }}
            >
              <Link
                href={`/u/${shelf.user.id}`}
                style={{ display: "flex", alignItems: "center", gap: 11, color: INK }}
              >
                {shelf.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={shelf.user.image}
                    alt={shelf.user.name ?? ""}
                    style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: PALETTE.cover,
                      flexShrink: 0,
                    }}
                  />
                )}
                <div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: INK, lineHeight: 1.25 }}>
                    {shelf.user.name ?? "익명"}
                  </div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: "#6E7D64" }}>
                    후기 {shelf.reviewCount}개
                  </div>
                </div>
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Link
                  href={`/u/${shelf.user.id}`}
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 12.5,
                    color: "#3E9B6B",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  이 사람 책장 구경하기 →
                </Link>
                <form action={toggleFollow.bind(null, shelf.user.id)}>
                  <button
                    type="submit"
                    style={{
                      background: "transparent",
                      color: INK,
                      border: "1.5px solid rgba(31,42,28,0.18)",
                      borderRadius: 999,
                      padding: "8px 16px",
                      fontFamily: FONT_BODY,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    팔로우
                  </button>
                </form>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 18,
                padding: "0 6px",
                minHeight: 126,
              }}
            >
              {shelf.books.map((book, k) => {
                const { h, w, opacity } = bookGeometry(idx, k);
                return (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    {book.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        style={{
                          width: w,
                          height: h,
                          borderRadius: "3px 5px 5px 3px",
                          objectFit: "cover",
                          opacity,
                          boxShadow:
                            "0 6px 12px -4px rgba(31,42,28,0.34), inset 4px 0 0 rgba(255,255,255,0.28)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: w,
                          height: h,
                          borderRadius: "3px 5px 5px 3px",
                          background: PALETTE.cover,
                          opacity,
                          display: "flex",
                          alignItems: "flex-end",
                          padding: "8px 7px",
                          boxSizing: "border-box",
                          boxShadow:
                            "0 6px 12px -4px rgba(31,42,28,0.34), inset 4px 0 0 rgba(255,255,255,0.28)",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: FONT_BODY,
                            fontSize: 10.5,
                            fontWeight: 600,
                            lineHeight: 1.35,
                            color: "rgba(255,255,255,0.94)",
                            textShadow: "0 1px 2px rgba(20,40,25,0.35)",
                          }}
                        >
                          {book.title}
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
            <div
              style={{
                height: 11,
                borderRadius: "0 0 6px 6px",
                background:
                  "linear-gradient(180deg, rgba(31,42,28,0.16), rgba(31,42,28,0.07))",
                boxShadow: "0 8px 14px -6px rgba(31,42,28,0.24)",
                marginBottom: 22,
              }}
            />
          </div>
        ))}
        <div style={{ height: 26 }} />
      </div>
    </div>
  );
}

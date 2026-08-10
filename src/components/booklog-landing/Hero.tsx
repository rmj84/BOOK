import { signIn } from "@/lib/auth";
import Link from "next/link";
import { LeafMeter } from "./LeafMeter";
import { ACCENT, FONT_SERIF, PAPER, RULE_WEIGHT, ctaButtonStyle, coverPattern, monoLabel } from "./theme";

type TopBook = {
  title: string;
  author: string | null;
  rating: number;
};

export function Hero({
  topBook,
  isLoggedIn = false,
}: {
  topBook: TopBook | null;
  isLoggedIn?: boolean;
}) {
  return (
    <div className="ed-px-32" style={{ padding: "56px 32px 26px", borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}` }}>
      <div style={{ ...monoLabel, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 24 }}>
        읽은 책을 기록하고 공유하는 독서 다이어리
      </div>
      <h1
        className="ed-hero-h1"
        style={{
          fontFamily: FONT_SERIF,
          fontSize: 84,
          lineHeight: 1.0,
          fontWeight: 700,
          margin: "0 0 32px",
          letterSpacing: "-0.025em",
          color: PAPER.rule,
          wordBreak: "keep-all",
        }}
      >
        나만 알기엔 아까운 책,
        <br />
        <span style={{ fontStyle: "italic", fontWeight: 400, color: ACCENT }}>같이 읽어요</span>
      </h1>

      <div className="ed-grid-1" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 34, paddingBottom: 36 }}>
        <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 15.5, lineHeight: 1.78, color: "#3A362F", margin: 0 }}>
          읽은 책에 잎을 하나씩 꽂고, 동기·친구들과 감상을 나눠보세요. 완벽한 서평 아니어도 괜찮아요, 한 줄이면
          충분해요.
        </p>

        <div style={{ borderLeft: `1px solid ${PAPER.hair}`, paddingLeft: 22 }}>
          {topBook ? (
            <>
              <div style={{ ...monoLabel, letterSpacing: "0.1em", marginBottom: 9 }}>이주의 잎점수 1위</div>
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    flexShrink: 0,
                    aspectRatio: "2/3",
                    background: coverPattern(6),
                    border: `1px solid ${PAPER.rule}`,
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 700, lineHeight: 1.25, wordBreak: "keep-all" }}>
                    {topBook.title}
                  </div>
                  {topBook.author && (
                    <div style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 12, color: "#57534A", margin: "3px 0 8px" }}>
                      {topBook.author}
                    </div>
                  )}
                  <LeafMeter rating={topBook.rating} size={13} gap={2} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ ...monoLabel, letterSpacing: "0.12em", marginBottom: 9 }}>잎점수</div>
              <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13.5, lineHeight: 1.7, color: "#3A362F", margin: 0 }}>
                별점 대신 잎점수예요. 0.5잎 단위로 솔직하게 매겨보세요.
              </p>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start", gap: 12 }}>
          {isLoggedIn ? (
            <Link href="/reviews/new" style={ctaButtonStyle}>
              + 후기 쓰기
            </Link>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button type="submit" style={ctaButtonStyle}>
                Google로 시작하기 →
              </button>
            </form>
          )}
          <span style={{ ...monoLabel, letterSpacing: "0.06em" }}>무료 · 가입 30초</span>
        </div>
      </div>
    </div>
  );
}

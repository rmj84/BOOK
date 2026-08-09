import { signIn } from "@/lib/auth";
import { LeafMeter } from "./LeafMeter";
import {
  cardBase,
  cardShadow,
  FONT_BODY,
  FONT_DISPLAY,
  FONT_HEAD,
  INK,
  PALETTE,
} from "./theme";

type TopBook = {
  title: string;
  author: string | null;
  rating: number;
};

export function Hero({ topBook }: { topBook: TopBook | null }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 0.82fr",
        gap: 44,
        padding: "52px 0 60px",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "rgba(255,255,255,0.62)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.85)",
            borderRadius: 999,
            padding: "8px 16px",
            fontFamily: FONT_BODY,
            fontSize: 12.5,
            fontWeight: 600,
            color: "#3B4A34",
            marginBottom: 22,
          }}
        >
          후기 한 줄로 표현해봐요
        </div>

        <h1
          style={{
            fontFamily: FONT_HEAD,
            fontSize: 62,
            lineHeight: 1.14,
            margin: "0 0 20px",
            color: INK,
            letterSpacing: "-0.02em",
            whiteSpace: "pre-line",
          }}
        >
          {"나만 알기엔\n아까운 책,"}
          <br />
          <span
            style={{
              background: PALETTE.grad,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            같이 읽어요
          </span>
        </h1>

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 16.5,
            lineHeight: 1.75,
            color: "#47563E",
            margin: "0 0 28px",
            maxWidth: 440,
          }}
        >
          읽은 책에 잎을 하나씩 꽂고, 동기·친구들과 감상을 나눠보세요. 완벽한 서평 아니어도 괜찮아요, 한
          줄이면 충분해요.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(14px)",
                border: "1.5px solid rgba(255,255,255,0.95)",
                borderRadius: 999,
                padding: "16px 28px",
                fontFamily: FONT_BODY,
                fontSize: 15,
                fontWeight: 700,
                color: INK,
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(70,140,90,0.2)",
              }}
            >
              <span
                style={{
                  width: 21,
                  height: 21,
                  borderRadius: "50%",
                  background: INK,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#F4FAEE",
                }}
              >
                G
              </span>
              Google로 시작하기
            </button>
          </form>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {topBook && (
          <div style={{ ...cardBase, borderRadius: 22, padding: 18, ...cardShadow }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div
                style={{
                  width: 72,
                  flexShrink: 0,
                  aspectRatio: "2/3",
                  borderRadius: 12,
                  background: PALETTE.cover,
                  boxShadow: "0 8px 18px rgba(70,140,90,0.24)",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 5 }}>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "#3E9B6B",
                  }}
                >
                  🍃 이주의 잎점수 1위
                </div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: INK }}>{topBook.title}</div>
                {topBook.author && (
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#6E7D64" }}>
                    {topBook.author}
                  </div>
                )}
                <LeafMeter rating={topBook.rating} size={15} gap={3} />
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            background: "rgba(27,42,29,0.9)",
            backdropFilter: "blur(16px)",
            borderRadius: 22,
            padding: 20,
            boxShadow: "0 14px 34px rgba(27,42,29,0.26)",
          }}
        >
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#B7E08A",
              marginBottom: 10,
            }}
          >
            이런 한 줄도 충분해요
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, lineHeight: 1.65, color: "#F1F8EA", margin: "0 0 12px" }}>
            &ldquo;완벽한 문장이 아니어도 괜찮아요, 솔직한 감상이 제일이에요.&rdquo;
          </p>
          <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#9DBE8C" }}>
            모두의 책장 구경하기 →
          </span>
        </div>
      </div>
    </div>
  );
}

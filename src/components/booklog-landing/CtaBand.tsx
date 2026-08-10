import Link from "next/link";
import { FONT_SERIF, PAPER, monoLabel } from "./theme";

export function CtaBand() {
  return (
    <div
      className="ed-px-32"
      style={{
        background: PAPER.rule,
        color: PAPER.sheet,
        padding: "48px 32px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 40,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A8A296", marginBottom: 14 }}>
          Booklog
        </div>
        <h2 className="ed-h2-lg" style={{ fontFamily: FONT_SERIF, fontSize: 40, lineHeight: 1.26, fontWeight: 400, fontStyle: "italic", margin: 0, color: PAPER.sheet, letterSpacing: "-0.01em" }}>
          그 책, 다음엔
          <br />뭐 읽지?
        </h2>
      </div>
      <div style={{ maxWidth: 400 }}>
        <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 14.5, lineHeight: 1.78, color: "#A8A296", margin: "0 0 22px" }}>
          후기 한 줄만 남겨도 책장에 잎이 하나 꽂혀요. 동기들이랑 서로 팔로우하면서 요즘 무슨 책 읽는지
          구경해보세요.
        </p>
        <Link
          href="/reviews/new"
          style={{
            display: "inline-block",
            background: PAPER.sheet,
            color: PAPER.rule,
            border: "none",
            padding: "15px 26px",
            fontFamily: "'IBM Plex Sans KR',sans-serif",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + 후기 쓰기
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { FONT_BODY, FONT_HEAD, LEAF } from "./theme";

export function CtaBand() {
  return (
    <div
      style={{
        marginTop: 76,
        background: "rgba(27,42,29,0.94)",
        borderRadius: 28,
        padding: "44px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 32,
        flexWrap: "wrap",
        boxShadow: "0 18px 44px rgba(27,42,29,0.28)",
      }}
    >
      <div>
        <h2 style={{ fontFamily: FONT_HEAD, fontSize: 34, lineHeight: 1.3, color: "#F1F8EA", margin: "0 0 10px", letterSpacing: "-0.01em" }}>
          그 책, 다음엔 뭐 읽지?
        </h2>
        <p style={{ fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.7, color: "#A8C79A", margin: 0, maxWidth: 440 }}>
          후기 한 줄만 남겨도 책장에 잎이 하나 꽂혀요. 동기들이랑 서로 팔로우하면서 요즘 무슨 책 읽는지
          구경해보세요.
        </p>
      </div>
      <Link
        href="/reviews/new"
        style={{
          background: LEAF,
          color: "#F4FAEE",
          borderRadius: 999,
          padding: "16px 30px",
          fontFamily: FONT_BODY,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        + 후기 쓰기
      </Link>
    </div>
  );
}

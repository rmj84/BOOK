import Link from "next/link";
import { FONT_BODY, FONT_DISPLAY, INK } from "./theme";

export function Footer() {
  return (
    <div
      style={{
        padding: "44px 0 60px",
        borderTop: "1px solid rgba(31,42,28,0.1)",
        marginTop: 56,
        display: "flex",
        justifyContent: "space-between",
        gap: 40,
        flexWrap: "wrap",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: FONT_DISPLAY,
            fontSize: 18,
            color: INK,
            marginBottom: 10,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="#3E9B6B">
            <path d="M12 2.2C9.2 5.8 4.6 9.4 4.6 13.5c0 3.9 3.3 6.7 7.4 7.2 4.1-.5 7.4-3.3 7.4-7.2 0-4.1-4.6-7.7-7.4-11.3z" />
            <path d="M12 20.7v2.4" fill="none" stroke="#3E9B6B" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          북로그
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.75, color: "#6E7D64", margin: 0 }}>
          북로그는 읽은 책을 기록하고 공유하는 독서 다이어리 앱입니다. 책 후기와 잎점수(평점)를 남기고,
          친구를 팔로우해 서로의 책장을 구경하고, 취향에 맞는 책을 추천받아보세요.
        </p>
      </div>
      <div style={{ display: "flex", gap: 44, fontFamily: FONT_BODY, fontSize: 13, color: "#6E7D64" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <span style={{ color: INK, fontWeight: 600 }}>서비스</span>
          <Link href="/shelf">모두의 책장</Link>
          <Link href="/reviews/new">후기 쓰기</Link>
          <a href="#leaf-score">잎점수 안내</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <span style={{ color: INK, fontWeight: 600 }}>정보</span>
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>문의</span>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { FONT_MONO, FONT_SERIF, PAPER } from "./theme";

export function Footer() {
  return (
    <div className="ed-px-32" style={{ padding: "40px 32px", display: "flex", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
      <div style={{ maxWidth: 520 }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700, letterSpacing: "0.03em", marginBottom: 12 }}>
          BOOKLOG
        </div>
        <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13, lineHeight: 1.8, color: "#57534A", margin: 0 }}>
          북로그는 읽은 책을 기록하고 공유하는 독서 다이어리 앱입니다. 책 후기와 잎점수(평점)를 남기고, 친구를
          팔로우해 서로의 책장을 구경하고, 취향에 맞는 책을 추천받아보세요.
        </p>
      </div>
      <div className="ed-footer-links" style={{ display: "flex", gap: 48, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", color: "#57534A" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ color: PAPER.rule, fontWeight: 500 }}>서비스</span>
          <Link href="/shelf">모두의 책장</Link>
          <Link href="/reviews/new">후기 쓰기</Link>
          <a href="#leaf-score">잎점수 안내</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ color: PAPER.rule, fontWeight: 500 }}>정보</span>
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>문의</span>
        </div>
      </div>
    </div>
  );
}

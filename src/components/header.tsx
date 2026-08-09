"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signInWithGoogle, signOutAction } from "@/lib/actions/auth";
import { FONT_MONO, FONT_SERIF, PAPER, RULE_WEIGHT, ACCENT } from "@/components/booklog-landing/theme";

type HeaderUser = {
  id: string;
  name?: string | null;
  image?: string | null;
} | null;

const navBaseStyle = { cursor: "pointer", color: PAPER.rule };
const navActiveStyle = {
  cursor: "pointer",
  fontWeight: 500,
  color: ACCENT,
  borderBottom: `1px solid ${ACCENT}`,
  paddingBottom: 2,
};
const authButtonStyle = {
  fontWeight: 500,
  cursor: "pointer",
  color: PAPER.rule,
  background: "none",
  border: "none",
  font: "inherit",
  padding: 0,
};

export default function Header({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const shelfActive = pathname.startsWith("/shelf") || pathname.startsWith("/books") || pathname.startsWith("/genres");
  const reviewActive = pathname.startsWith("/reviews");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "18px 32px",
        borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
        background: PAPER.sheet,
      }}
    >
      <Link
        href="/"
        style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 700, letterSpacing: "0.03em", color: PAPER.rule }}
      >
        BOOKLOG
      </Link>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "#57534A",
          textAlign: "center",
        }}
      >
        제 1 호 · 독서 기록
      </div>
      <nav
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "flex-end",
          alignItems: "center",
          fontFamily: FONT_MONO,
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        <Link href="/shelf" style={shelfActive ? navActiveStyle : navBaseStyle}>
          책장
        </Link>
        <Link href="/reviews/new" style={reviewActive ? navActiveStyle : navBaseStyle}>
          후기 쓰기
        </Link>
        {user ? (
          <>
            <Link href={`/u/${user.id}`} style={navBaseStyle}>
              내 프로필
            </Link>
            <form action={signOutAction}>
              <button type="submit" style={authButtonStyle}>
                로그아웃
              </button>
            </form>
          </>
        ) : (
          <form action={signInWithGoogle}>
            <button type="submit" style={authButtonStyle}>
              로그인
            </button>
          </form>
        )}
      </nav>
    </div>
  );
}

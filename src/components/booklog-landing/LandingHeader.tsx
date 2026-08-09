import Link from "next/link";
import { signIn, signOut } from "@/lib/auth";
import { ACCENT, FONT_MONO, FONT_SERIF, PAPER, RULE_WEIGHT, monoLabel } from "./theme";

export type LandingUser = {
  id: string;
  name?: string | null;
  image?: string | null;
} | null;

const navLinkStyle = { cursor: "pointer", color: PAPER.rule };
const navLinkActiveStyle = {
  cursor: "pointer",
  fontWeight: 500,
  color: ACCENT,
  borderBottom: `1px solid ${ACCENT}`,
  paddingBottom: 2,
};

export function LandingHeader({ user = null }: { user?: LandingUser }) {
  return (
    <div
      className="editorial-header"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "18px 32px",
        borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: FONT_SERIF,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.03em",
          color: PAPER.rule,
        }}
      >
        BOOKLOG
      </Link>
      <div className="editorial-header-center" style={{ ...monoLabel, textAlign: "center" }}>제 1 호 · 독서 기록</div>
      <div
        className="editorial-nav"
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
        <span style={navLinkActiveStyle}>홈</span>
        <Link href="/shelf" style={navLinkStyle}>
          책장
        </Link>
        <Link href="/reviews/new" style={navLinkStyle}>
          후기
        </Link>
        {user ? (
          <>
            <Link href={`/u/${user.id}`} style={navLinkStyle}>
              내 프로필
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button type="submit" style={{ fontWeight: 500, cursor: "pointer", color: PAPER.rule, background: "none", border: "none", font: "inherit" }}>
                로그아웃
              </button>
            </form>
          </>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button type="submit" style={{ fontWeight: 500, cursor: "pointer", color: PAPER.rule, background: "none", border: "none", font: "inherit" }}>
              로그인
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

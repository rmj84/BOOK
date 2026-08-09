import Link from "next/link";
import { signIn, signOut } from "@/lib/auth";
import { darkPillStyle, FONT_DISPLAY, glassPillStyle, INK } from "./theme";

export type LandingUser = {
  id: string;
  name?: string | null;
  image?: string | null;
} | null;

export function LandingHeader({ user = null }: { user?: LandingUser }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          fontFamily: FONT_DISPLAY,
          fontSize: 23,
          color: INK,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#3E9B6B">
          <path d="M12 2.2C9.2 5.8 4.6 9.4 4.6 13.5c0 3.9 3.3 6.7 7.4 7.2 4.1-.5 7.4-3.3 7.4-7.2 0-4.1-4.6-7.7-7.4-11.3z" />
          <path
            d="M12 20.7v2.4"
            fill="none"
            stroke="#3E9B6B"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
        북로그
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
        <Link href="/shelf" style={glassPillStyle}>
          모두의 책장
        </Link>
        <Link href="/reviews/new" style={glassPillStyle}>
          후기 쓰기
        </Link>
        {user ? (
          <>
            <Link href={`/u/${user.id}`} style={glassPillStyle}>
              내 프로필
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                style={{ ...darkPillStyle, border: "none", cursor: "pointer" }}
              >
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
            <button
              type="submit"
              style={{ ...darkPillStyle, border: "none", cursor: "pointer" }}
            >
              로그인
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

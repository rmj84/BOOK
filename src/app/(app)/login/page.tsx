import { signInWithGoogle } from "@/lib/actions/auth";
import { FONT_SERIF, PAPER, ctaButtonStyle, monoLabel } from "@/components/booklog-landing/theme";

export default function LoginPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "48px 0 40px" }}>
      <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>Login</div>
      <h1 style={{ fontFamily: FONT_SERIF, fontSize: 34, fontWeight: 700, margin: "0 0 14px", letterSpacing: "-0.01em", color: PAPER.rule }}>
        북로그에 로그인
      </h1>
      <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 14.5, lineHeight: 1.75, color: "#3A362F", margin: "0 0 32px", maxWidth: 340 }}>
        읽은 책의 후기를 기록하고, 아는 사람들과 편하게 공유해보세요.
      </p>
      <form action={signInWithGoogle}>
        <button type="submit" style={ctaButtonStyle}>
          Google로 시작하기 →
        </button>
      </form>
    </div>
  );
}

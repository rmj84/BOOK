import Header from "@/components/header";
import { PAPER, RULE_WEIGHT, SHEET_SHADOW, FONT_SANS } from "@/components/booklog-landing/theme";

type ShellUser = {
  id: string;
  name?: string | null;
  image?: string | null;
} | null;

export default function AppShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        minHeight: "100%",
        background: PAPER.bg,
        padding: "40px 24px 64px",
        fontFamily: FONT_SANS,
        color: PAPER.rule,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          background: PAPER.sheet,
          border: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
          boxShadow: `${SHEET_SHADOW}px ${SHEET_SHADOW}px 0 ${PAPER.rule}`,
        }}
      >
        <Header user={user} />
        <main style={{ padding: "36px 32px" }}>{children}</main>
      </div>
    </div>
  );
}

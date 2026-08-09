import type { CSSProperties } from "react";

// "1a 에디토리얼" 신문 그리드 디자인의 토큰.
// Booklog Landing 1A.dc.html의 기본 트윅 값을 그대로 옮김:
// paper: 뉴스프린트, accent: 먹색 (기본), ruleWeight: 1, sheetShadow: 10,
// italicSecondLine: true, coverStyle: hatch.
export const PAPER = {
  bg: "#EDEAE4",
  sheet: "#FBFAF7",
  rule: "#1A1815",
  hair: "#C9C4B8",
};

export const ACCENT = "#1A1815";
export const RULE_WEIGHT = 1;
export const SHEET_SHADOW = 10;

export const FONT_SERIF = "'Bodoni Moda','Nanum Myeongjo',serif";
export const FONT_SANS = "'IBM Plex Sans KR',sans-serif";
export const FONT_MONO = "'DM Mono','IBM Plex Sans KR',monospace";

export const monoLabel: CSSProperties = {
  fontFamily: FONT_MONO,
  fontSize: 11,
  letterSpacing: "0.08em",
  color: "#57534A",
};

export const ctaButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: ACCENT,
  color: PAPER.sheet,
  border: "none",
  padding: "15px 26px",
  fontFamily: FONT_SANS,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  letterSpacing: "0.01em",
  whiteSpace: "nowrap",
};

export const pillButtonStyle = (active: boolean): CSSProperties => ({
  background: active ? PAPER.rule : "transparent",
  color: active ? PAPER.sheet : PAPER.rule,
  border: `1px solid ${PAPER.rule}`,
  padding: "8px 18px",
  fontFamily: FONT_SANS,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
});

/** Hatch-pattern placeholder cover, matching coverStyle: "hatch" in the prototype. */
export function coverPattern(widthPx: number): string {
  return `repeating-linear-gradient(135deg, ${PAPER.bg}, ${PAPER.bg} ${widthPx}px, ${PAPER.hair} ${widthPx}px, ${PAPER.hair} ${widthPx * 2}px)`;
}

/** Shelf-row book spine height, matching the prototype's pseudo-random height formula. */
export function shelfBookHeight(rowIndex: number, bookIndex: number): number {
  return 86 + ((rowIndex * 2 + bookIndex * 3) % 4) * 9;
}

export function leaves(rating: number) {
  return [0, 1, 2, 3, 4].map((i) => ({
    key: i,
    pct: Math.max(0, Math.min(1, rating - i)) * 100,
  }));
}

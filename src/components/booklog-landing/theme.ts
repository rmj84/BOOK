import type { CSSProperties } from "react";

export const LEAF = "#3E9B6B";
export const INK = "#1F2A1C";

export const PALETTE = {
  a: "#F6FBEE",
  b: "#E4F3D4",
  c: "#CFEBD3",
  d: "#BFE3D8",
  grad: "linear-gradient(96deg,#7BB33A,#3E9B6B 52%,#2E8C82)",
  cover: "linear-gradient(150deg,#A9D66E,#6FC79B)",
};

export const RADIUS = 22;
export const BG_ANGLE = 145;
export const GLASS_SOFTNESS = 0.62;

export const FONT_BODY = "'IBM Plex Sans KR', sans-serif";
export const FONT_DISPLAY = "'Jua', 'IBM Plex Sans KR', sans-serif";
export const FONT_HEAD = "'Gasoek One', 'Jua', sans-serif";

export const glassBg = `rgba(255,255,255,${GLASS_SOFTNESS})`;

export const cardBase: CSSProperties = {
  background: glassBg,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.9)",
};

export const cardShadow: CSSProperties = {
  boxShadow: "0 14px 34px rgba(70,140,90,0.14)",
};

export const glassPillStyle: CSSProperties = {
  background: glassBg,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.85)",
  borderRadius: 999,
  padding: "9px 18px",
  fontFamily: FONT_BODY,
  fontSize: 12.5,
  fontWeight: 600,
  color: "#3B4A34",
};

export const darkPillStyle: CSSProperties = {
  background: INK,
  color: "#F4FAEE",
  borderRadius: 999,
  padding: "10px 20px",
  fontFamily: FONT_BODY,
  fontSize: 12.5,
  fontWeight: 600,
};

export function leaves(rating: number) {
  return [0, 1, 2, 3, 4].map((i) => ({
    key: i,
    pct: Math.max(0, Math.min(1, rating - i)) * 100,
  }));
}

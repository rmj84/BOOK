export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://book-liard-zeta.vercel.app";

// 후원 계좌 표시 문자열 (예: "카카오페이증권 020-10-096099"). 설정 전까지는 숨긴다.
export const SUPPORT_ACCOUNT = process.env.NEXT_PUBLIC_SUPPORT_ACCOUNT || null;

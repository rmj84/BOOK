export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://book-liard-zeta.vercel.app";

// 카카오페이 송금 링크. 설정 전까지는 후원 버튼을 숨긴다.
export const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_URL || null;

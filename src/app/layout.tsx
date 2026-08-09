import type { Metadata } from "next";
import { Nanum_Pen_Script, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import Header from "@/components/header";

// Google Fonts는 나눔손글씨 펜 계열을 별도 "korean" 서브셋으로 나누지 않고
// "latin" 하나로만 제공하는데, 이 파일 자체에 한글 글리프가 포함되어 있다.
const pen = Nanum_Pen_Script({
  variable: "--font-pen",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "북로그 | 책 후기 공유",
  description: "읽은 책의 후기를 기록하고 공유하는 서비스",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="ko"
      className={`${pen.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* 랜딩(2C) 전용 폰트. next/font는 이 폰트들의 한글 서브셋을 몰라 직접 링크로 로드 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gasoek+One&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=Jua&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <Header user={session?.user ?? null} />
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}

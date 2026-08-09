"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createReview } from "@/lib/actions/reviews";
import type { BookSearchResult } from "@/lib/books";
import LeafScoreInput from "@/components/leaf-score-input";
import LeafScore from "@/components/leaf-score";
import SubmitButton from "@/components/submit-button";
import BuyButton from "@/components/buy-button";
import {
  FONT_SERIF,
  PAPER,
  RULE_WEIGHT,
  ctaButtonStyle,
  coverPattern,
  monoLabel,
} from "@/components/booklog-landing/theme";

export type FeedReview = {
  id: string;
  rating: number;
  content: string;
  createdAt: Date;
  book: { title: string; author: string | null; coverUrl: string | null };
  user: { id: string; name: string | null };
};

const inputStyle = {
  border: `1px solid ${PAPER.rule}`,
  background: PAPER.sheet,
  padding: "11px 14px",
  fontFamily: "'IBM Plex Sans KR',sans-serif",
  fontSize: 14,
  color: PAPER.rule,
  outline: "none",
  boxSizing: "border-box" as const,
};

const tips = [
  "가장 기억에 남는 장면이나 문장을 적어보세요",
  "이 책을 누구에게 추천하고 싶은지 써보면 좋아요",
  "읽기 전과 후, 생각이 어떻게 바뀌었는지도 좋은 소재예요",
  "완벽한 문장이 아니어도 괜찮아요, 솔직한 감상이 제일이에요",
  "줄거리를 자세히 밝히고 싶다면 비공개로 남겨보세요",
];

export default function NewReviewForm({ feed = [] }: { feed?: FeedReview[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<BookSearchResult | null>(null);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/books/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data.results ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const visibleResults = query.trim() ? results : [];

  const recentFeed = (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "22px 0",
          marginTop: 44,
          borderTop: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
          borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 700 }}>최근 올라온 후기</span>
          <span style={monoLabel}>팔로우한 사람들의 감상</span>
        </div>
        <Link href="/shelf" style={{ ...monoLabel, textTransform: "uppercase", whiteSpace: "nowrap" }}>
          전체 보기 →
        </Link>
      </div>
      {feed.length === 0 ? (
        <p style={{ ...monoLabel, padding: "32px 0", textAlign: "center" }}>아직 올라온 후기가 없어요.</p>
      ) : (
        <div>
          {feed.map((post, i) => (
            <div
              key={post.id}
              style={{ display: "flex", gap: 20, padding: "22px 0", borderBottom: i < feed.length - 1 ? `1px solid ${PAPER.hair}` : "none" }}
            >
              {post.book.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.book.coverUrl}
                  alt={post.book.title}
                  style={{ width: 60, height: 86, objectFit: "cover", border: `1px solid ${PAPER.rule}`, flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: 60, height: 86, background: coverPattern(7), border: `1px solid ${PAPER.rule}`, flexShrink: 0 }} />
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 700, color: PAPER.rule }}>{post.book.title}</span>
                  {post.book.author && <span style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 12.5, color: "#57534A" }}>{post.book.author}</span>}
                  <LeafScore score={post.rating} className="text-xs" />
                </div>
                <p
                  style={{
                    fontFamily: "'IBM Plex Sans KR',sans-serif",
                    fontSize: 13.5,
                    lineHeight: 1.7,
                    color: "#3A362F",
                    margin: "0 0 8px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.content}
                </p>
                <Link href={`/u/${post.user.id}`} style={monoLabel}>
                  {post.user.name ?? "익명"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  if (!selected && !manualMode) {
    return (
      <div>
        <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Write</div>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: 30, fontWeight: 700, margin: "0 0 20px", letterSpacing: "-0.01em", color: PAPER.rule }}>
          어떤 책을 읽으셨나요?
        </h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="책 제목을 검색하세요"
            style={{ ...inputStyle, width: "100%" }}
            autoFocus
          />
        </form>
        {searching && <p style={{ ...monoLabel, marginTop: 12 }}>검색 중...</p>}

        <button
          type="button"
          onClick={() => setManualMode(true)}
          style={{ ...monoLabel, marginTop: 14, background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "underline" }}
        >
          검색 결과에 없나요? 직접 입력하기
        </button>

        <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18, padding: 0, listStyle: "none" }}>
          {visibleResults.map((book) => (
            <li key={book.externalId}>
              <button
                type="button"
                onClick={() => setSelected(book)}
                style={{
                  display: "flex",
                  width: "100%",
                  gap: 14,
                  border: `1px solid ${PAPER.hair}`,
                  background: PAPER.sheet,
                  padding: 12,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {book.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    style={{ width: 44, height: 60, objectFit: "cover", border: `1px solid ${PAPER.rule}`, flexShrink: 0 }}
                  />
                ) : (
                  <div style={{ width: 44, height: 60, background: coverPattern(6), border: `1px solid ${PAPER.rule}`, flexShrink: 0 }} />
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 700, color: PAPER.rule }}>{book.title}</div>
                  <div style={{ ...monoLabel, marginTop: 3 }}>
                    {book.author} {book.publisher ? `· ${book.publisher}` : ""}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {recentFeed}
      </div>
    );
  }

  const book: BookSearchResult = selected ?? {
    externalId: "",
    title: "",
    author: null,
    publisher: null,
    coverUrl: null,
    description: null,
    category: null,
    purchaseUrl: null,
  };

  return (
    <div>
      <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Write</div>
      <h1 style={{ fontFamily: FONT_SERIF, fontSize: 30, fontWeight: 700, margin: "0 0 24px", letterSpacing: "-0.01em", color: PAPER.rule }}>
        어떤 책을 읽으셨나요?
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.35fr 1fr",
          gap: 0,
          border: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
        }}
      >
        <form action={createReview} style={{ padding: "28px 28px 32px", borderRight: `1px solid ${PAPER.hair}` }}>
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setManualMode(false);
            }}
            style={{ ...monoLabel, background: "none", border: "none", padding: 0, marginBottom: 20, cursor: "pointer", textDecoration: "underline" }}
          >
            ← 다시 선택하기
          </button>

          {manualMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 22, marginBottom: 24, borderBottom: `1px solid ${PAPER.hair}` }}>
              <input name="title" required placeholder="책 제목" style={inputStyle} />
              <input name="author" placeholder="저자" style={inputStyle} />
              <input type="hidden" name="externalId" value="" />
              <input type="hidden" name="publisher" value="" />
              <input type="hidden" name="coverUrl" value="" />
              <input type="hidden" name="description" value="" />
              <input type="hidden" name="category" value="" />
              <input type="hidden" name="purchaseUrl" value="" />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 20, marginBottom: 24, borderBottom: `1px solid ${PAPER.hair}` }}>
              {book.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  style={{ width: 64, height: 92, objectFit: "cover", border: `1px solid ${PAPER.rule}`, flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: 64, height: 92, background: coverPattern(8), border: `1px solid ${PAPER.rule}`, flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...monoLabel, letterSpacing: "0.1em", marginBottom: 6 }}>선택한 책</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 700, lineHeight: 1.3, color: PAPER.rule }}>{book.title}</div>
                <div style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13, color: "#57534A", margin: "3px 0 8px" }}>{book.author}</div>
                <BuyButton url={book.purchaseUrl} />
              </div>
              <input type="hidden" name="title" value={book.title} />
              <input type="hidden" name="author" value={book.author ?? ""} />
              <input type="hidden" name="externalId" value={book.externalId} />
              <input type="hidden" name="publisher" value={book.publisher ?? ""} />
              <input type="hidden" name="coverUrl" value={book.coverUrl ?? ""} />
              <input type="hidden" name="description" value={book.description ?? ""} />
              <input type="hidden" name="category" value={book.category ?? ""} />
              <input type="hidden" name="purchaseUrl" value={book.purchaseUrl ?? ""} />
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <div style={{ ...monoLabel, letterSpacing: "0.12em", marginBottom: 10 }}>잎점수</div>
            <LeafScoreInput name="rating" defaultValue={5} />
          </div>

          <textarea
            name="content"
            required
            rows={7}
            placeholder="이 책에 대한 생각을 자유롭게 적어주세요."
            style={{ ...inputStyle, width: "100%", lineHeight: 1.8, resize: "vertical", marginBottom: 20 }}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13.5, color: "#3A362F", marginBottom: 22 }}>
            <input type="checkbox" name="isPublic" defaultChecked />
            다른 사람에게 공개하기
          </label>

          <SubmitButton pendingText="등록 중..." style={ctaButtonStyle}>
            후기 등록
          </SubmitButton>
        </form>

        <div style={{ padding: "28px 28px 32px", background: PAPER.bg }}>
          <div style={{ ...monoLabel, letterSpacing: "0.12em", marginBottom: 14 }}>작성 팁</div>
          {tips.map((tip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 0",
                borderBottom: i < tips.length - 1 ? `1px solid ${PAPER.hair}` : "none",
              }}
            >
              <span style={{ fontFamily: FONT_SERIF, fontSize: 14, fontWeight: 700, flexShrink: 0, color: PAPER.rule }}>0{i + 1}</span>
              <span style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13, lineHeight: 1.65, color: "#3A362F" }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {recentFeed}
    </div>
  );
}

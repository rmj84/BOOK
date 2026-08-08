"use client";

import { useEffect, useState } from "react";
import { createReview } from "@/lib/actions/reviews";
import type { BookSearchResult } from "@/lib/books";
import LeafScoreInput from "@/components/leaf-score-input";
import SubmitButton from "@/components/submit-button";

export default function NewReviewForm() {
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

  if (!selected && !manualMode) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">어떤 책을 읽으셨나요?</h1>
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="책 제목을 검색하세요"
            className="flex-1 rounded border border-leaf/25 px-3 py-2"
            autoFocus
          />
        </form>
        {searching && (
          <p className="text-sm text-ink/40">검색 중...</p>
        )}

        <button
          type="button"
          onClick={() => setManualMode(true)}
          className="text-sm text-ink/55 self-start underline"
        >
          검색 결과에 없나요? 직접 입력하기
        </button>

        <ul className="flex flex-col gap-2">
          {visibleResults.map((book) => (
            <li key={book.externalId}>
              <button
                type="button"
                onClick={() => setSelected(book)}
                className="flex w-full gap-3 rounded border border-leaf/20 bg-card p-3 text-left hover:border-leaf/50"
              >
                {book.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded shrink-0"
                  />
                ) : (
                  <div className="w-12 h-16 rounded bg-leaf-light shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="font-medium truncate">{book.title}</div>
                  <div className="text-sm text-ink/55 truncate">
                    {book.author} {book.publisher ? `· ${book.publisher}` : ""}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
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
    <form action={createReview} className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => {
          setSelected(null);
          setManualMode(false);
        }}
        className="text-sm text-ink/55 self-start underline"
      >
        ← 다시 선택하기
      </button>

      {manualMode ? (
        <div className="flex flex-col gap-2">
          <input
            name="title"
            required
            placeholder="책 제목"
            className="rounded border border-leaf/25 px-3 py-2"
          />
          <input
            name="author"
            placeholder="저자"
            className="rounded border border-leaf/25 px-3 py-2"
          />
          <input type="hidden" name="externalId" value="" />
          <input type="hidden" name="publisher" value="" />
          <input type="hidden" name="coverUrl" value="" />
          <input type="hidden" name="description" value="" />
          <input type="hidden" name="category" value="" />
          <input type="hidden" name="purchaseUrl" value="" />
        </div>
      ) : (
        <div className="flex gap-3 rounded border border-leaf/20 bg-card p-3">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-12 h-16 object-cover rounded shrink-0"
            />
          ) : (
            <div className="w-12 h-16 rounded bg-leaf-light shrink-0" />
          )}
          <div>
            <div className="font-medium">{book.title}</div>
            <div className="text-sm text-ink/55">{book.author}</div>
          </div>
          <input type="hidden" name="title" value={book.title} />
          <input type="hidden" name="author" value={book.author ?? ""} />
          <input type="hidden" name="externalId" value={book.externalId} />
          <input type="hidden" name="publisher" value={book.publisher ?? ""} />
          <input type="hidden" name="coverUrl" value={book.coverUrl ?? ""} />
          <input
            type="hidden"
            name="description"
            value={book.description ?? ""}
          />
          <input type="hidden" name="category" value={book.category ?? ""} />
          <input
            type="hidden"
            name="purchaseUrl"
            value={book.purchaseUrl ?? ""}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">잎점수</label>
        <LeafScoreInput name="rating" defaultValue={5} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">후기</label>

        <div className="mb-2 rounded border border-leaf/20 bg-leaf-light/60 px-3 py-2 text-xs text-ink/70">
          <p className="mb-1 font-medium text-ink/80">🍃 작성 팁</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>가장 기억에 남는 장면이나 문장을 적어보세요</li>
            <li>이 책을 누구에게 추천하고 싶은지 써보면 좋아요</li>
            <li>읽기 전과 후, 생각이 어떻게 바뀌었는지도 좋은 소재예요</li>
            <li>완벽한 문장이 아니어도 괜찮아요, 솔직한 감상이 제일이에요</li>
            <li>줄거리를 자세히 밝히고 싶다면 비공개로 남겨보세요</li>
          </ul>
        </div>

        <textarea
          name="content"
          required
          rows={6}
          className="w-full rounded border border-leaf/25 px-3 py-2"
          placeholder="이 책에 대한 생각을 자유롭게 적어주세요."
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublic" defaultChecked />
        다른 사람에게 공개하기
      </label>

      <SubmitButton
        pendingText="등록 중..."
        className="rounded bg-leaf hover:bg-leaf-dark text-white px-4 py-2.5 font-medium disabled:opacity-50"
      >
        후기 등록
      </SubmitButton>
    </form>
  );
}

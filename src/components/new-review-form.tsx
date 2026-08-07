"use client";

import { useEffect, useState } from "react";
import { createReview } from "@/lib/actions/reviews";
import type { BookSearchResult } from "@/lib/books";
import StarRatingInput from "@/components/star-rating-input";

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
            className="flex-1 rounded border border-neutral-300 px-3 py-2"
            autoFocus
          />
        </form>
        {searching && (
          <p className="text-sm text-neutral-400">검색 중...</p>
        )}

        <button
          type="button"
          onClick={() => setManualMode(true)}
          className="text-sm text-neutral-500 self-start underline"
        >
          검색 결과에 없나요? 직접 입력하기
        </button>

        <ul className="flex flex-col gap-2">
          {visibleResults.map((book) => (
            <li key={book.externalId}>
              <button
                type="button"
                onClick={() => setSelected(book)}
                className="flex w-full gap-3 rounded border border-neutral-200 bg-white p-3 text-left hover:border-neutral-400"
              >
                {book.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded shrink-0"
                  />
                ) : (
                  <div className="w-12 h-16 rounded bg-neutral-100 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="font-medium truncate">{book.title}</div>
                  <div className="text-sm text-neutral-500 truncate">
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
  };

  return (
    <form action={createReview} className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => {
          setSelected(null);
          setManualMode(false);
        }}
        className="text-sm text-neutral-500 self-start underline"
      >
        ← 다시 선택하기
      </button>

      {manualMode ? (
        <div className="flex flex-col gap-2">
          <input
            name="title"
            required
            placeholder="책 제목"
            className="rounded border border-neutral-300 px-3 py-2"
          />
          <input
            name="author"
            placeholder="저자"
            className="rounded border border-neutral-300 px-3 py-2"
          />
          <input type="hidden" name="externalId" value="" />
          <input type="hidden" name="publisher" value="" />
          <input type="hidden" name="coverUrl" value="" />
          <input type="hidden" name="description" value="" />
        </div>
      ) : (
        <div className="flex gap-3 rounded border border-neutral-200 bg-white p-3">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-12 h-16 object-cover rounded shrink-0"
            />
          ) : (
            <div className="w-12 h-16 rounded bg-neutral-100 shrink-0" />
          )}
          <div>
            <div className="font-medium">{book.title}</div>
            <div className="text-sm text-neutral-500">{book.author}</div>
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
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">별점</label>
        <StarRatingInput name="rating" defaultValue={5} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">후기</label>
        <textarea
          name="content"
          required
          rows={6}
          className="w-full rounded border border-neutral-300 px-3 py-2"
          placeholder="이 책에 대한 생각을 자유롭게 적어주세요."
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublic" defaultChecked />
        다른 사람에게 공개하기
      </label>

      <button
        type="submit"
        className="rounded bg-neutral-900 text-white px-4 py-2.5 font-medium"
      >
        후기 등록
      </button>
    </form>
  );
}

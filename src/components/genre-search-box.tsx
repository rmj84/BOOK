"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenreSearchBox({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/genres/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="장르/태그로 검색 (예: 한국소설)"
        className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded bg-neutral-900 text-white px-3 text-sm"
      >
        검색
      </button>
    </form>
  );
}

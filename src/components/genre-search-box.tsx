"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAPER } from "@/components/booklog-landing/theme";

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
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 0 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="장르/태그로 검색 (예: 한국소설)"
        style={{
          flex: 1,
          border: `1px solid ${PAPER.rule}`,
          borderRight: "none",
          background: PAPER.sheet,
          padding: "10px 14px",
          fontFamily: "'IBM Plex Sans KR',sans-serif",
          fontSize: 13.5,
          color: PAPER.rule,
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          background: PAPER.rule,
          color: PAPER.sheet,
          border: `1px solid ${PAPER.rule}`,
          padding: "0 20px",
          fontFamily: "'IBM Plex Sans KR',sans-serif",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        검색
      </button>
    </form>
  );
}

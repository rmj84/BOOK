"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toggleFollow } from "@/lib/actions/follow";
import SubmitButton from "@/components/submit-button";
import { SearchIcon } from "@/components/booklog-landing/icons";
import {
  FONT_SERIF,
  PAPER,
  RULE_WEIGHT,
  coverPattern,
  monoLabel,
  pillButtonStyle,
  shelfBookHeight,
} from "@/components/booklog-landing/theme";

export type ShelfPerson = {
  user: { id: string; name: string | null; image: string | null };
  reviewCount: number;
  bookCount: number;
  books: { id: string; title: string; coverUrl: string | null }[];
};

type Tab = "all" | "mine";

function matchesQuery(person: ShelfPerson, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if ((person.user.name ?? "익명").toLowerCase().includes(q)) return true;
  return person.books.some((b) => b.title.toLowerCase().includes(q));
}

export default function ShelfGrid({
  allShelves,
  myShelf,
  followingIds,
  viewerId,
}: {
  allShelves: ShelfPerson[];
  myShelf: ShelfPerson[];
  followingIds: string[];
  viewerId: string | null;
}) {
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");

  const followingSet = useMemo(() => new Set(followingIds), [followingIds]);

  const isMine = tab === "mine";
  const source = isMine ? myShelf : allShelves;
  const visible = source.filter((p) => matchesQuery(p, query));

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
        }}
      >
        <div>
          <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
            Shelves
          </div>
          <h1 style={{ fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
            {isMine ? "내 책장" : "모두의 책장"}
          </h1>
          <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13.5, color: "#3A362F", margin: "10px 0 0", maxWidth: 380 }}>
            {isMine
              ? "내가 읽고 기록한 책들이에요."
              : "아는 사람들의 책장을 구경하고, 팔로우해서 요즘 무슨 책 읽는지 지켜보세요."}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${PAPER.rule}`, padding: "9px 14px", minWidth: 220 }}>
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="책 제목, 사람 검색"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                width: "100%",
                fontFamily: "'DM Mono','IBM Plex Sans KR',monospace",
                fontSize: 12,
                color: PAPER.rule,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {[
              { key: "all" as Tab, label: "모두의 책장" },
              { key: "mine" as Tab, label: "내 책장" },
            ].map((t, i) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                style={{
                  ...pillButtonStyle(tab === t.key),
                  borderLeft: i === 1 ? "none" : undefined,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isMine && !viewerId ? (
        <p style={{ ...monoLabel, padding: "40px 0", textAlign: "center" }}>
          로그인하면 내 책장을 볼 수 있어요.
        </p>
      ) : visible.length === 0 ? (
        <p style={{ ...monoLabel, padding: "40px 0", textAlign: "center" }}>
          {query.trim() ? "검색 결과가 없어요." : "아직 꽂힌 책이 없어요."}
        </p>
      ) : (
        <div>
          {visible.map((person, idx) => {
            const isSelf = viewerId != null && person.user.id === viewerId;
            const following = followingSet.has(person.user.id);
            return (
              <div key={person.user.id} style={{ padding: "24px 0", borderBottom: idx < visible.length - 1 ? `1px solid ${PAPER.hair}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
                  <Link href={`/u/${person.user.id}`} style={{ display: "flex", alignItems: "center", gap: 12, color: PAPER.rule }}>
                    {person.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={person.user.image}
                        alt={person.user.name ?? ""}
                        style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: `1px solid ${PAPER.rule}`, flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: coverPattern(6), border: `1px solid ${PAPER.rule}`, flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontFamily: FONT_SERIF, fontSize: 17, fontWeight: 700, lineHeight: 1.25 }}>
                        {person.user.name ?? "익명"}의 책장
                      </div>
                      <div style={{ ...monoLabel, marginTop: 2 }}>
                        책 {person.bookCount}권 · 후기 {person.reviewCount}개
                      </div>
                    </div>
                  </Link>
                  {!isSelf && (
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <Link href={`/u/${person.user.id}`} style={{ ...monoLabel, whiteSpace: "nowrap" }}>
                        이 사람 책장 구경하기 →
                      </Link>
                      {viewerId && (
                        <form action={toggleFollow.bind(null, person.user.id)}>
                          <SubmitButton pendingText="처리 중..." style={pillButtonStyle(following)}>
                            {following ? "팔로잉" : "팔로우"}
                          </SubmitButton>
                        </form>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 14, minHeight: 112, padding: "0 2px" }}>
                  {person.books.map((bk, k) => {
                    const h = shelfBookHeight(idx, k);
                    const w = Math.round(h * 0.62);
                    return (
                      <Link key={bk.id} href={`/books/${bk.id}`} style={{ display: "flex", alignItems: "flex-end" }}>
                        {bk.coverUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={bk.coverUrl}
                            alt={bk.title}
                            style={{ width: w, height: h, objectFit: "cover", border: `1px solid ${PAPER.rule}` }}
                          />
                        ) : (
                          <div
                            style={{
                              width: w,
                              height: h,
                              background: coverPattern(7),
                              border: `1px solid ${PAPER.rule}`,
                              display: "flex",
                              alignItems: "flex-end",
                              padding: "7px 6px",
                              boxSizing: "border-box",
                            }}
                          >
                            <div style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 10, fontWeight: 600, lineHeight: 1.35, color: PAPER.rule, wordBreak: "keep-all" }}>
                              {bk.title}
                            </div>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
                <div style={{ height: 6, background: PAPER.rule, marginTop: 6 }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

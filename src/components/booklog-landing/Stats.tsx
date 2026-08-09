import { cardBase, cardShadow, FONT_BODY, FONT_HEAD, INK } from "./theme";

export type LandingStats = {
  reviewCount: number;
  avgRating: number;
  readerCount: number;
};

export function Stats({ stats }: { stats: LandingStats }) {
  const items = [
    { key: "reviews", value: stats.reviewCount.toLocaleString("ko-KR"), label: "기록된 후기" },
    { key: "rating", value: `${stats.avgRating.toFixed(1)}잎`, label: "평균 잎점수" },
    { key: "readers", value: stats.readerCount.toLocaleString("ko-KR"), label: "함께 읽는 사람" },
  ];

  return (
    <div
      style={{
        ...cardBase,
        borderRadius: 22,
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        ...cardShadow,
      }}
    >
      {items.map((s) => (
        <div key={s.key} style={{ textAlign: "center", padding: "20px 12px" }}>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 32, color: INK, lineHeight: 1.1 }}>
            {s.value}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#6E7D64", marginTop: 6 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

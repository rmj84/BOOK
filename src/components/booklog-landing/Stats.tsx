import { FONT_SERIF, PAPER, RULE_WEIGHT, monoLabel } from "./theme";

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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}` }}>
      {items.map((s, i) => (
        <div key={s.key} className="ed-px-32" style={{ padding: "26px 32px", borderRight: i < items.length - 1 ? `1px solid ${PAPER.hair}` : "none" }}>
          <div className="ed-stat-num" style={{ fontFamily: FONT_SERIF, fontSize: 34, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}>
            {s.value}
          </div>
          <div style={{ ...monoLabel, letterSpacing: "0.1em", marginTop: 9 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

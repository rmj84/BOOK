"use client";

import { useState } from "react";
import { tipsData } from "./data";
import { LeafIcon } from "./icons";
import { LeafMeter } from "./LeafMeter";
import { FONT_SERIF, PAPER, RULE_WEIGHT, monoLabel } from "./theme";

export function LeafScoreSection() {
  const [rating, setRating] = useState(4);

  return (
    <div
      id="leaf-score"
      className="ed-grid-1"
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
        scrollMarginTop: 88,
      }}
    >
      <div className="ed-px-32" style={{ padding: "44px 32px", borderRight: `1px solid ${PAPER.hair}` }}>
        <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>잎점수</div>
        <h2 className="ed-h2-lg" style={{ fontFamily: FONT_SERIF, fontSize: 38, lineHeight: 1.28, fontWeight: 700, margin: "0 0 16px", letterSpacing: "-0.015em" }}>
          별점 대신 잎점수예요
        </h2>
        <p style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 15, lineHeight: 1.78, color: "#3A362F", margin: "0 0 22px", maxWidth: 420 }}>
          0.5잎 단위로 솔직하게 매겨보세요. 후기 한 줄만 남겨도 책장에 잎이 하나 꽂혀요.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LeafMeter rating={rating} size={34} gap={6} onRate={setRating} />
          <span style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 700, marginLeft: 4 }}>{rating}잎</span>
        </div>
      </div>
      <div className="ed-px-32" style={{ padding: "44px 32px", display: "flex", flexDirection: "column" }}>
        <div style={{ ...monoLabel, letterSpacing: "0.12em", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <LeafIcon />
          작성 팁
        </div>
        {tipsData.map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < tipsData.length - 1 ? `1px solid ${PAPER.hair}` : "none" }}>
            <span style={{ fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 700, flexShrink: 0 }}>0{i + 1}</span>
            <span style={{ fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13.5, lineHeight: 1.7, color: "#3A362F" }}>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

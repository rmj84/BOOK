"use client";

import { useState } from "react";
import { tipsData } from "./data";
import { LeafMeter } from "./LeafMeter";
import { cardBase, cardShadow, FONT_BODY, FONT_DISPLAY, FONT_HEAD, INK } from "./theme";

export function LeafScoreSection() {
  const [rating, setRating] = useState(4);

  return (
    <div
      id="leaf-score"
      style={{
        marginTop: 76,
        ...cardBase,
        borderRadius: 28,
        padding: "44px 40px",
        display: "flex",
        gap: 48,
        justifyContent: "space-between",
        flexWrap: "wrap",
        ...cardShadow,
        scrollMarginTop: 88,
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: "#3E9B6B",
            marginBottom: 14,
          }}
        >
          잎점수
        </div>
        <h2 style={{ fontFamily: FONT_HEAD, fontSize: 38, lineHeight: 1.28, color: INK, margin: "0 0 14px", letterSpacing: "-0.01em" }}>
          별점 대신 잎점수예요
        </h2>
        <p style={{ fontFamily: FONT_BODY, fontSize: 15.5, lineHeight: 1.75, color: "#47563E", margin: "0 0 24px" }}>
          0.5잎 단위로 솔직하게 매겨보세요. 후기 한 줄만 남겨도 책장에 잎이 하나 꽂혀요.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LeafMeter rating={rating} size={38} gap={8} onRate={setRating} />
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: INK, marginLeft: 8 }}>
            {rating}잎
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 280 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: INK, marginBottom: 2 }}>
          🍃 작성 팁
        </div>
        {tipsData.map((tip, i) => (
          <div
            key={i}
            style={{
              background: "rgba(62,155,107,0.1)",
              borderRadius: 12,
              padding: "12px 14px",
              fontFamily: FONT_BODY,
              fontSize: 13,
              lineHeight: 1.6,
              color: "#3B4A34",
              maxWidth: 320,
            }}
          >
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}

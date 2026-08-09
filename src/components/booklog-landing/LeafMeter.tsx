"use client";

import type { MouseEvent } from "react";
import { ACCENT, PAPER, leaves } from "./theme";

const LEAF_PATH =
  "M12 2.2C9.2 5.8 4.6 9.4 4.6 13.5c0 3.9 3.3 6.7 7.4 7.2 4.1-.5 7.4-3.3 7.4-7.2 0-4.1-4.6-7.7-7.4-11.3z";
const LEAF_VEINS = "M12 5.4v15.3M12 12.2l3.4-2.4M12 15.6l3.9-2.7M12 12.2L8.6 9.8M12 15.6l-4-2.7";
const LEAF_SPINE = "M12 5.4v15.3";

/** Leaf-vein rating meter (1a 에디토리얼 style). Read-only unless onRate is passed. */
export function LeafMeter({
  rating,
  size,
  gap = 3,
  onRate,
}: {
  rating: number;
  size: number;
  gap?: number;
  onRate?: (rating: number) => void;
}) {
  const showVeins = size >= 20;

  return (
    <div style={{ display: "flex", alignItems: "center", gap }}>
      {leaves(rating).map((lf) => (
        <div
          key={lf.key}
          onClick={
            onRate
              ? (e: MouseEvent<HTMLDivElement>) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const half = e.clientX - r.left < r.width / 2;
                  onRate(Math.max(0.5, Math.min(5, lf.key + (half ? 0.5 : 1))));
                }
              : undefined
          }
          style={{
            position: "relative",
            width: size,
            height: size,
            cursor: onRate ? "pointer" : undefined,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={PAPER.hair}
            strokeWidth={showVeins ? 1.3 : 1.6}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <path d={LEAF_PATH} />
            {showVeins && <path d={LEAF_SPINE} />}
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              width: `${lf.pct}%`,
              pointerEvents: onRate ? "none" : undefined,
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
              <path d={LEAF_PATH} fill={ACCENT} />
              {showVeins && (
                <path d={LEAF_VEINS} fill="none" stroke={PAPER.sheet} strokeWidth={1.1} strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

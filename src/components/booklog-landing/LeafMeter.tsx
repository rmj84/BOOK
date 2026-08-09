"use client";

import type { MouseEvent } from "react";
import { LEAF } from "./theme";

function LeafOutline({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#B6CDA9"
      strokeWidth="1.8"
      style={{ position: "absolute", inset: 0, width: size, height: size }}
    >
      <path
        d="M12 2.2C9.2 5.8 4.6 9.4 4.6 13.5c0 3.9 3.3 6.7 7.4 7.2 4.1-.5 7.4-3.3 7.4-7.2 0-4.1-4.6-7.7-7.4-11.3z"
        strokeLinejoin="round"
      />
      <path d="M12 20.7v2.4" strokeLinecap="round" />
      <path
        d="M12 5.2v15.5M12 10.2c-1.4 1.2-2.8 1.9-4.4 2.4M12 10.2c1.4 1.2 2.8 1.9 4.4 2.4M12 14.7c-1.3 1.1-2.5 1.8-4 2.2M12 14.7c1.3 1.1 2.5 1.8 4 2.2"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

function LeafFilled({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" fill={LEAF} style={{ width: size, height: size }}>
      <path d="M12 2.2C9.2 5.8 4.6 9.4 4.6 13.5c0 3.9 3.3 6.7 7.4 7.2 4.1-.5 7.4-3.3 7.4-7.2 0-4.1-4.6-7.7-7.4-11.3z" />
      <path
        d="M12 20.7v2.4"
        fill="none"
        stroke={LEAF}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 5.2v15.5M12 10.2c-1.4 1.2-2.8 1.9-4.4 2.4M12 10.2c1.4 1.2 2.8 1.9 4.4 2.4M12 14.7c-1.3 1.1-2.5 1.8-4 2.2M12 14.7c1.3 1.1 2.5 1.8 4 2.2"
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  const slots = [0, 1, 2, 3, 4].map((i) => ({
    key: i,
    pct: Math.max(0, Math.min(1, rating - i)) * 100,
  }));

  return (
    <div style={{ display: "flex", gap }}>
      {slots.map((lf) => (
        <div
          key={lf.key}
          onClick={
            onRate
              ? (e: MouseEvent<HTMLDivElement>) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const half = e.clientX - r.left < r.width / 2;
                  onRate(
                    Math.max(0.5, Math.min(5, lf.key + (half ? 0.5 : 1)))
                  );
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
          <LeafOutline size={size} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              width: `${lf.pct}%`,
              pointerEvents: onRate ? "none" : undefined,
            }}
          >
            <LeafFilled size={size} />
          </div>
        </div>
      ))}
    </div>
  );
}

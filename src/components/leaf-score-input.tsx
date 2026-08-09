"use client";

import { useState } from "react";
import LeafIcon from "@/components/leaf-icon";
import { ACCENT, FONT_SERIF, PAPER } from "@/components/booklog-landing/theme";

export default function LeafScoreInput({
  name,
  defaultValue = 5,
}: {
  name: string;
  defaultValue?: number;
}) {
  const [score, setScore] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? score;
  const pct = `${(Math.max(0, Math.min(5, display)) / 5) * 100}%`;

  return (
    <div className="inline-flex flex-col gap-2">
      <span className="relative inline-flex select-none text-4xl leading-none" style={{ color: PAPER.hair }}>
        <span className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <LeafIcon key={i} className="h-[1em] w-[1em]" />
          ))}
        </span>
        <span
          className="absolute inset-0 flex gap-1 overflow-hidden"
          style={{ width: pct, color: ACCENT }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <LeafIcon key={i} className="h-[1em] w-[1em]" />
          ))}
        </span>
        <span className="absolute inset-0 flex gap-1" onMouseLeave={() => setHover(null)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="relative flex-1">
              <button
                type="button"
                aria-label={`${i - 0.5}잎`}
                className="absolute inset-y-0 left-0 w-1/2"
                onMouseEnter={() => setHover(i - 0.5)}
                onClick={() => setScore(i - 0.5)}
              />
              <button
                type="button"
                aria-label={`${i}잎`}
                className="absolute inset-y-0 right-0 w-1/2"
                onMouseEnter={() => setHover(i)}
                onClick={() => setScore(i)}
              />
            </span>
          ))}
        </span>
      </span>
      <span style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700, color: PAPER.rule }}>{score}잎</span>
      <input type="hidden" name={name} value={score} />
    </div>
  );
}

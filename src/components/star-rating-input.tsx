"use client";

import { useState } from "react";

export default function StarRatingInput({
  name,
  defaultValue = 5,
}: {
  name: string;
  defaultValue?: number;
}) {
  const [rating, setRating] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? rating;
  const pct = `${(Math.max(0, Math.min(5, display)) / 5) * 100}%`;

  return (
    <div className="inline-flex flex-col gap-1">
      <span className="relative inline-block select-none text-3xl leading-none text-neutral-300">
        ★★★★★
        <span
          className="absolute inset-0 overflow-hidden text-amber-500"
          style={{ width: pct }}
        >
          ★★★★★
        </span>
        <span className="absolute inset-0 flex" onMouseLeave={() => setHover(null)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="relative flex-1">
              <button
                type="button"
                aria-label={`${i - 0.5}점`}
                className="absolute inset-y-0 left-0 w-1/2"
                onMouseEnter={() => setHover(i - 0.5)}
                onClick={() => setRating(i - 0.5)}
              />
              <button
                type="button"
                aria-label={`${i}점`}
                className="absolute inset-y-0 right-0 w-1/2"
                onMouseEnter={() => setHover(i)}
                onClick={() => setRating(i)}
              />
            </span>
          ))}
        </span>
      </span>
      <span className="text-sm text-neutral-500">{rating}점</span>
      <input type="hidden" name={name} value={rating} />
    </div>
  );
}

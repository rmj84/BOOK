export default function StarRating({
  rating,
  className = "text-sm",
}: {
  rating: number;
  className?: string;
}) {
  const pct = `${(Math.max(0, Math.min(5, rating)) / 5) * 100}%`;

  return (
    <span
      aria-label={`평점 ${rating}점`}
      className={`relative inline-block select-none text-neutral-300 ${className}`}
    >
      ★★★★★
      <span
        className="absolute inset-0 overflow-hidden text-amber-500"
        style={{ width: pct }}
      >
        ★★★★★
      </span>
    </span>
  );
}

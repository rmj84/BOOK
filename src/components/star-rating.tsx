export default function StarRating({ rating }: { rating: number }) {
  return (
    <span aria-label={`평점 ${rating}점`} className="text-amber-500 text-sm">
      {"★".repeat(rating)}
      <span className="text-neutral-300">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

import LeafIcon from "@/components/leaf-icon";
import { ACCENT, PAPER } from "@/components/booklog-landing/theme";

export default function LeafScore({
  score,
  className = "text-sm",
}: {
  score: number;
  className?: string;
}) {
  const pct = `${(Math.max(0, Math.min(5, score)) / 5) * 100}%`;

  return (
    <span
      aria-label={`잎점수 ${score}잎`}
      className={`relative inline-flex select-none ${className}`}
      style={{ color: PAPER.hair }}
    >
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <LeafIcon key={i} className="h-[1em] w-[1em]" showVeins={false} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden"
        style={{ width: pct, color: ACCENT }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <LeafIcon key={i} className="h-[1em] w-[1em]" showVeins={false} />
        ))}
      </span>
    </span>
  );
}

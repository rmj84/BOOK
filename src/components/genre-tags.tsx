import Link from "next/link";
import { FONT_MONO, PAPER } from "@/components/booklog-landing/theme";

export default function GenreTags({ category }: { category: string | null }) {
  if (!category) return null;

  const segments = category
    .split(">")
    .map((s) => s.trim())
    .filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {segments.map((segment) => (
        <Link
          key={segment}
          href={`/genres/${encodeURIComponent(segment)}`}
          style={{
            border: `1px solid ${PAPER.rule}`,
            padding: "5px 12px",
            fontFamily: FONT_MONO,
            fontSize: 11,
            letterSpacing: "0.06em",
            color: PAPER.rule,
            whiteSpace: "nowrap",
          }}
        >
          #{segment}
        </Link>
      ))}
    </div>
  );
}

import Link from "next/link";

export default function GenreTags({ category }: { category: string | null }) {
  if (!category) return null;

  const segments = category
    .split(">")
    .map((s) => s.trim())
    .filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {segments.map((segment) => (
        <Link
          key={segment}
          href={`/genres/${encodeURIComponent(segment)}`}
          className="rounded-full bg-leaf-light px-2.5 py-1 text-xs text-ink/70 hover:bg-leaf/25"
        >
          #{segment}
        </Link>
      ))}
    </div>
  );
}

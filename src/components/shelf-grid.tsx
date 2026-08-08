import Link from "next/link";

type ShelfReview = {
  id: string;
  rating: number;
  book: { title: string; coverUrl: string | null };
  user: { id: string; name: string | null };
};

const COLUMNS = 3;

export default function ShelfGrid({ reviews }: { reviews: ShelfReview[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-neutral-500 text-sm py-10 text-center">
        아직 꽂힌 책이 없어요.
      </p>
    );
  }

  const rows: ShelfReview[][] = [];
  for (let i = 0; i < reviews.length; i += COLUMNS) {
    rows.push(reviews.slice(i, i + COLUMNS));
  }

  return (
    <div className="rounded-lg border border-[#e2d5bf] bg-[#faf6ee] px-2 pt-1">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex}>
          <div className="grid grid-cols-3 items-end divide-x divide-[#e2d5bf] pt-3">
            {row.map((review, i) => (
              <Link
                key={review.id}
                href={`/reviews/${review.id}`}
                title={`${review.book.title} · ${review.user.name ?? "익명"}`}
                className="relative block px-2"
                style={{
                  transform: `rotate(${i % 2 === 0 ? -0.6 : 0.6}deg)`,
                }}
              >
                {review.book.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={review.book.coverUrl}
                    alt={review.book.title}
                    className="w-full aspect-[2/3] object-cover rounded-t-[2px] rounded-b-[1px] shadow-[2px_4px_6px_rgba(0,0,0,0.25)]"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] rounded-t-[2px] rounded-b-[1px] bg-neutral-200 shadow-[2px_4px_6px_rgba(0,0,0,0.25)] flex items-center justify-center px-1 text-center text-[10px] text-neutral-500">
                    {review.book.title}
                  </div>
                )}
                <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  ★ {review.rating}
                </span>
              </Link>
            ))}
          </div>
          {/* 원목 선반 널빤지 */}
          <div className="mt-0 h-3 rounded-[1px] bg-gradient-to-b from-[#ddbd8f] to-[#b4875a] shadow-[0_3px_5px_rgba(0,0,0,0.25)]" />
        </div>
      ))}
    </div>
  );
}

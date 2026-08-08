import Link from "next/link";

type ShelfReview = {
  id: string;
  rating: number;
  book: { title: string; coverUrl: string | null };
  user: { id: string; name: string | null };
};

export default function ShelfGrid({ reviews }: { reviews: ShelfReview[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-neutral-500 text-sm py-10 text-center">
        아직 꽂힌 책이 없어요.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-4">
      {reviews.map((review) => (
        <Link
          key={review.id}
          href={`/reviews/${review.id}`}
          className="flex flex-col gap-1"
        >
          <div className="relative">
            {review.book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.book.coverUrl}
                alt={review.book.title}
                className="w-full aspect-[2/3] object-cover rounded border border-neutral-200 bg-white shadow-sm"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded border border-neutral-200 bg-neutral-100 flex items-center justify-center px-1 text-center text-[11px] text-neutral-400">
                {review.book.title}
              </div>
            )}
            <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
              ★ {review.rating}
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 truncate">
            {review.user.name ?? "익명"}
          </div>
        </Link>
      ))}
    </div>
  );
}

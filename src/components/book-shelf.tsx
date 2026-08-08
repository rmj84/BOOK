import Link from "next/link";

type ShelfBook = {
  id: string;
  title: string;
  coverUrl: string | null;
  avgRating?: number;
  reviewCount?: number;
};

export default function BookShelf({
  title,
  books,
}: {
  title: string;
  books: ShelfBook[];
}) {
  if (books.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
        {books.map((book) => (
          <Link key={book.id} href={`/books/${book.id}`} className="w-28 shrink-0">
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-28 h-40 object-cover rounded border border-leaf/20 bg-card"
              />
            ) : (
              <div className="w-28 h-40 rounded border border-leaf/20 bg-leaf-light" />
            )}
            <div className="mt-1 text-xs font-medium line-clamp-2">
              {book.title}
            </div>
            {book.avgRating !== undefined && (
              <div className="text-xs text-leaf-dark">
                🍃 {book.avgRating.toFixed(1)}
              </div>
            )}
            {book.reviewCount !== undefined && (
              <div className="text-xs text-ink/40">
                후기 {book.reviewCount}개
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

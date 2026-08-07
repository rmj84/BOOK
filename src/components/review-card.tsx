import Link from "next/link";
import StarRating from "@/components/star-rating";

type ReviewCardProps = {
  id: string;
  rating: number;
  content: string;
  createdAt: Date;
  book: { title: string; author: string | null; coverUrl: string | null };
  user: { id: string; name: string | null; image: string | null };
};

export default function ReviewCard({
  id,
  rating,
  content,
  createdAt,
  book,
  user,
}: ReviewCardProps) {
  return (
    <article className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      {book.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-16 h-24 object-cover rounded shrink-0"
        />
      ) : (
        <div className="w-16 h-24 rounded bg-neutral-100 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-xs text-neutral-500">
          {book.title}
          {book.author ? ` · ${book.author}` : ""}
        </div>
        <StarRating rating={rating} />
        <p className="mt-1 text-sm text-neutral-800 line-clamp-3">{content}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          <Link href={`/u/${user.id}`} className="font-medium text-neutral-700">
            {user.name ?? "익명"}
          </Link>
          <span>·</span>
          <Link href={`/reviews/${id}`}>
            {createdAt.toLocaleDateString("ko-KR")}
          </Link>
        </div>
      </div>
    </article>
  );
}

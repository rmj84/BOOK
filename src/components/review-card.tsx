import Link from "next/link";
import LeafScore from "@/components/leaf-score";

type ReviewCardProps = {
  id: string;
  rating: number;
  content: string;
  createdAt: Date;
  book: {
    id: string;
    title: string;
    author: string | null;
    coverUrl: string | null;
  };
  user: { id: string; name: string | null; image: string | null };
  likeCount?: number;
  commentCount?: number;
};

export default function ReviewCard({
  id,
  rating,
  content,
  createdAt,
  book,
  user,
  likeCount = 0,
  commentCount = 0,
}: ReviewCardProps) {
  return (
    <article className="flex gap-4 rounded-lg border border-leaf/20 bg-card p-4">
      {book.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-16 h-24 object-cover rounded shrink-0"
        />
      ) : (
        <div className="w-16 h-24 rounded bg-leaf-light shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <Link
          href={`/books/${book.id}`}
          className="text-xs text-ink/55 hover:underline"
        >
          {book.title}
          {book.author ? ` · ${book.author}` : ""}
        </Link>
        <LeafScore score={rating} />
        <p className="mt-1 text-sm text-ink line-clamp-3">{content}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-ink/55">
          <Link href={`/u/${user.id}`} className="font-medium text-ink">
            {user.name ?? "익명"}
          </Link>
          <span>·</span>
          <Link href={`/reviews/${id}`}>
            {createdAt.toLocaleDateString("ko-KR")}
          </Link>
          <span>·</span>
          <Link href={`/reviews/${id}`} className="text-ink/40">
            ♥ {likeCount} · 💬 {commentCount}
          </Link>
        </div>
      </div>
    </article>
  );
}

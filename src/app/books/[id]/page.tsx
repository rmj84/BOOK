import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewCard from "@/components/review-card";
import StarRating from "@/components/star-rating";

type Params = { params: Promise<{ id: string }> };

export default async function BookDetailPage({ params }: Params) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const reviews = await prisma.review.findMany({
    where: userId
      ? { bookId: id, OR: [{ isPublic: true }, { userId }] }
      : { bookId: id, isPublic: true },
    orderBy: { createdAt: "desc" },
    include: {
      book: true,
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-28 h-40 object-cover rounded shrink-0"
          />
        ) : (
          <div className="w-28 h-40 rounded bg-neutral-100 shrink-0" />
        )}
        <div>
          <h1 className="text-xl font-semibold">{book.title}</h1>
          <p className="text-neutral-500">
            {book.author}
            {book.publisher ? ` · ${book.publisher}` : ""}
          </p>
          {reviews.length > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={avgRating} />
              <span className="text-sm text-neutral-500">
                {avgRating.toFixed(1)} ({reviews.length}명)
              </span>
            </div>
          )}
        </div>
      </div>

      {book.description && (
        <p className="text-sm text-neutral-600 whitespace-pre-wrap">
          {book.description}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">후기 {reviews.length}개</h2>
        {reviews.length === 0 && (
          <p className="text-neutral-500 text-sm py-6 text-center">
            아직 이 책에 대한 후기가 없어요.
          </p>
        )}
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            id={review.id}
            rating={review.rating}
            content={review.content}
            createdAt={review.createdAt}
            book={review.book}
            user={review.user}
            likeCount={review._count.likes}
            commentCount={review._count.comments}
          />
        ))}
      </div>
    </div>
  );
}

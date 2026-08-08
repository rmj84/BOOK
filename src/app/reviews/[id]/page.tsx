import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/star-rating";
import { deleteReview } from "@/lib/actions/reviews";
import { toggleLike } from "@/lib/actions/likes";
import { addComment, deleteComment } from "@/lib/actions/comments";
import SubmitButton from "@/components/submit-button";
import BuyButton from "@/components/buy-button";

type Params = { params: Promise<{ id: string }> };

async function getReview(id: string) {
  return prisma.review.findUnique({
    where: { id },
    include: {
      book: true,
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) return {};

  const title = `${review.book.title} - ${review.user.name ?? "익명"}의 후기`;
  const description = review.content.slice(0, 100);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: review.book.coverUrl ? [review.book.coverUrl] : [],
    },
  };
}

export default async function ReviewDetailPage({ params }: Params) {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) notFound();

  const session = await auth();
  const viewerId = session?.user?.id;
  const isOwner = viewerId === review.userId;

  if (!review.isPublic && !isOwner) notFound();

  const [isLiked, comments] = await Promise.all([
    viewerId
      ? prisma.like
          .findUnique({
            where: { userId_reviewId: { userId: viewerId, reviewId: id } },
          })
          .then(Boolean)
      : Promise.resolve(false),
    prisma.comment.findMany({
      where: { reviewId: id },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { id: true, name: true, image: true } } },
    }),
  ]);

  return (
    <article className="flex flex-col gap-4">
      <div className="flex gap-4">
        {review.book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.book.coverUrl}
            alt={review.book.title}
            className="w-24 h-36 object-cover rounded shrink-0"
          />
        ) : (
          <div className="w-24 h-36 rounded bg-neutral-100 shrink-0" />
        )}
        <div>
          <Link href={`/books/${review.book.id}`} className="hover:underline">
            <h1 className="text-xl font-semibold">{review.book.title}</h1>
          </Link>
          <p className="text-neutral-500">{review.book.author}</p>
          <StarRating rating={review.rating} />
          <div className="mt-2">
            <BuyButton url={review.book.purchaseUrl} />
          </div>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-neutral-800">{review.content}</p>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <Link href={`/u/${review.user.id}`} className="font-medium text-neutral-700">
          {review.user.name ?? "익명"}
        </Link>
        <span>{review.createdAt.toLocaleDateString("ko-KR")}</span>
      </div>

      <div className="flex items-center gap-3">
        <form action={toggleLike.bind(null, review.id)}>
          <SubmitButton
            pendingText="처리 중..."
            className={
              isLiked
                ? "rounded border border-red-300 bg-red-50 text-red-600 px-3 py-1.5 text-sm disabled:opacity-50"
                : "rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-50"
            }
          >
            {isLiked ? "♥" : "♡"} 좋아요 {review._count.likes}
          </SubmitButton>
        </form>

        {isOwner && (
          <>
            <Link
              href={`/reviews/${review.id}/edit`}
              className="text-sm rounded border border-neutral-300 px-3 py-1.5"
            >
              수정
            </Link>
            <form action={deleteReview.bind(null, review.id)}>
              <SubmitButton
                pendingText="삭제 중..."
                className="text-sm rounded border border-red-300 text-red-600 px-3 py-1.5 disabled:opacity-50"
              >
                삭제
              </SubmitButton>
            </form>
          </>
        )}
      </div>

      <section className="flex flex-col gap-3 pt-4 border-t border-neutral-200">
        <h2 className="text-sm font-semibold">댓글 {comments.length}개</h2>

        {viewerId && (
          <form
            action={addComment.bind(null, review.id)}
            className="flex gap-2"
          >
            <input
              name="content"
              required
              placeholder="댓글을 남겨보세요"
              className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm"
            />
            <SubmitButton
              pendingText="등록 중..."
              className="rounded bg-neutral-900 text-white px-3 text-sm disabled:opacity-50"
            >
              등록
            </SubmitButton>
          </form>
        )}

        <ul className="flex flex-col gap-3">
          {comments.map((comment) => (
            <li key={comment.id} className="text-sm">
              <div className="flex items-center gap-2">
                <Link
                  href={`/u/${comment.user.id}`}
                  className="font-medium text-neutral-700"
                >
                  {comment.user.name ?? "익명"}
                </Link>
                <span className="text-xs text-neutral-400">
                  {comment.createdAt.toLocaleDateString("ko-KR")}
                </span>
                {viewerId === comment.userId && (
                  <form action={deleteComment.bind(null, comment.id)}>
                    <SubmitButton
                      pendingText="삭제 중..."
                      className="text-xs text-red-500 disabled:opacity-50"
                    >
                      삭제
                    </SubmitButton>
                  </form>
                )}
              </div>
              <p className="text-neutral-800">{comment.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

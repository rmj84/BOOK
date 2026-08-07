import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/star-rating";
import { deleteReview } from "@/lib/actions/reviews";

type Params = { params: Promise<{ id: string }> };

async function getReview(id: string) {
  return prisma.review.findUnique({
    where: { id },
    include: {
      book: true,
      user: { select: { id: true, name: true, image: true } },
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
  const isOwner = session?.user?.id === review.userId;

  if (!review.isPublic && !isOwner) notFound();

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
          <h1 className="text-xl font-semibold">{review.book.title}</h1>
          <p className="text-neutral-500">{review.book.author}</p>
          <StarRating rating={review.rating} />
        </div>
      </div>

      <p className="whitespace-pre-wrap text-neutral-800">{review.content}</p>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <Link href={`/u/${review.user.id}`} className="font-medium text-neutral-700">
          {review.user.name ?? "익명"}
        </Link>
        <span>{review.createdAt.toLocaleDateString("ko-KR")}</span>
      </div>

      {isOwner && (
        <div className="flex gap-3 pt-2">
          <Link
            href={`/reviews/${review.id}/edit`}
            className="text-sm rounded border border-neutral-300 px-3 py-1.5"
          >
            수정
          </Link>
          <form action={deleteReview.bind(null, review.id)}>
            <button
              type="submit"
              className="text-sm rounded border border-red-300 text-red-600 px-3 py-1.5"
            >
              삭제
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

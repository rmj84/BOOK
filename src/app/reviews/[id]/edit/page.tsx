import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateReview } from "@/lib/actions/reviews";
import StarRatingInput from "@/components/star-rating-input";

type Params = { params: Promise<{ id: string }> };

export default async function EditReviewPage({ params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const review = await prisma.review.findUnique({
    where: { id },
    include: { book: true },
  });
  if (!review) notFound();
  if (review.userId !== session.user.id) redirect(`/reviews/${id}`);

  const updateWithId = updateReview.bind(null, id);

  return (
    <form action={updateWithId} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{review.book.title} 후기 수정</h1>

      <div>
        <label className="block text-sm font-medium mb-1">별점</label>
        <StarRatingInput name="rating" defaultValue={review.rating} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">후기</label>
        <textarea
          name="content"
          required
          rows={6}
          defaultValue={review.content}
          className="w-full rounded border border-neutral-300 px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked={review.isPublic}
        />
        다른 사람에게 공개하기
      </label>

      <button
        type="submit"
        className="rounded bg-neutral-900 text-white px-4 py-2.5 font-medium"
      >
        저장
      </button>
    </form>
  );
}

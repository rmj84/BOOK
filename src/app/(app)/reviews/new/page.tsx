import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NewReviewForm from "@/components/new-review-form";

export default async function NewReviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const follows = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    select: { followingId: true },
  });
  const followingIds = follows.map((f) => f.followingId);

  const feed = await prisma.review.findMany({
    where:
      followingIds.length > 0
        ? { userId: { in: followingIds }, isPublic: true }
        : { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      rating: true,
      content: true,
      createdAt: true,
      book: { select: { title: true, author: true, coverUrl: true } },
      user: { select: { id: true, name: true } },
    },
  });

  return <NewReviewForm feed={feed} />;
}

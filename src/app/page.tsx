import { auth } from "@/lib/auth";
import { getBookShelves, getFeaturedShelves, getLandingStats } from "@/lib/book-stats";
import { AnonymousLanding } from "@/components/booklog-landing/AnonymousLanding";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  const [{ trending, recommended }, stats, shelves] = await Promise.all([
    getBookShelves(),
    getLandingStats(),
    getFeaturedShelves(),
  ]);

  const top = [...recommended].sort((a, b) => b.avgRating - a.avgRating)[0] ?? null;

  return (
    <AnonymousLanding
      topBook={top ? { title: top.title, author: top.author, rating: top.avgRating } : null}
      stats={stats}
      recommended={recommended}
      trending={trending}
      shelves={shelves}
      user={session?.user ?? null}
    />
  );
}

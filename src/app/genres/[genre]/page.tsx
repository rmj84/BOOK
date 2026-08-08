import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GenreSearchBox from "@/components/genre-search-box";

type Params = { params: Promise<{ genre: string }> };

export default async function GenrePage({ params }: Params) {
  const { genre } = await params;

  const books = await prisma.book.findMany({
    where: { category: { contains: genre, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">#{genre}</h1>
      <GenreSearchBox defaultValue={genre} />

      {books.length === 0 && (
        <p className="text-ink/55 text-sm py-10 text-center">
          이 태그로 등록된 책이 아직 없어요.
        </p>
      )}

      <div className="grid grid-cols-3 gap-3">
        {books.map((book) => (
          <Link key={book.id} href={`/books/${book.id}`}>
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full aspect-[2/3] object-cover rounded border border-leaf/20 bg-card"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded border border-leaf/20 bg-leaf-light" />
            )}
            <div className="mt-1 text-xs font-medium line-clamp-2">
              {book.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

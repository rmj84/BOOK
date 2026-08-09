import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GenreSearchBox from "@/components/genre-search-box";
import { FONT_SERIF, PAPER, RULE_WEIGHT, coverPattern, monoLabel } from "@/components/booklog-landing/theme";

type Params = { params: Promise<{ genre: string }> };

export default async function GenrePage({ params }: Params) {
  const { genre: rawGenre } = await params;
  const genre = decodeURIComponent(rawGenre);

  const books = await prisma.book.findMany({
    where: { category: { contains: genre, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `${RULE_WEIGHT}px solid ${PAPER.rule}` }}>
        <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Genre</div>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 700, margin: "0 0 18px", color: PAPER.rule, wordBreak: "keep-all" }}>
          #{genre}
        </h1>
        <GenreSearchBox defaultValue={genre} />
      </div>

      {books.length === 0 && (
        <p style={{ ...monoLabel, padding: "40px 0", textAlign: "center" }}>이 태그로 등록된 책이 아직 없어요.</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, borderTop: `1px solid ${PAPER.hair}`, borderLeft: `1px solid ${PAPER.hair}` }}>
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            style={{
              padding: "16px 14px",
              borderRight: `1px solid ${PAPER.hair}`,
              borderBottom: `1px solid ${PAPER.hair}`,
              display: "block",
              color: PAPER.rule,
            }}
          >
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverUrl}
                alt={book.title}
                style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", border: `1px solid ${PAPER.rule}`, marginBottom: 10 }}
              />
            ) : (
              <div style={{ aspectRatio: "2/3", background: coverPattern(7), border: `1px solid ${PAPER.rule}`, marginBottom: 10 }} />
            )}
            <div
              style={{
                fontFamily: "'IBM Plex Sans KR',sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {book.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

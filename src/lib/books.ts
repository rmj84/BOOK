export type BookSearchResult = {
  externalId: string;
  title: string;
  author: string | null;
  publisher: string | null;
  coverUrl: string | null;
  description: string | null;
  category: string | null;
};

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "");
}

async function searchAladin(query: string): Promise<BookSearchResult[]> {
  const ttbKey = process.env.ALADIN_TTB_KEY;
  if (!ttbKey) return [];

  const url = new URL("http://www.aladin.co.kr/ttb/api/ItemSearch.aspx");
  url.searchParams.set("ttbkey", ttbKey);
  url.searchParams.set("Query", query);
  url.searchParams.set("QueryType", "Title");
  url.searchParams.set("MaxResults", "20");
  url.searchParams.set("start", "1");
  url.searchParams.set("SearchTarget", "Book");
  url.searchParams.set("output", "js");
  url.searchParams.set("Version", "20131101");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();

  type AladinItem = {
    isbn13: string;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    cover: string;
    description: string;
    categoryName: string;
  };

  return ((data.item ?? []) as AladinItem[]).map((item) => ({
    externalId: `aladin:${item.isbn13 || item.isbn}`,
    title: item.title,
    author: item.author || null,
    publisher: item.publisher || null,
    coverUrl: item.cover || null,
    description: item.description || null,
    category: item.categoryName || null,
  }));
}

async function searchNaver(query: string): Promise<BookSearchResult[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return [];

  const url = new URL("https://openapi.naver.com/v1/search/book.json");
  url.searchParams.set("query", query);
  url.searchParams.set("display", "20");

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();

  type NaverItem = {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    image: string;
    description: string;
  };

  return ((data.items ?? []) as NaverItem[]).map((item) => ({
    externalId: `naver:${item.isbn || item.title}`,
    title: stripTags(item.title),
    author: item.author ? stripTags(item.author) : null,
    publisher: item.publisher || null,
    coverUrl: item.image || null,
    description: item.description ? stripTags(item.description) : null,
    category: null,
  }));
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const provider = process.env.BOOK_SEARCH_PROVIDER ?? "manual";

  switch (provider) {
    case "aladin":
      return searchAladin(trimmed);
    case "naver":
      return searchNaver(trimmed);
    default:
      return [];
  }
}

export default function BuyButton({ url }: { url: string | null }) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="inline-block self-start rounded bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
    >
      이 책 구매하기 ↗
    </a>
  );
}

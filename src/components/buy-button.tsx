import { monoLabel } from "@/components/booklog-landing/theme";

export default function BuyButton({ url }: { url: string | null }) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      style={{ ...monoLabel, display: "inline-block", whiteSpace: "nowrap" }}
    >
      이 책 구매하기 ↗
    </a>
  );
}

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div
        role="status"
        aria-label="로딩 중"
        className="h-8 w-8 animate-spin rounded-full border-2 border-leaf/25 border-t-leaf"
      />
    </div>
  );
}

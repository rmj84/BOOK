export default function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3c-5 1-9 5-9 10a9 9 0 0 0 9 9 9 9 0 0 0 9-9c0-5-4-9-9-10z" />
      <path
        d="M12 7v14"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

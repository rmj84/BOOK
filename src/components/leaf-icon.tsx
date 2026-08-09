export default function LeafIcon({
  className,
  showVeins = true,
}: {
  className?: string;
  showVeins?: boolean;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.2C9.2 5.8 4.6 9.4 4.6 13.5c0 3.9 3.3 6.7 7.4 7.2 4.1-.5 7.4-3.3 7.4-7.2 0-4.1-4.6-7.7-7.4-11.3z" />
      {showVeins && (
        <path
          d="M12 5.4v15.3M12 12.2l3.4-2.4M12 15.6l3.9-2.7M12 12.2L8.6 9.8M12 15.6l-4-2.7"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

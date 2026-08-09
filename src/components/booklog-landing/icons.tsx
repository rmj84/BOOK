export function LeafIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M12 2.6C9.1 6.3 4.7 9.7 4.7 13.7c0 3.8 3.2 6.6 7.3 7.1 4.1-.5 7.3-3.3 7.3-7.1 0-4-4.4-7.4-7.3-11.1z" />
      <path d="M12 6v14" />
    </svg>
  );
}

export function FlameIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M12 2.6c3.4 3.3 6.1 6.4 6.1 10.2 0 3.6-2.7 6.2-6.1 6.2s-6.1-2.6-6.1-6.2c0-1.9.9-3.4 2.2-2.4.6.5.7 1.6.4 2.6 1.4-1.9 2.1-4.2 2.1-6.3 0-1.6-.3-2.9-.6-4.1z" />
    </svg>
  );
}

export function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#57534A" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

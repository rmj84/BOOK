"use client";

import type { CSSProperties } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  pendingText,
  className,
  style,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      style={style ? { ...style, opacity: pending ? 0.5 : 1 } : undefined}
    >
      {pending ? (pendingText ?? "처리 중...") : children}
    </button>
  );
}

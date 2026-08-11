import type { ReactNode } from "react";

/**
 * Shared card shape (Design doc Section 3). Two accent applications per the
 * locked rule (Section 2): "fill" = accent background + charcoal text;
 * "outline" = accent border only, cream background.
 */
export function Card({
  children,
  variant = "outline",
  className = "",
}: {
  children: ReactNode;
  variant?: "fill" | "outline";
  className?: string;
}) {
  return (
    <div
      className={`card-shape p-6 text-charcoal ${
        variant === "outline" ? "border-2 bg-cream" : ""
      } ${className}`}
      style={{
        backgroundColor: variant === "fill" ? "var(--accent)" : undefined,
        borderColor: variant === "outline" ? "var(--accent)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

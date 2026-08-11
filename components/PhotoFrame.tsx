import Image from "next/image";
import type { ComponentProps } from "react";

/**
 * Shared photo frame — rounded corners, ~3-4px border in the current page's
 * accent color, standard soft shadow (Design doc Section 5 / TRD Section 6).
 * Reused everywhere a photo appears rather than styled ad hoc per instance.
 */
export function PhotoFrame({
  className = "",
  ...props
}: ComponentProps<typeof Image> & { className?: string }) {
  return (
    <div
      className="card-shape overflow-hidden border-[3.5px]"
      style={{ borderColor: "var(--accent)" }}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is required by ComponentProps<typeof Image> and passed through props */}
      <Image className={`h-full w-full object-cover ${className}`} {...props} />
    </div>
  );
}

import { formatNaira, formatOrdinal } from "@/lib/format";
import type { WishlistItemProgress } from "@/lib/wishlist";

/**
 * Rolling-unit progress display (PRD Section 5.1): "3 copies funded — 4th
 * copy: ₦500 / ₦6,500" — never a fixed goal, always live from contributions.
 */
export function ProgressBar({ progress }: { progress: WishlistItemProgress }) {
  const { unitsFunded, nextUnitRaised, unitCost } = progress;
  const percent = unitCost > 0 ? Math.min(100, Math.round((nextUnitRaised / unitCost) * 100)) : 0;

  return (
    <div>
      <p className="mb-1.5 text-sm text-charcoal/80">
        {unitsFunded} {unitsFunded === 1 ? "copy" : "copies"} funded — {formatOrdinal(unitsFunded + 1)}{" "}
        copy: {formatNaira(nextUnitRaised)} / {formatNaira(unitCost)}
      </p>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-charcoal/10">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${percent}%`, backgroundColor: "var(--accent)" }}
        />
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import {
  createItemAction,
  updateItemAction,
  type WishlistFormState,
} from "@/app/admin/(dashboard)/wishlist/actions";
import { CATEGORY_ORDER } from "@/lib/wishlist";

const initialState: WishlistFormState = {};
const fieldClass = "card-shape border-2 border-charcoal/20 bg-white px-4 py-2 text-charcoal";

type ExistingItem = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  unitCost: number;
  imageUrl: string | null;
};

export function WishlistItemForm({
  mode,
  item,
}: {
  mode: "create" | "edit";
  item?: ExistingItem;
}) {
  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createItemAction : updateItemAction,
    initialState
  );

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {mode === "edit" && item && <input type="hidden" name="id" value={item.id} />}

      <label className="flex flex-col gap-1 text-sm">
        Category
        <input
          type="text"
          name="category"
          list="wishlist-categories"
          defaultValue={item?.category}
          required
          className={fieldClass}
        />
        <datalist id="wishlist-categories">
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Name
        <input type="text" name="name" defaultValue={item?.name} required className={fieldClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description <span className="text-charcoal/50">(optional)</span>
        <textarea name="description" defaultValue={item?.description ?? ""} rows={3} className={fieldClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Unit cost (₦)
        <input
          type="number"
          name="unitCost"
          min="1"
          step="1"
          defaultValue={item?.unitCost}
          required
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Photo <span className="text-charcoal/50">(optional, JPG/PNG under 5MB)</span>
        {item?.imageUrl && (
          <div className="mb-1 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview thumbnail, not the public-facing PhotoFrame */}
            <img src={item.imageUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
            <span className="text-xs text-charcoal/50">Current photo: choose a file to replace it</span>
          </div>
        )}
        <input type="file" name="image" accept="image/*" className={fieldClass} />
      </label>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="button-shape bg-pink-tulips px-6 py-3 text-charcoal shadow-[var(--shadow-soft)] disabled:opacity-60"
      >
        {isPending ? "Saving…" : mode === "create" ? "Add item" : "Save changes"}
      </button>
    </form>
  );
}

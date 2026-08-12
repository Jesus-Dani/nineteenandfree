import Link from "next/link";
import { getAllWishlistItemsForAdmin } from "@/lib/wishlist";
import { formatNaira } from "@/lib/format";
import { archiveItemAction, reactivateItemAction, deleteItemAction } from "./actions";

type SearchParams = Promise<{ error?: string }>;

export default async function AdminWishlistPage({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams;
  const items = await getAllWishlistItemsForAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl">What they need</h1>
        <Link
          href="/admin/wishlist/new"
          className="button-shape bg-pink-tulips px-4 py-2 text-sm text-charcoal shadow-[var(--shadow-soft)]"
        >
          Add item
        </Link>
      </div>

      {error && (
        <div className="card-shape mb-6 border-2 border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-charcoal/70">No items yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="card-shape flex gap-4 border-2 border-charcoal/15 bg-white p-5">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- small admin-list thumbnail, not the public PhotoFrame treatment
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-lg">{item.name}</span>{" "}
                  <span className="text-sm text-charcoal/50">({item.category})</span>
                  <span
                    className={`ml-3 rounded-full px-3 py-1 text-xs ${
                      item.status === "active" ? "bg-tulip-stems/40" : "bg-charcoal/10"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex gap-3 text-sm">
                  <Link href={`/admin/wishlist/${item.id}/edit`} className="underline">
                    Edit
                  </Link>
                  {item.status === "active" ? (
                    <form action={archiveItemAction.bind(null, item.id)}>
                      <button type="submit" className="underline">
                        Archive
                      </button>
                    </form>
                  ) : (
                    <form action={reactivateItemAction.bind(null, item.id)}>
                      <button type="submit" className="underline">
                        Reactivate
                      </button>
                    </form>
                  )}
                  <form action={deleteItemAction.bind(null, item.id)}>
                    <button type="submit" className="text-red-700 underline">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <p className="text-sm text-charcoal/70">
                {formatNaira(item.unitCost)}/unit · {item.unitsFunded} funded · {formatNaira(item.nextUnitRaised)} /{" "}
                {formatNaira(item.unitCost)} toward next unit
              </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

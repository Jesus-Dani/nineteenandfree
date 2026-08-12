import { notFound } from "next/navigation";
import { WishlistItemForm } from "@/components/WishlistItemForm";
import { getAnyWishlistItemById } from "@/lib/wishlist";

type Params = Promise<{ id: string }>;

export default async function EditWishlistItemPage({ params }: { params: Params }) {
  const { id } = await params;
  const item = await getAnyWishlistItemById(id);

  if (!item) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="mb-8 text-3xl">Edit Item</h1>
      <WishlistItemForm
        mode="edit"
        item={{
          id: item.id,
          category: item.category,
          name: item.name,
          description: item.description,
          unitCost: item.unitCost,
          imageUrl: item.imageUrl,
        }}
      />
    </div>
  );
}

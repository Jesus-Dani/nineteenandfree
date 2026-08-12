import { WishlistItemForm } from "@/components/WishlistItemForm";

export default function NewWishlistItemPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="mb-8 text-3xl">Add an item to What they need</h1>
      <WishlistItemForm mode="create" />
    </div>
  );
}

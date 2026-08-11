import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-3xl">Admin Dashboard</h1>
      <div className="card-shape border-2 border-charcoal/20 bg-white p-6">
        <Link href="/admin/moderation" className="underline">
          Letters of Love — Moderation Queue
        </Link>
        <p className="mt-4 text-sm text-charcoal/70">
          Contributions table, wishlist management, and the outreach fund ledger arrive in Phase 4.
          The real Wishlist catalogue can be managed via the Supabase Table Editor in the meantime.
        </p>
      </div>
    </div>
  );
}

import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl">Admin Dashboard</h1>
        <AdminLogoutButton />
      </div>
      <div className="card-shape border-2 border-charcoal/20 bg-white p-6">
        <p className="text-sm text-charcoal/70">
          You&apos;re signed in. Contributions table, wishlist management, Letters of Love moderation,
          and the outreach fund ledger arrive in Phase 4.
        </p>
      </div>
    </div>
  );
}

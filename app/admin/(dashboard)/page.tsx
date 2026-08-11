import Link from "next/link";
import { getGiveFlowEnabled } from "@/lib/site-settings";
import { setGiveFlowEnabledAction } from "./actions";

export default async function AdminDashboardPage() {
  const giveFlowEnabled = await getGiveFlowEnabled();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-3xl">Admin Dashboard</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/contributions"
          className="card-shape border-2 border-charcoal/15 bg-white p-5 text-center"
        >
          Contributions
        </Link>
        <Link
          href="/admin/wishlist"
          className="card-shape border-2 border-charcoal/15 bg-white p-5 text-center"
        >
          Wishlist
        </Link>
        <Link
          href="/admin/ledger"
          className="card-shape border-2 border-charcoal/15 bg-white p-5 text-center"
        >
          Outreach Fund Ledger
        </Link>
      </div>

      <div className="mb-6">
        <Link href="/admin/moderation" className="underline">
          Letters of Love — Moderation Queue
        </Link>
      </div>

      <div className="card-shape flex flex-wrap items-center justify-between gap-3 border-2 border-charcoal/20 bg-white p-6">
        <div>
          <p className="font-medium">Give flow</p>
          <p className="text-sm text-charcoal/70">
            Currently {giveFlowEnabled ? "accepting" : "closed to"} new gifts.
          </p>
        </div>
        <form action={setGiveFlowEnabledAction.bind(null, !giveFlowEnabled)}>
          <button
            type="submit"
            className={`button-shape px-4 py-2 text-sm text-charcoal ${
              giveFlowEnabled ? "border-2 border-charcoal/20" : "bg-pink-tulips shadow-[var(--shadow-soft)]"
            }`}
          >
            {giveFlowEnabled ? "Close giving" : "Reopen giving"}
          </button>
        </form>
      </div>
    </div>
  );
}

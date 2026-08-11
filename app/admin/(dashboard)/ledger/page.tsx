import { getLedgerSummary, getLedgerEntries } from "@/lib/ledger";
import { formatNaira } from "@/lib/format";
import { LedgerEntryForm } from "@/components/LedgerEntryForm";

export default async function AdminLedgerPage() {
  const [summary, entries] = await Promise.all([getLedgerSummary(), getLedgerEntries()]);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-3xl">Outreach Fund Ledger</h1>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-shape border-2 border-charcoal/15 bg-white p-5 text-center">
          <p className="text-2xl">{formatNaira(summary.totalRaised)}</p>
          <p className="text-xs text-charcoal/60">Total raised</p>
        </div>
        <div className="card-shape border-2 border-charcoal/15 bg-white p-5 text-center">
          <p className="text-2xl">{formatNaira(summary.totalSpent)}</p>
          <p className="text-xs text-charcoal/60">Total spent</p>
        </div>
        <div className="card-shape border-2 border-charcoal/15 bg-white p-5 text-center">
          <p className="text-2xl">{formatNaira(summary.balance)}</p>
          <p className="text-xs text-charcoal/60">Remaining balance</p>
        </div>
      </div>

      <h2 className="mb-4 text-xl">Log an entry</h2>
      <div className="mb-10">
        <LedgerEntryForm />
      </div>

      <h2 className="mb-4 text-xl">Entries</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-charcoal/70">No manual entries logged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-charcoal/20 text-left text-charcoal/60">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-charcoal/10">
                  <td className="py-2 pr-4 whitespace-nowrap">{entry.date}</td>
                  <td className="py-2 pr-4 capitalize">{entry.type}</td>
                  <td className="py-2 pr-4">{formatNaira(entry.amount)}</td>
                  <td className="py-2 pr-4">{entry.category ?? "—"}</td>
                  <td className="py-2 pr-4">{entry.description ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

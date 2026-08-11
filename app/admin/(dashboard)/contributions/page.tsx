import Link from "next/link";
import { getContributionsForAdmin } from "@/lib/admin-contributions";
import { formatNaira } from "@/lib/format";

export default async function AdminContributionsPage() {
  const contributions = await getContributionsForAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl">Contributions</h1>
        <Link
          href="/admin/contributions/export"
          className="button-shape border-2 border-charcoal/20 px-4 py-2 text-sm text-charcoal"
        >
          Download as CSV
        </Link>
      </div>

      {contributions.length === 0 ? (
        <p className="text-sm text-charcoal/70">No contributions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-charcoal/20 text-left text-charcoal/60">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Contributor</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Target</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Bracelet</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => (
                <tr key={c.id} className="border-b border-charcoal/10">
                  <td className="py-2 pr-4 whitespace-nowrap">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-4">{c.contributorContact ?? "—"}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {formatNaira(c.amount)} {c.currency}
                  </td>
                  <td className="py-2 pr-4">{c.targetLabel}</td>
                  <td className="py-2 pr-4 capitalize">{c.paymentStatus}</td>
                  <td className="py-2 pr-4">
                    {c.braceletRequested ? c.braceletContact ?? "Requested" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

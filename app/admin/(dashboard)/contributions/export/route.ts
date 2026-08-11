import { NextResponse } from "next/server";
import { getContributionsForAdmin } from "@/lib/admin-contributions";
import { toCsv } from "@/lib/csv";

// Protected by proxy.ts's existing /admin matcher — no additional auth needed here.
export async function GET() {
  const contributions = await getContributionsForAdmin();

  const csv = toCsv(
    ["Date", "Contributor", "Amount", "Currency", "Target", "Payment Status", "Bracelet Contact"],
    contributions.map((c) => [
      new Date(c.createdAt).toISOString(),
      c.contributorContact,
      c.amount,
      c.currency,
      c.targetLabel,
      c.paymentStatus,
      c.braceletRequested ? c.braceletContact ?? "Requested" : "",
    ])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contributions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

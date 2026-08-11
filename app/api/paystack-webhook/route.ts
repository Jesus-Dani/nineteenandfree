import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { confirmContributionPayment } from "@/lib/confirm-contribution";

/**
 * Paystack has no separate webhook secret — every webhook is signed with
 * HMAC SHA512 over the RAW request body, keyed with PAYSTACK_SECRET_KEY
 * (TRD Section 1a). The signature must be computed over the exact raw bytes,
 * never a re-serialized/re-parsed version, or legitimate requests will fail.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const expectedSignature = createHmac("sha512", secret).update(rawBody).digest("hex");

  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  const valid =
    signatureBuffer.length === expectedBuffer.length && timingSafeEqual(signatureBuffer, expectedBuffer);

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // Never trust the webhook payload's own status/amount claims — independently
  // re-verify against Paystack's Verify Transaction endpoint before marking
  // anything paid (TRD Section 4, layered verification).
  if (event.event === "charge.success" && event.data?.reference) {
    try {
      await confirmContributionPayment(event.data.reference);
    } catch {
      // Swallow errors here — Paystack retries webhooks on non-2xx, and a
      // transient DB/network issue shouldn't cause repeated retries to pile
      // up. The nightly reconciliation job catches anything missed.
    }
  }

  return NextResponse.json({ received: true });
}

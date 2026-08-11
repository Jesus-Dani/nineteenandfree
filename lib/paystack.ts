/**
 * Server-only Paystack REST helpers. No SDK dependency — direct fetch calls
 * against Paystack's API, authenticated with PAYSTACK_SECRET_KEY.
 */

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function requireSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

/** Convert a naira amount (as stored in our DB) to kobo (as Paystack expects). */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/** Convert a kobo amount (from Paystack) back to naira. */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

type InitializeTransactionParams = {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

type InitializeTransactionResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

export async function initializeTransaction({
  email,
  amountNaira,
  reference,
  callbackUrl,
  metadata,
}: InitializeTransactionParams): Promise<InitializeTransactionResult> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: nairaToKobo(amountNaira),
      currency: "NGN",
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.status) {
    throw new Error(data.message ?? "Failed to initialize Paystack transaction");
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

export type VerifyTransactionResult = {
  status: "success" | "failed" | "abandoned" | "pending" | string;
  reference: string;
  amountNaira: number;
  currency: string;
  email: string | null;
};

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${requireSecretKey()}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok || !data.status) {
    throw new Error(data.message ?? "Failed to verify Paystack transaction");
  }

  return {
    status: data.data.status,
    reference: data.data.reference,
    amountNaira: koboToNaira(data.data.amount),
    currency: data.data.currency,
    email: data.data.customer?.email ?? null,
  };
}

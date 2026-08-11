import { headers } from "next/headers";

/** Best-effort client IP, for Letters of Love rate limiting (TRD Section 4). */
export async function getClientIp(): Promise<string | null> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headersList.get("x-real-ip");
}

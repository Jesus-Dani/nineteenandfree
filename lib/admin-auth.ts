/**
 * Signed admin session cookie helpers. Uses Web Crypto (not Node's `crypto`
 * module) so the same code runs in both middleware (Edge runtime) and route
 * handlers (Node runtime). No extra auth library, per TRD Section 2 — single
 * admin, simple password login.
 */
export const ADMIN_SESSION_COOKIE = "nf_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function bytesToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getHmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not set");

  const expires = String(Date.now() + SESSION_TTL_MS);
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(expires));
  return `${expires}.${bytesToBase64Url(signature)}`;
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (!Number.isFinite(Number(expires)) || Date.now() > Number(expires)) return false;

  try {
    const key = await getHmacKey(secret);
    return await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signature) as BufferSource,
      new TextEncoder().encode(expires)
    );
  } catch {
    return false;
  }
}

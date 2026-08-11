import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/message-rate-limit";

export type ApprovedMessage = {
  id: string;
  displayName: string | null;
  isAnonymous: boolean;
  messageText: string;
  createdAt: string;
};

/** Public wall — approved messages only, newest first. */
export async function getApprovedMessages(): Promise<ApprovedMessage[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("messages")
    .select("id, display_name, is_anonymous, message_text, created_at")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    // Anonymity applies identically everywhere (PRD 5.5) — never surface the
    // name even if one happens to be stored for an anonymous submission.
    displayName: row.is_anonymous ? null : row.display_name,
    isAnonymous: row.is_anonymous,
    messageText: row.message_text,
    createdAt: row.created_at,
  }));
}

export type SubmitMessageInput = {
  name: string | null;
  message: string;
  isAnonymous: boolean;
  contributionId: string | null;
  ip: string | null;
};

export type SubmitMessageResult = { ok: true } | { ok: false; error: string };

const MAX_MESSAGE_LENGTH = 2000;

/**
 * Shared submission logic for both the standalone Letters of Love page and
 * the post-payment prompt on the confirmation page. Every submission lands
 * as "pending" — the content filter never auto-rejects (see lib/content-filter.ts).
 */
export async function submitMessage(input: SubmitMessageInput): Promise<SubmitMessageResult> {
  const message = input.message.trim();

  if (!message) {
    return { ok: false, error: "Please write a message." };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.` };
  }

  if (await isRateLimited(input.ip)) {
    return { ok: false, error: "You can submit one message per hour. Please try again later." };
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("messages").insert({
    contribution_id: input.contributionId,
    display_name: input.isAnonymous ? null : input.name?.trim() || null,
    message_text: message,
    is_anonymous: input.isAnonymous,
    approval_status: "pending",
    submitted_ip: input.ip,
  });

  if (error) throw error;

  return { ok: true };
}

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isFlaggedContent } from "@/lib/content-filter";
import { approveMessage, rejectMessage } from "./actions";

export default async function ModerationQueuePage() {
  const supabase = createServerSupabaseClient();

  const { data: pending, error } = await supabase
    .from("messages")
    .select("id, display_name, is_anonymous, message_text, created_at")
    .eq("approval_status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl">Letters of Love: Moderation</h1>

      {!pending || pending.length === 0 ? (
        <p className="text-sm text-charcoal/70">Nothing pending review.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {pending.map((message) => {
            const flagged = isFlaggedContent(message.message_text);
            return (
              <div
                key={message.id}
                className={`card-shape border-2 bg-white p-5 ${flagged ? "border-red-400" : "border-charcoal/15"}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-charcoal/60">
                    {message.is_anonymous ? "Anonymous" : message.display_name || "(no name given)"}
                    {" · "}
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                  {flagged && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                      Flagged by filter
                    </span>
                  )}
                </div>
                <p className="mb-4 whitespace-pre-wrap text-charcoal">{message.message_text}</p>
                <div className="flex gap-3">
                  <form action={approveMessage.bind(null, message.id)}>
                    <button
                      type="submit"
                      className="button-shape bg-pink-tulips px-4 py-2 text-sm text-charcoal shadow-[var(--shadow-soft)]"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectMessage.bind(null, message.id)}>
                    <button
                      type="submit"
                      className="button-shape border-2 border-charcoal/20 px-4 py-2 text-sm text-charcoal"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

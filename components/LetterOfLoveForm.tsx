"use client";

import { useActionState, useState } from "react";
import { submitLetterOfLove, type LetterActionState } from "@/app/(site)/letters-of-love/actions";
import { Card } from "@/components/Card";

const initialState: LetterActionState = {};

export function LetterOfLoveForm({ contributionId }: { contributionId?: string }) {
  const [state, formAction, isPending] = useActionState(submitLetterOfLove, initialState);
  const [isAnonymous, setIsAnonymous] = useState(false);

  if (state.ok) {
    return (
      <Card variant="fill" className="text-center">
        <p className="font-script mb-1 text-2xl">Thank you.</p>
        <p className="text-sm">Your message means so much.</p>
      </Card>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {contributionId && <input type="hidden" name="contributionId" value={contributionId} />}
      <input type="hidden" name="isAnonymous" value={String(isAnonymous)} />

      <p className="text-xs text-charcoal/60">
        Your message may be displayed on this page and printed in a physical keepsake for the
        children and library.
      </p>

      <label className="flex flex-col gap-1 text-sm">
        Name <span className="text-charcoal/50">(optional)</span>
        <input
          type="text"
          name="name"
          disabled={isAnonymous}
          className="card-shape border-2 border-charcoal/20 bg-white px-4 py-2 text-charcoal disabled:opacity-50"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
        Submit anonymously
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Message
        <textarea
          name="message"
          required
          rows={4}
          maxLength={2000}
          className="card-shape border-2 border-charcoal/20 bg-white px-4 py-2 text-charcoal"
        />
      </label>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="button-shape bg-pink-tulips px-6 py-3 text-charcoal shadow-[var(--shadow-soft)] disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send your Letter of Love"}
      </button>
    </form>
  );
}

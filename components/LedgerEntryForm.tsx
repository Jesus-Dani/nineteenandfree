"use client";

import { useActionState } from "react";
import { addLedgerEntryAction, type LedgerFormState } from "@/app/admin/(dashboard)/ledger/actions";

const initialState: LedgerFormState = {};
const fieldClass = "card-shape border-2 border-charcoal/20 bg-white px-4 py-2 text-charcoal";

export function LedgerEntryForm() {
  const [state, formAction, isPending] = useActionState(addLedgerEntryAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Type
        <select name="type" defaultValue="expense" className={fieldClass}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Amount (₦)
        <input type="number" name="amount" min="1" step="1" required className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Category <span className="text-charcoal/50">(optional)</span>
        <input type="text" name="category" className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Description <span className="text-charcoal/50">(optional)</span>
        <input type="text" name="description" className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Date
        <input
          type="date"
          name="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          required
          className={fieldClass}
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="button-shape bg-pink-tulips px-6 py-2 text-charcoal shadow-[var(--shadow-soft)] disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Add entry"}
      </button>
      {state.error && <p className="w-full text-sm text-red-700">{state.error}</p>}
    </form>
  );
}

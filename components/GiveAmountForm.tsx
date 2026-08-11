"use client";

import { useActionState, useState } from "react";
import { initializeGiving, type GivingActionState } from "@/app/give/amount/actions";
import { formatNaira } from "@/lib/format";

const GENERAL_SUGGESTED_AMOUNTS = [2000, 5000, 10000, 20000];

type Props =
  | { kind: "item"; itemId: string; nextUnitRemaining: number; defaultToFullUnit: boolean }
  | { kind: "general" };

const initialState: GivingActionState = {};

function SuggestedButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="button-shape border-2 px-4 py-2 text-sm text-charcoal"
      style={{ borderColor: "var(--accent)" }}
    >
      {label}
    </button>
  );
}

export function GiveAmountForm(props: Props) {
  const [state, formAction, isPending] = useActionState(initializeGiving, initialState);
  const [amount, setAmount] = useState<string>(
    props.kind === "item" && props.defaultToFullUnit ? String(props.nextUnitRemaining) : ""
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {props.kind === "item" ? (
        <input type="hidden" name="itemId" value={props.itemId} />
      ) : (
        <input type="hidden" name="fund" value="general" />
      )}

      {props.kind === "item" && (
        <div className="flex flex-wrap gap-3">
          <SuggestedButton
            label={`Fund the next unit (${formatNaira(props.nextUnitRemaining)})`}
            onClick={() => setAmount(String(props.nextUnitRemaining))}
          />
        </div>
      )}

      {props.kind === "general" && (
        <div className="flex flex-wrap gap-3">
          {GENERAL_SUGGESTED_AMOUNTS.map((amt) => (
            <SuggestedButton key={amt} label={formatNaira(amt)} onClick={() => setAmount(String(amt))} />
          ))}
        </div>
      )}

      <label className="flex flex-col gap-1 text-sm">
        Amount (₦)
        <input
          type="number"
          name="amount"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="card-shape border-2 border-charcoal/20 bg-white px-4 py-2 text-charcoal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Email <span className="text-charcoal/50">(for your payment receipt, via Paystack)</span>
        <input
          type="email"
          name="email"
          required
          className="card-shape border-2 border-charcoal/20 bg-white px-4 py-2 text-charcoal"
        />
      </label>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}

      <p className="text-xs text-charcoal/60">No minimum amount. No refunds — all gifts are final.</p>

      <button
        type="submit"
        disabled={isPending}
        className="button-shape bg-pink-tulips px-6 py-3 text-charcoal shadow-[var(--shadow-soft)] disabled:opacity-60"
      >
        {isPending ? "Redirecting to payment…" : "Continue to payment"}
      </button>
    </form>
  );
}

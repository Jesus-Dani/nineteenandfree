"use client";

import { useActionState, useState } from "react";
import { submitBracelet, type BraceletActionState } from "@/app/(site)/give/confirmation/actions";
import { Card } from "@/components/Card";

const initialState: BraceletActionState = {};
const fieldClass = "card-shape border-2 border-charcoal/20 bg-white px-4 py-2 text-charcoal";

export function BraceletForm({ contributionId }: { contributionId: string }) {
  const [state, formAction, isPending] = useActionState(submitBracelet, initialState);
  const [step, setStep] = useState<"ask" | "details">("ask");

  if (state.ok) {
    return (
      <Card variant="fill" className="text-center">
        <p className="text-sm">Thanks for letting us know!</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-charcoal/60">
        This option is only available for students at Redeemers University.
      </p>

      {step === "ask" ? (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep("details")}
            className="button-shape border-2 px-6 py-2 text-sm text-charcoal"
            style={{ borderColor: "var(--accent)" }}
          >
            Interested
          </button>
          <form action={formAction}>
            <input type="hidden" name="contributionId" value={contributionId} />
            <input type="hidden" name="interested" value="false" />
            <button
              type="submit"
              disabled={isPending}
              className="button-shape border-2 border-charcoal/20 px-6 py-2 text-sm text-charcoal disabled:opacity-60"
            >
              Not interested
            </button>
          </form>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="contributionId" value={contributionId} />
          <input type="hidden" name="interested" value="true" />

          <label className="flex flex-col gap-1 text-sm">
            Name
            <input type="text" name="name" required className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Phone number
            <input type="tel" name="phone" required className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            WhatsApp number <span className="text-charcoal/50">(if different from phone)</span>
            <input type="tel" name="whatsapp" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Size
            <select name="size" required className={fieldClass}>
              <option value="">Choose…</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Gender
            <select name="gender" required className={fieldClass}>
              <option value="">Choose…</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          {state.error && <p className="text-sm text-red-700">{state.error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="button-shape bg-pink-tulips px-6 py-3 text-charcoal shadow-[var(--shadow-soft)] disabled:opacity-60"
          >
            {isPending ? "Submitting…" : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}

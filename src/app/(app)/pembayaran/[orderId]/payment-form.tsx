"use client";

import { useActionState, useState } from "react";
import { CreditCard, QrCode, Wallet } from "lucide-react";
import { payOrderAction } from "@/lib/actions/order";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const METHODS = [
  { value: "gopay", label: "GoPay", icon: Wallet },
  { value: "ovo", label: "OVO", icon: Wallet },
  { value: "va_bca", label: "BCA Virtual Account", icon: CreditCard },
  { value: "qris", label: "QRIS", icon: QrCode },
] as const;

export function PaymentForm({ orderId }: { orderId: string }) {
  const [state, action, pending] = useActionState(payOrderAction, undefined);
  const [method, setMethod] = useState<string>("");

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="method" value={method} />

      <div className="space-y-2.5">
        {METHODS.map(({ value, label, icon: Icon }) => {
          const active = method === value;
          return (
            <button
              type="button"
              key={value}
              onClick={() => setMethod(value)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border bg-surface p-3.5 text-left transition-colors",
                active
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border",
              )}
            >
              <Icon className="h-5 w-5 text-primary" aria-hidden />
              <span className="flex-1 text-sm font-medium text-foreground">
                {label}
              </span>
              <span
                className={cn(
                  "h-4 w-4 rounded-full border",
                  active
                    ? "border-primary bg-primary"
                    : "border-border",
                )}
              />
            </button>
          );
        })}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={pending || !method}
      >
        {pending ? "Memproses pembayaran…" : "Bayar Sekarang"}
      </Button>
      <p className="text-center text-xs text-muted">
        Simulasi pembayaran — gateway asli (Midtrans/Xendit) dapat
        diintegrasikan tanpa mengubah alur ini.
      </p>
    </form>
  );
}

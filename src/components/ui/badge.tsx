import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-border/50 text-muted",
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

const paymentTone: Record<string, Tone> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
};

const paymentLabel: Record<string, string> = {
  pending: "Menunggu Bayar",
  paid: "Lunas",
  failed: "Gagal",
};

const serviceTone: Record<string, Tone> = {
  menunggu: "neutral",
  dijadwalkan: "info",
  proses: "primary",
  selesai: "success",
  dibatalkan: "danger",
};

const serviceLabel: Record<string, string> = {
  menunggu: "Menunggu",
  dijadwalkan: "Dijadwalkan",
  proses: "Diproses",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export function PaymentBadge({ status }: { status: string }) {
  return (
    <Badge tone={paymentTone[status] ?? "neutral"}>
      {paymentLabel[status] ?? status}
    </Badge>
  );
}

export function ServiceBadge({ status }: { status: string }) {
  return (
    <Badge tone={serviceTone[status] ?? "neutral"}>
      {serviceLabel[status] ?? status}
    </Badge>
  );
}

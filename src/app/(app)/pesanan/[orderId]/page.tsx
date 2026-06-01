import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, PaymentBadge, ServiceBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { requireUser } from "@/lib/dal";
import { getOrderForUser } from "@/lib/queries";
import { cancelOrderAction } from "@/lib/actions/order";
import { cn, formatRupiah, formatTanggalWaktu } from "@/lib/utils";
import type { LabResultItem } from "@/db/schema";

const STEPS = [
  { key: "dipesan", label: "Dipesan" },
  { key: "dibayar", label: "Dibayar" },
  { key: "dijadwalkan", label: "Dijadwalkan" },
  { key: "proses", label: "Diproses" },
  { key: "selesai", label: "Selesai" },
];

function currentStep(paymentStatus: string, serviceStatus: string): number {
  if (serviceStatus === "selesai") return 4;
  if (serviceStatus === "proses") return 3;
  if (serviceStatus === "dijadwalkan") return 2;
  if (paymentStatus === "paid") return 2;
  return 0;
}

const flagTone = {
  normal: "success",
  rendah: "info",
  tinggi: "danger",
} as const;

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ bayar?: string }>;
}) {
  const { orderId } = await params;
  const { bayar } = await searchParams;
  const user = await requireUser();
  const order = await getOrderForUser(orderId, user.id);
  if (!order) notFound();

  const step =
    order.serviceStatus === "dibatalkan"
      ? -1
      : currentStep(order.paymentStatus, order.serviceStatus);
  const items = (order.result?.items ?? []) as LabResultItem[];

  return (
    <div className="space-y-5">
      <Link
        href="/pesanan"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Pesanan
      </Link>

      {bayar === "sukses" ? (
        <Alert tone="success">
          Pembayaran berhasil! Jadwal kunjungan Anda telah dikonfirmasi.
        </Alert>
      ) : null}

      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {order.service.name}
        </h1>
        <p className="mt-1 font-mono text-xs text-muted">
          #{order.id.slice(0, 8).toUpperCase()}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <PaymentBadge status={order.paymentStatus} />
          <ServiceBadge status={order.serviceStatus} />
        </div>
      </div>

      {step >= 0 ? (
        <Card>
          <CardContent>
            <ol className="space-y-3">
              {STEPS.map((s, i) => {
                const done = i <= step;
                return (
                  <li key={s.key} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                        done
                          ? "bg-primary text-primary-fg"
                          : "bg-border/60 text-muted",
                      )}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        done
                          ? "font-medium text-foreground"
                          : "text-muted",
                      )}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      ) : (
        <Alert tone="danger">Pesanan ini telah dibatalkan.</Alert>
      )}

      <Card>
        <CardContent className="space-y-3 text-sm">
          <Row label="Jadwal" value={formatTanggalWaktu(order.scheduledAt)} />
          <Row label="Alamat" value={order.address} />
          <Row label="Kontak" value={order.contactPhone} />
          {order.notes ? <Row label="Catatan" value={order.notes} /> : null}
          {order.paymentMethod ? (
            <Row
              label="Metode"
              value={order.paymentMethod.toUpperCase()}
            />
          ) : null}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatRupiah(order.amount)}
            </span>
          </div>
        </CardContent>
      </Card>

      {order.paymentStatus === "pending" &&
      order.serviceStatus !== "dibatalkan" ? (
        <div className="space-y-2.5">
          <Button asChild size="lg" className="w-full">
            <Link href={`/pembayaran/${order.id}`}>Bayar Sekarang</Link>
          </Button>
          <form action={cancelOrderAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button
              type="submit"
              variant="ghost"
              size="md"
              className="w-full text-danger"
            >
              Batalkan Pesanan
            </Button>
          </form>
        </div>
      ) : null}

      <section>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="h-4 w-4 text-primary" aria-hidden />
          Hasil Pemeriksaan
        </h2>

        {order.result ? (
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted">
                <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />
                Dirilis {formatTanggalWaktu(order.result.releasedAt)}
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-bg text-left text-xs text-muted">
                    <tr>
                      <th className="px-3 py-2 font-medium">Parameter</th>
                      <th className="px-3 py-2 font-medium">Hasil</th>
                      <th className="px-3 py-2 font-medium">Rujukan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-border align-top"
                      >
                        <td className="px-3 py-2 text-foreground">
                          {it.parameter}
                        </td>
                        <td className="px-3 py-2">
                          <span className="font-semibold text-foreground">
                            {it.value}
                            {it.unit ? (
                              <span className="ml-1 font-normal text-muted">
                                {it.unit}
                              </span>
                            ) : null}
                          </span>
                          {it.flag ? (
                            <div className="mt-1">
                              <Badge tone={flagTone[it.flag]}>
                                {it.flag}
                              </Badge>
                            </div>
                          ) : null}
                        </td>
                        <td className="px-3 py-2 text-xs text-muted">
                          {it.reference ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {order.result.doctorNote ? (
                <div className="rounded-xl bg-primary-soft/60 p-3.5 text-sm text-primary">
                  <p className="font-semibold">Catatan Dokter</p>
                  <p className="mt-1 leading-relaxed">
                    {order.result.doctorNote}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted">
              {order.serviceStatus === "selesai"
                ? "Hasil sedang difinalisasi."
                : "Hasil akan tersedia setelah pemeriksaan selesai."}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="max-w-[60%] text-right font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

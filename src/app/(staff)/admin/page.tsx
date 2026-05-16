import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentBadge, ServiceBadge } from "@/components/ui/badge";
import { getAllOrders } from "@/lib/queries-admin";
import { cn, formatRupiah, formatTanggalWaktu } from "@/lib/utils";

const filters = [
  { key: "", label: "Semua" },
  { key: "dijadwalkan", label: "Dijadwalkan" },
  { key: "proses", label: "Proses" },
  { key: "selesai", label: "Selesai" },
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const all = await getAllOrders();
  const orders = status
    ? all.filter((o) => o.serviceStatus === status)
    : all;

  const counts = {
    total: all.length,
    paid: all.filter((o) => o.paymentStatus === "paid").length,
    proses: all.filter((o) => o.serviceStatus === "proses").length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Panel Petugas
        </h1>
        <p className="mt-1 text-sm text-muted">
          Kelola pesanan, jadwal, dan input hasil lab.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: counts.total },
          { label: "Lunas", value: counts.paid },
          { label: "Proses", value: counts.proses },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-surface p-3 text-center"
          >
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = (status ?? "") === f.key;
          return (
            <Link
              key={f.key || "all"}
              href={f.key ? `/admin?status=${f.key}` : "/admin"}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium",
                active
                  ? "bg-primary text-primary-fg"
                  : "border border-border bg-surface text-muted",
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted">
              Tidak ada pesanan.
            </CardContent>
          </Card>
        ) : (
          orders.map((o) => (
            <Link key={o.id} href={`/admin/pesanan/${o.id}`}>
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {o.service.name}
                      </p>
                      <p className="text-xs text-muted">
                        {o.customerName} · {o.customerPhone ?? "-"}
                      </p>
                    </div>
                    <ChevronRight
                      className="h-5 w-5 shrink-0 text-muted"
                      aria-hidden
                    />
                  </div>
                  <p className="text-xs text-muted">
                    {formatTanggalWaktu(o.scheduledAt)}
                  </p>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap gap-2">
                      <PaymentBadge status={o.paymentStatus} />
                      <ServiceBadge status={o.serviceStatus} />
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {formatRupiah(o.amount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

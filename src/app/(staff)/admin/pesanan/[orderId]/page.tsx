import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentBadge, ServiceBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { getAdminOrder } from "@/lib/queries-admin";
import { setServiceStatusAction } from "@/lib/actions/admin";
import { formatRupiah, formatTanggalWaktu } from "@/lib/utils";
import type { LabResultItem } from "@/db/schema";
import { LabResultForm } from "./lab-result-form";

const STATUSES = [
  "menunggu",
  "dijadwalkan",
  "proses",
  "selesai",
  "dibatalkan",
];

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getAdminOrder(orderId);
  if (!order) notFound();

  const items = (order.result?.items ?? []) as LabResultItem[];

  return (
    <div className="space-y-5">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Daftar Pesanan
      </Link>

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

      <Card>
        <CardContent className="space-y-3 text-sm">
          <Row label="Pelanggan" value={order.customerName} />
          <Row label="Kontak" value={order.contactPhone} />
          <Row label="Jadwal" value={formatTanggalWaktu(order.scheduledAt)} />
          <Row label="Alamat" value={order.address} />
          {order.notes ? <Row label="Catatan" value={order.notes} /> : null}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatRupiah(order.amount)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Ubah Status Layanan
          </p>
          <form
            action={setServiceStatusAction}
            className="flex items-center gap-2"
          >
            <input type="hidden" name="orderId" value={order.id} />
            <Select
              name="status"
              defaultValue={order.serviceStatus}
              className="flex-1"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Button type="submit" size="md">
              Simpan
            </Button>
          </form>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Input / Edit Hasil Lab
        </h2>
        <LabResultForm
          orderId={order.id}
          initialItems={items}
          initialNote={order.result?.doctorNote ?? ""}
        />
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

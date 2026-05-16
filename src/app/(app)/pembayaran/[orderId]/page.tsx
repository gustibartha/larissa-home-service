import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/dal";
import { getOrderForUser } from "@/lib/queries";
import { formatRupiah, formatTanggalWaktu } from "@/lib/utils";
import { PaymentForm } from "./payment-form";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const user = await requireUser();
  const order = await getOrderForUser(orderId, user.id);

  if (!order) notFound();
  if (order.paymentStatus === "paid") redirect(`/pesanan/${order.id}`);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Pembayaran
        </h1>
        <p className="mt-1 text-sm text-muted">
          Selesaikan pembayaran untuk mengonfirmasi jadwal.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm text-muted">Layanan</span>
            <span className="text-right text-sm font-semibold text-foreground">
              {order.service.name}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm text-muted">Jadwal</span>
            <span className="text-right text-sm font-medium text-foreground">
              {formatTanggalWaktu(order.scheduledAt)}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm text-muted">Alamat</span>
            <span className="text-right text-sm font-medium text-foreground">
              {order.address}
            </span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Total Bayar
              </span>
              <span className="text-xl font-bold text-primary">
                {formatRupiah(order.amount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Metode Pembayaran
        </h2>
        <PaymentForm orderId={order.id} />
      </div>
    </div>
  );
}

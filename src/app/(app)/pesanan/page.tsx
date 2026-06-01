import Link from "next/link";
import { ChevronRight, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentBadge, ServiceBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/dal";
import { getUserOrders } from "@/lib/queries";
import { formatRupiah, formatTanggalWaktu } from "@/lib/utils";

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await getUserOrders(user.id);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Pesanan Saya
      </h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <ClipboardList className="h-8 w-8 text-muted" aria-hidden />
            <p className="text-sm text-muted">Belum ada pesanan.</p>
            <Button asChild size="sm">
              <Link href="/katalog">Pesan Layanan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} href={`/pesanan/${o.id}`}>
              <Card>
                <CardContent className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {o.service.name}
                    </p>
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
          ))}
        </div>
      )}
    </div>
  );
}

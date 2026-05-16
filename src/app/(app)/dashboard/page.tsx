import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  FileText,
  FlaskConical,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentBadge, ServiceBadge } from "@/components/ui/badge";
import { requireUser } from "@/lib/dal";
import { getResultsForUser, getUserOrders } from "@/lib/queries";
import { formatRupiah, formatTanggalWaktu } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const orders = await getUserOrders(user.id);
  const results = await getResultsForUser(user.id);

  const activeOrders = orders.filter(
    (o) => o.serviceStatus !== "selesai" && o.serviceStatus !== "dibatalkan",
  );
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">Halo,</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {firstName} 👋
        </h1>
      </div>

      <Link
        href="/katalog"
        className="flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-fg shadow-sm"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
          <Plus className="h-5 w-5" aria-hidden />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">Pesan Layanan Baru</span>
          <span className="block text-xs text-primary-fg/80">
            Home Service lab &amp; kunjungan klinik
          </span>
        </span>
        <ArrowRight className="h-5 w-5" aria-hidden />
      </Link>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Pesanan Aktif
          </h2>
          <Link href="/pesanan" className="text-xs font-medium text-primary">
            Lihat semua
          </Link>
        </div>

        {activeOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
              <CalendarClock className="h-7 w-7 text-muted" aria-hidden />
              <p className="text-sm text-muted">
                Belum ada pesanan aktif.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeOrders.slice(0, 3).map((o) => (
              <Link key={o.id} href={`/pesanan/${o.id}`}>
                <Card>
                  <CardContent className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        {o.service.name}
                      </p>
                      <FlaskConical
                        className="h-5 w-5 shrink-0 text-primary"
                        aria-hidden
                      />
                    </div>
                    <p className="text-xs text-muted">
                      {formatTanggalWaktu(o.scheduledAt)}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <PaymentBadge status={o.paymentStatus} />
                      <ServiceBadge status={o.serviceStatus} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Hasil Terbaru
          </h2>
          <Link href="/hasil" className="text-xs font-medium text-primary">
            Lihat semua
          </Link>
        </div>

        {results.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
              <FileText className="h-7 w-7 text-muted" aria-hidden />
              <p className="text-sm text-muted">
                Hasil pemeriksaan akan tampil di sini.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {results.slice(0, 2).map((r) => (
              <Link key={r.id} href={`/pesanan/${r.order.id}`}>
                <Card>
                  <CardContent className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {r.service.name}
                      </p>
                      <p className="text-xs text-muted">
                        Dirilis {formatTanggalWaktu(r.releasedAt)}
                      </p>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-muted"
                      aria-hidden
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <p className="pt-2 text-center text-xs text-muted">
        Total pesanan: {orders.length} ·{" "}
        {formatRupiah(
          orders
            .filter((o) => o.paymentStatus === "paid")
            .reduce((s, o) => s + o.amount, 0),
        )}{" "}
        dibayar
      </p>
    </div>
  );
}

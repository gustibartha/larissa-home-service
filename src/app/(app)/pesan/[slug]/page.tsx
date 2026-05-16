import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/dal";
import { getServiceBySlug } from "@/lib/queries";
import { formatRupiah } from "@/lib/utils";
import { BookingForm } from "./booking-form";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, user] = await Promise.all([
    getServiceBySlug(slug),
    requireUser(),
  ]);
  if (!service) notFound();

  return (
    <div className="space-y-5">
      <Link
        href={`/katalog/${service.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kembali
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Atur Jadwal
        </h1>
        <p className="mt-1 text-sm text-muted">
          Tentukan waktu &amp; lokasi kunjungan.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-3">
          <div>
            <Badge tone="primary">{service.group ?? service.category}</Badge>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {service.name}
            </p>
          </div>
          <p className="shrink-0 text-base font-bold text-primary">
            {formatRupiah(service.price)}
          </p>
        </CardContent>
      </Card>

      {service.preparation ? (
        <div className="rounded-xl bg-warning-soft px-3.5 py-3 text-xs font-medium text-warning">
          ⚠ {service.preparation}
        </div>
      ) : null}

      <BookingForm
        serviceId={service.id}
        defaultAddress={user.address ?? ""}
        defaultPhone={user.phone ?? ""}
      />
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getServiceBySlug } from "@/lib/queries";
import { formatRupiah } from "@/lib/utils";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div className="space-y-5">
      <Link
        href="/katalog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Katalog
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="primary">{service.group ?? service.category}</Badge>
          {service.homeService ? (
            <Badge tone="success">Home Service tersedia</Badge>
          ) : (
            <Badge tone="neutral">Hanya di klinik</Badge>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          {service.name}
        </h1>
        <p className="mt-2 text-3xl font-bold text-primary">
          {formatRupiah(service.price)}
        </p>
      </div>

      {service.description ? (
        <Card>
          <CardContent className="flex gap-3">
            <Info className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <p className="text-sm leading-relaxed text-foreground">
              {service.description}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {service.preparation ? (
        <Card>
          <CardContent className="flex gap-3">
            <Clock className="h-5 w-5 shrink-0 text-warning" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Persiapan
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
                {service.preparation}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="rounded-2xl bg-primary-soft/60 p-4 text-sm text-primary">
        <p className="font-semibold">Servis Total Larissa</p>
        <p className="mt-1 text-xs leading-relaxed">
          {service.homeService
            ? "Nakes datang ke alamat Anda sesuai jadwal. Hasil dapat dipantau digital di aplikasi."
            : "Pemeriksaan dilakukan di klinik pusat Larissa, Rungkut — Surabaya. Pesan untuk memilih jadwal kunjungan."}
        </p>
      </div>

      <div className="sticky bottom-24">
        <Button asChild size="lg" className="w-full">
          <Link href={`/pesan/${service.slug}`}>Pesan Sekarang</Link>
        </Button>
      </div>
    </div>
  );
}

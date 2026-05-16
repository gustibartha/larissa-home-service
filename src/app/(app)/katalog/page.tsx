import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getServices } from "@/lib/queries";
import { formatRupiah, cn } from "@/lib/utils";

const filters = [
  { key: "", label: "Semua" },
  { key: "Laboratorium", label: "Laboratorium" },
  { key: "Non-Laboratorium", label: "Non-Lab" },
];

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const services = await getServices({
    category:
      kategori === "Laboratorium" || kategori === "Non-Laboratorium"
        ? kategori
        : undefined,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Katalog Layanan
        </h1>
        <p className="mt-1 text-sm text-muted">
          Pilih layanan untuk dipesan Home Service atau kunjungan klinik.
        </p>
      </div>

      <div className="flex gap-2">
        {filters.map((f) => {
          const active = (kategori ?? "") === f.key;
          return (
            <Link
              key={f.key || "all"}
              href={f.key ? `/katalog?kategori=${f.key}` : "/katalog"}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
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
        {services.map((s) => (
          <Link key={s.id} href={`/katalog/${s.slug}`}>
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="primary">{s.group ?? s.category}</Badge>
                    {s.homeService ? (
                      <Badge tone="success">Home Service</Badge>
                    ) : (
                      <Badge tone="neutral">Di Klinik</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {s.name}
                  </p>
                  {s.preparation ? (
                    <p className="mt-1 text-xs text-warning">
                      ⚠ {s.preparation}
                    </p>
                  ) : null}
                  <p className="mt-2 text-base font-bold text-primary">
                    {formatRupiah(s.price)}
                  </p>
                </div>
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-muted"
                  aria-hidden
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

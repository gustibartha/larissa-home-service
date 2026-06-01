import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/dal";
import { getResultsForUser } from "@/lib/queries";
import { formatTanggalWaktu } from "@/lib/utils";

export default async function ResultsPage() {
  const user = await requireUser();
  const results = await getResultsForUser(user.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Hasil &amp; Rekam Medis
        </h1>
        <p className="mt-1 text-sm text-muted">
          Riwayat hasil pemeriksaan Anda, aman &amp; transparan.
        </p>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <FileText className="h-8 w-8 text-muted" aria-hidden />
            <p className="text-sm text-muted">
              Belum ada hasil pemeriksaan.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((r) => (
            <Link key={r.id} href={`/pesanan/${r.order.id}`}>
              <Card>
                <CardContent className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Badge tone="primary">
                      {r.service.group ?? r.service.category}
                    </Badge>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {r.service.name}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Dirilis {formatTanggalWaktu(r.releasedAt)}
                    </p>
                  </div>
                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-muted"
                    aria-hidden
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

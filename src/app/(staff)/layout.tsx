import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
import { requireStaff } from "@/lib/dal";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaff();

  return (
    <div className="container-app flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/90 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Brand />
          <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold text-white">
            PETUGAS
          </span>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          App
        </Link>
      </header>
      <main className="flex-1 px-5 py-5 pb-12">{children}</main>
    </div>
  );
}

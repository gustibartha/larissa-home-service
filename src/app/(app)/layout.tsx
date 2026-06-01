import Link from "next/link";
import { Bell } from "lucide-react";
import { Brand } from "@/components/brand";
import { BottomNav } from "@/components/bottom-nav";
import { requireUser } from "@/lib/dal";
import { getUnreadCount } from "@/lib/queries";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const unread = await getUnreadCount(user.id);

  return (
    <div className="container-app flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/90 px-5 py-3 backdrop-blur">
        <Link href="/dashboard">
          <Brand />
        </Link>
        <Link
          href="/notifikasi"
          className="relative rounded-full p-2 text-foreground hover:bg-border/40"
          aria-label="Notifikasi"
        >
          <Bell className="h-5 w-5" aria-hidden />
          {unread > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Link>
      </header>

      <main className="flex-1 px-5 pb-24 pt-5">{children}</main>

      <BottomNav />
    </div>
  );
}

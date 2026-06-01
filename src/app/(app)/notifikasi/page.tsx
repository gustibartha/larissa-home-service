import Link from "next/link";
import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/dal";
import { getNotifications } from "@/lib/queries";
import { markNotificationsReadAction } from "@/lib/actions/profile";
import { cn, formatTanggalWaktu } from "@/lib/utils";

export default async function NotificationsPage() {
  const user = await requireUser();
  const items = await getNotifications(user.id);
  const hasUnread = items.some((n) => !n.read);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Notifikasi
        </h1>
        {hasUnread ? (
          <form action={markNotificationsReadAction}>
            <Button type="submit" variant="soft" size="sm">
              Tandai dibaca
            </Button>
          </form>
        ) : null}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Bell className="h-8 w-8 text-muted" aria-hidden />
            <p className="text-sm text-muted">Belum ada notifikasi.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const body = (
              <Card
                className={cn(
                  !n.read && "border-primary/40 bg-primary-soft/30",
                )}
              >
                <CardContent className="space-y-1">
                  <div className="flex items-start gap-2">
                    {!n.read ? (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    ) : null}
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">{n.body}</p>
                      <p className="mt-1 text-xs text-muted">
                        {formatTanggalWaktu(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            return n.href ? (
              <Link key={n.id} href={n.href}>
                {body}
              </Link>
            ) : (
              <div key={n.id}>{body}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}

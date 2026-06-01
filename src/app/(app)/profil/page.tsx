import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/dal";
import { logoutAction } from "@/lib/actions/auth";
import { ProfileForm } from "./profile-form";

const roleLabel: Record<string, string> = {
  customer: "Pelanggan",
  staff: "Petugas / Nakes",
  admin: "Administrator",
};

export default async function ProfilePage() {
  const user = await requireUser();
  const isStaff = user.role === "staff" || user.role === "admin";

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Profil
      </h1>

      <Card>
        <CardContent className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-fg">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">
              {user.name}
            </p>
            <p className="truncate text-sm text-muted">{user.email}</p>
          </div>
          <Badge
            tone={isStaff ? "primary" : "neutral"}
            className="ml-auto shrink-0"
          >
            {roleLabel[user.role] ?? user.role}
          </Badge>
        </CardContent>
      </Card>

      {isStaff ? (
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary-soft/50 p-4 text-primary"
        >
          <ShieldCheck className="h-5 w-5" aria-hidden />
          <span className="flex-1 text-sm font-semibold">
            Buka Panel Petugas
          </span>
        </Link>
      ) : null}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Data Diri
        </h2>
        <ProfileForm
          defaultName={user.name}
          defaultPhone={user.phone ?? ""}
          defaultAddress={user.address ?? ""}
        />
      </div>

      <form action={logoutAction}>
        <Button
          type="submit"
          variant="outline"
          size="lg"
          className="w-full text-danger"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Keluar
        </Button>
      </form>
    </div>
  );
}

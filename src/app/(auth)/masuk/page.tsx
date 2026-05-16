"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export default function MasukPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Masuk
      </h1>
      <p className="mt-1 text-sm text-muted">
        Selamat datang kembali di Larissa.
      </p>

      <form action={action} className="mt-6 space-y-4">
        {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}

        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="nama@email.com"
            required
          />
        </Field>

        <Field label="Kata Sandi" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Memproses…" : "Masuk"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-medium text-primary">
          Daftar
        </Link>
      </p>

      <div className="mt-6 rounded-xl bg-primary-soft/60 px-4 py-3 text-xs text-primary">
        <p className="font-semibold">Akun demo</p>
        <p className="mt-0.5">Pelanggan: budi@example.com / password123</p>
      </div>
    </div>
  );
}

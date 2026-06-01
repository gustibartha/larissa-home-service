"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export default function DaftarPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Buat Akun
      </h1>
      <p className="mt-1 text-sm text-muted">
        Daftar untuk memesan layanan Home Service.
      </p>

      <form action={action} className="mt-6 space-y-4">
        {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}

        <Field label="Nama Lengkap" htmlFor="name">
          <Input id="name" name="name" placeholder="Nama sesuai KTP" required />
        </Field>

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

        <Field label="Nomor WhatsApp" htmlFor="phone">
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="08xxxxxxxxxx"
            required
          />
        </Field>

        <Field label="Alamat Lengkap" htmlFor="address">
          <Textarea
            id="address"
            name="address"
            placeholder="Jalan, nomor rumah, kelurahan, kota"
            required
          />
        </Field>

        <Field label="Kata Sandi" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            required
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Memproses…" : "Daftar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-medium text-primary">
          Masuk
        </Link>
      </p>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export function ProfileForm({
  defaultName,
  defaultPhone,
  defaultAddress,
}: {
  defaultName: string;
  defaultPhone: string;
  defaultAddress: string;
}) {
  const [state, action, pending] = useActionState(
    updateProfileAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state?.ok ? <Alert tone="success">Profil berhasil diperbarui.</Alert> : null}

      <Field label="Nama Lengkap" htmlFor="name">
        <Input id="name" name="name" defaultValue={defaultName} required />
      </Field>

      <Field label="Nomor WhatsApp" htmlFor="phone">
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          defaultValue={defaultPhone}
          required
        />
      </Field>

      <Field label="Alamat Default" htmlFor="address">
        <Textarea
          id="address"
          name="address"
          defaultValue={defaultAddress}
          required
        />
      </Field>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Menyimpan…" : "Simpan Perubahan"}
      </Button>
    </form>
  );
}

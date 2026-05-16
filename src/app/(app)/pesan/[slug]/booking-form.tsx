"use client";

import { useActionState, useState } from "react";
import { createOrderAction } from "@/lib/actions/order";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

const SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
];

export function BookingForm({
  serviceId,
  defaultAddress,
  defaultPhone,
}: {
  serviceId: string;
  defaultAddress: string;
  defaultPhone: string;
}) {
  const [state, action, pending] = useActionState(
    createOrderAction,
    undefined,
  );
  const [minDate] = useState(() =>
    new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <input type="hidden" name="serviceId" value={serviceId} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Tanggal" htmlFor="date">
          <Input
            id="date"
            name="date"
            type="date"
            min={minDate}
            required
          />
        </Field>
        <Field label="Jam" htmlFor="time">
          <Select id="time" name="time" defaultValue="" required>
            <option value="" disabled>
              Pilih jam
            </option>
            {SLOTS.map((s) => (
              <option key={s} value={s}>
                {s} WIB
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Alamat Kunjungan" htmlFor="address">
        <Textarea
          id="address"
          name="address"
          defaultValue={defaultAddress}
          placeholder="Alamat lengkap untuk kunjungan nakes"
          required
        />
      </Field>

      <Field label="Nomor Kontak" htmlFor="contactPhone">
        <Input
          id="contactPhone"
          name="contactPhone"
          type="tel"
          inputMode="tel"
          defaultValue={defaultPhone}
          placeholder="08xxxxxxxxxx"
          required
        />
      </Field>

      <Field label="Catatan (opsional)" htmlFor="notes">
        <Textarea
          id="notes"
          name="notes"
          placeholder="Patokan lokasi, kondisi khusus, dll."
        />
      </Field>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Memproses…" : "Lanjut ke Pembayaran"}
      </Button>
    </form>
  );
}

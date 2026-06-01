"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { submitLabResultAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, Label } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import type { LabResultItem } from "@/db/schema";

type Row = LabResultItem;

const emptyRow: Row = {
  parameter: "",
  value: "",
  unit: "",
  reference: "",
  flag: "normal",
};

export function LabResultForm({
  orderId,
  initialItems,
  initialNote,
}: {
  orderId: string;
  initialItems: Row[];
  initialNote: string;
}) {
  const [state, action, pending] = useActionState(
    submitLabResultAction,
    undefined,
  );
  const [rows, setRows] = useState<Row[]>(
    initialItems.length > 0 ? initialItems : [{ ...emptyRow }],
  );

  function update(i: number, patch: Partial<Row>) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}
      {state?.ok ? (
        <Alert tone="success">
          Hasil tersimpan &amp; pelanggan telah dinotifikasi.
        </Alert>
      ) : null}

      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="items" value={JSON.stringify(rows)} />

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-border bg-surface p-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">
                Parameter #{i + 1}
              </span>
              {rows.length > 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setRows((p) => p.filter((_, idx) => idx !== i))
                  }
                  className="text-danger"
                  aria-label="Hapus baris"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              ) : null}
            </div>

            <Input
              placeholder="Nama parameter (mis. Hemoglobin)"
              value={row.parameter}
              onChange={(e) => update(i, { parameter: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Hasil"
                value={row.value}
                onChange={(e) => update(i, { value: e.target.value })}
              />
              <Input
                placeholder="Satuan (g/dL)"
                value={row.unit}
                onChange={(e) => update(i, { unit: e.target.value })}
              />
            </div>
            <Input
              placeholder="Nilai rujukan (13.0–17.0)"
              value={row.reference}
              onChange={(e) => update(i, { reference: e.target.value })}
            />
            <Select
              value={row.flag}
              onChange={(e) =>
                update(i, { flag: e.target.value as Row["flag"] })
              }
            >
              <option value="normal">Normal</option>
              <option value="rendah">Rendah</option>
              <option value="tinggi">Tinggi</option>
            </Select>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setRows((p) => [...p, { ...emptyRow }])}
      >
        <Plus className="h-4 w-4" aria-hidden />
        Tambah Parameter
      </Button>

      <div>
        <Label htmlFor="doctorNote">Catatan Dokter (opsional)</Label>
        <Textarea
          id="doctorNote"
          name="doctorNote"
          defaultValue={initialNote}
          placeholder="Interpretasi / saran tindak lanjut"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Menyimpan…" : "Rilis Hasil"}
      </Button>
    </form>
  );
}

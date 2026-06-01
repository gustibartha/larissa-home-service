"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, labResults, notifications, orders } from "@/db";
import { requireStaff } from "@/lib/dal";

export type AdminState = { error?: string; ok?: boolean } | undefined;

const statusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "menunggu",
    "dijadwalkan",
    "proses",
    "selesai",
    "dibatalkan",
  ]),
});

export async function setServiceStatusAction(formData: FormData) {
  await requireStaff();

  const parsed = statusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.id, parsed.data.orderId))
    .limit(1);
  const order = rows[0];
  if (!order) return;

  await db
    .update(orders)
    .set({ serviceStatus: parsed.data.status, updatedAt: new Date() })
    .where(eq(orders.id, order.id));

  const messages: Record<string, string> = {
    proses: "Sampel/pemeriksaan Anda sedang diproses oleh laboratorium.",
    dijadwalkan: "Kunjungan Anda telah dijadwalkan oleh petugas.",
    dibatalkan: "Pesanan Anda dibatalkan oleh petugas.",
  };
  if (messages[parsed.data.status]) {
    await db.insert(notifications).values({
      userId: order.userId,
      title: "Pembaruan status pesanan",
      body: messages[parsed.data.status],
      href: `/pesanan/${order.id}`,
    });
  }

  revalidatePath(`/admin/pesanan/${order.id}`);
  revalidatePath("/admin");
}

const resultSchema = z.object({
  orderId: z.string().min(1),
  doctorNote: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        parameter: z.string().trim().min(1),
        value: z.string().trim().min(1),
        unit: z.string().trim().optional(),
        reference: z.string().trim().optional(),
        flag: z.enum(["normal", "rendah", "tinggi"]).optional(),
      }),
    )
    .min(1, "Minimal satu parameter hasil."),
});

export async function submitLabResultAction(
  _state: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireStaff();

  let itemsRaw: unknown;
  try {
    itemsRaw = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "Format hasil tidak valid." };
  }

  const parsed = resultSchema.safeParse({
    orderId: formData.get("orderId"),
    doctorNote: formData.get("doctorNote") ?? undefined,
    items: itemsRaw,
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data hasil tidak valid.",
    };
  }

  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.id, parsed.data.orderId))
    .limit(1);
  const order = rows[0];
  if (!order) return { error: "Pesanan tidak ditemukan." };

  const existing = await db
    .select()
    .from(labResults)
    .where(eq(labResults.orderId, order.id))
    .limit(1);

  const payload = {
    items: parsed.data.items,
    doctorNote: parsed.data.doctorNote || null,
    releasedAt: new Date(),
  };

  if (existing.length > 0) {
    await db
      .update(labResults)
      .set(payload)
      .where(eq(labResults.orderId, order.id));
  } else {
    await db
      .insert(labResults)
      .values({ orderId: order.id, ...payload });
  }

  await db
    .update(orders)
    .set({ serviceStatus: "selesai", updatedAt: new Date() })
    .where(eq(orders.id, order.id));

  await db.insert(notifications).values({
    userId: order.userId,
    title: "Hasil Lab Sudah Keluar",
    body: "Hasil pemeriksaan Anda sudah tersedia. Ketuk untuk melihat.",
    href: `/pesanan/${order.id}`,
  });

  revalidatePath(`/admin/pesanan/${order.id}`);
  revalidatePath("/admin");
  return { ok: true };
}

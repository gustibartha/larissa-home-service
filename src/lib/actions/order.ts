"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, notifications, orders } from "@/db";
import { getServiceById } from "@/lib/queries";
import { requireUser } from "@/lib/dal";

export type OrderFormState = { error?: string } | undefined;

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().min(1, "Tanggal kunjungan wajib dipilih."),
  time: z.string().min(1, "Jam kunjungan wajib dipilih."),
  address: z.string().trim().min(5, "Alamat kunjungan terlalu pendek."),
  contactPhone: z
    .string()
    .trim()
    .min(8, "Nomor kontak tidak valid.")
    .regex(/^[0-9+]+$/, "Nomor kontak hanya boleh angka."),
  notes: z.string().trim().optional(),
});

export async function createOrderAction(
  _state: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const user = await requireUser();

  const parsed = bookingSchema.safeParse({
    serviceId: formData.get("serviceId"),
    date: formData.get("date"),
    time: formData.get("time"),
    address: formData.get("address"),
    contactPhone: formData.get("contactPhone"),
    notes: formData.get("notes") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const service = await getServiceById(parsed.data.serviceId);
  if (!service) return { error: "Layanan tidak ditemukan." };

  const scheduledAt = new Date(`${parsed.data.date}T${parsed.data.time}:00`);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { error: "Jadwal tidak valid." };
  }
  if (scheduledAt.getTime() < Date.now()) {
    return { error: "Jadwal tidak boleh di masa lalu." };
  }

  let orderId: string;
  try {
    const inserted = await db
      .insert(orders)
      .values({
        userId: user.id,
        serviceId: service.id,
        scheduledAt,
        address: parsed.data.address,
        contactPhone: parsed.data.contactPhone,
        notes: parsed.data.notes || null,
        amount: service.price,
        paymentStatus: "pending",
        serviceStatus: "menunggu",
      })
      .returning({ id: orders.id });
    orderId = inserted[0].id;
  } catch {
    return { error: "Gagal membuat pesanan. Coba lagi." };
  }

  redirect(`/pembayaran/${orderId}`);
}

const paySchema = z.object({
  orderId: z.string().min(1),
  method: z.enum(["gopay", "va_bca", "qris", "ovo"]),
});

export async function payOrderAction(
  _state: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const user = await requireUser();

  const parsed = paySchema.safeParse({
    orderId: formData.get("orderId"),
    method: formData.get("method"),
  });
  if (!parsed.success) {
    return { error: "Pilih metode pembayaran." };
  }

  const rows = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.id, parsed.data.orderId),
        eq(orders.userId, user.id),
      ),
    )
    .limit(1);

  const order = rows[0];
  if (!order) return { error: "Pesanan tidak ditemukan." };
  if (order.paymentStatus === "paid") {
    redirect(`/pesanan/${order.id}`);
  }

  // --- Mock payment gateway ---------------------------------------------
  // Replace this block with a real gateway (Midtrans/Xendit) call later.
  // The interface stays the same: on success -> mark paid + confirm slot.
  await db
    .update(orders)
    .set({
      paymentStatus: "paid",
      paymentMethod: parsed.data.method,
      serviceStatus: "dijadwalkan",
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id));

  await db.insert(notifications).values({
    userId: user.id,
    title: "Pembayaran berhasil",
    body: "Jadwal kunjungan Anda telah dikonfirmasi. Mohon tunggu kedatangan nakes sesuai jadwal.",
    href: `/pesanan/${order.id}`,
  });
  // ----------------------------------------------------------------------

  revalidatePath("/pesanan");
  revalidatePath("/dashboard");
  redirect(`/pesanan/${order.id}?bayar=sukses`);
}

export async function cancelOrderAction(formData: FormData) {
  const user = await requireUser();
  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId) return;

  const rows = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
    .limit(1);
  const order = rows[0];
  if (!order || order.paymentStatus === "paid") return;

  await db
    .update(orders)
    .set({ serviceStatus: "dibatalkan", updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  revalidatePath("/pesanan");
  redirect("/pesanan");
}

"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, notifications, user as userTable } from "@/db";
import { requireUser } from "@/lib/dal";

export type ProfileState = { error?: string; ok?: boolean } | undefined;

const profileSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  phone: z
    .string()
    .trim()
    .min(8, "Nomor HP tidak valid.")
    .regex(/^[0-9+]+$/, "Nomor HP hanya boleh angka."),
  address: z.string().trim().min(5, "Alamat terlalu pendek."),
});

export async function updateProfileAction(
  _state: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const sessionUser = await requireUser();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  await db
    .update(userTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(userTable.id, sessionUser.id));

  revalidatePath("/profil");
  return { ok: true };
}

export async function markNotificationsReadAction() {
  const sessionUser = await requireUser();
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.userId, sessionUser.id));
  revalidatePath("/notifikasi");
  revalidatePath("/dashboard");
}

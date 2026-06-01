"use server";

import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { z } from "zod";
import { auth } from "@/lib/auth";

export type AuthState = { error?: string } | undefined;

const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z.email("Format email tidak valid.").trim(),
  phone: z
    .string()
    .trim()
    .min(8, "Nomor HP tidak valid.")
    .regex(/^[0-9+]+$/, "Nomor HP hanya boleh angka."),
  address: z.string().trim().min(5, "Alamat terlalu pendek."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter."),
});

const loginSchema = z.object({
  email: z.email("Format email tidak valid.").trim(),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export async function registerAction(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const { name, email, phone, address, password } = parsed.data;

  try {
    await auth.api.signUpEmail({
      body: { name, email, password, phone, address },
    });
  } catch (err) {
    if (err instanceof APIError) {
      return {
        error:
          err.body?.message === "User already exists"
            ? "Email sudah terdaftar. Silakan masuk."
            : (err.body?.message ?? "Gagal mendaftar."),
      };
    }
    return { error: "Terjadi kesalahan. Coba lagi." };
  }

  redirect("/dashboard");
}

export async function loginAction(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await auth.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password },
    });
  } catch (err) {
    if (err instanceof APIError) {
      return { error: "Email atau kata sandi salah." };
    }
    return { error: "Terjadi kesalahan. Coba lagi." };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const { headers } = await import("next/headers");
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch {
    // ignore
  }
  redirect("/masuk");
}

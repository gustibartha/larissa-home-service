import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
};

export const getSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
});

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session?.user) return null;
  const u = session.user as unknown as SessionUser & Record<string, unknown>;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: (u.phone as string) ?? null,
    address: (u.address as string) ?? null,
    role: (u.role as string) ?? "customer",
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  return user;
}

export async function requireStaff(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "staff" && user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}

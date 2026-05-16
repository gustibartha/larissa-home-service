import "server-only";

import { desc, eq } from "drizzle-orm";
import {
  db,
  labResults,
  orders,
  services,
  user,
  type LabResult,
  type Order,
  type Service,
} from "@/db";

export type AdminOrder = Order & {
  service: Service;
  customerName: string;
  customerPhone: string | null;
};

export async function getAllOrders(): Promise<AdminOrder[]> {
  const rows = await db
    .select()
    .from(orders)
    .innerJoin(services, eq(orders.serviceId, services.id))
    .innerJoin(user, eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));
  return rows.map((r) => ({
    ...r.orders,
    service: r.services,
    customerName: r.user.name,
    customerPhone: r.user.phone,
  }));
}

export async function getAdminOrder(
  orderId: string,
): Promise<(AdminOrder & { result: LabResult | null }) | undefined> {
  const rows = await db
    .select()
    .from(orders)
    .innerJoin(services, eq(orders.serviceId, services.id))
    .innerJoin(user, eq(orders.userId, user.id))
    .where(eq(orders.id, orderId))
    .limit(1);
  if (rows.length === 0) return undefined;

  const result = await db
    .select()
    .from(labResults)
    .where(eq(labResults.orderId, orderId))
    .limit(1);

  return {
    ...rows[0].orders,
    service: rows[0].services,
    customerName: rows[0].user.name,
    customerPhone: rows[0].user.phone,
    result: result[0] ?? null,
  };
}

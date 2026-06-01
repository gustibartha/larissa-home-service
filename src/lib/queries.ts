import "server-only";

import { and, desc, eq } from "drizzle-orm";
import {
  db,
  labResults,
  notifications,
  orders,
  services,
  type LabResult,
  type Order,
  type Service,
} from "@/db";

export async function getServices(opts?: {
  category?: string;
  homeOnly?: boolean;
}): Promise<Service[]> {
  const where = [eq(services.active, true)];
  if (opts?.category) where.push(eq(services.category, opts.category));
  if (opts?.homeOnly) where.push(eq(services.homeService, true));
  return db
    .select()
    .from(services)
    .where(and(...where))
    .orderBy(services.category, services.name);
}

export async function getServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  const rows = await db
    .select()
    .from(services)
    .where(eq(services.slug, slug))
    .limit(1);
  return rows[0];
}

export async function getServiceById(
  id: string,
): Promise<Service | undefined> {
  const rows = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return rows[0];
}

export type OrderWithService = Order & { service: Service };

export async function getUserOrders(
  userId: string,
): Promise<OrderWithService[]> {
  const rows = await db
    .select()
    .from(orders)
    .innerJoin(services, eq(orders.serviceId, services.id))
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
  return rows.map((r) => ({ ...r.orders, service: r.services }));
}

export async function getOrderForUser(
  orderId: string,
  userId: string,
): Promise<(OrderWithService & { result: LabResult | null }) | undefined> {
  const rows = await db
    .select()
    .from(orders)
    .innerJoin(services, eq(orders.serviceId, services.id))
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
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
    result: result[0] ?? null,
  };
}

export async function getResultsForUser(
  userId: string,
): Promise<(LabResult & { order: Order; service: Service })[]> {
  const rows = await db
    .select()
    .from(labResults)
    .innerJoin(orders, eq(labResults.orderId, orders.id))
    .innerJoin(services, eq(orders.serviceId, services.id))
    .where(eq(orders.userId, userId))
    .orderBy(desc(labResults.releasedAt));
  return rows.map((r) => ({
    ...r.lab_results,
    order: r.orders,
    service: r.services,
  }));
}

export async function getNotifications(userId: string) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(30);
}

export async function getUnreadCount(userId: string): Promise<number> {
  const rows = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.read, false),
      ),
    );
  return rows.length;
}

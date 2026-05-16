import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const uuid = () => crypto.randomUUID();

// ---------------------------------------------------------------------------
// Better Auth core tables (table/column names must match Better Auth defaults)
// ---------------------------------------------------------------------------

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  // Application profile fields (PRD: Pengguna)
  phone: text("phone"),
  address: text("address"),
  role: text("role").notNull().default("customer"), // customer | staff | admin
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ---------------------------------------------------------------------------
// Domain tables (PRD: Layanan, Pemesanan, Hasil Lab, Notifikasi)
// ---------------------------------------------------------------------------

export const services = sqliteTable("services", {
  id: text("id").primaryKey().$defaultFn(uuid),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(), // "Laboratorium" | "Non-Laboratorium"
  group: text("group"), // e.g. Hematologi, Radiologi
  price: integer("price").notNull(),
  preparation: text("preparation"), // e.g. "Wajib puasa 8 jam"
  description: text("description"),
  homeService: integer("home_service", { mode: "boolean" })
    .notNull()
    .default(true),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().$defaultFn(uuid),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  serviceId: text("service_id")
    .notNull()
    .references(() => services.id),
  scheduledAt: integer("scheduled_at", { mode: "timestamp" }).notNull(),
  address: text("address").notNull(),
  contactPhone: text("contact_phone").notNull(),
  notes: text("notes"),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method"), // gopay | va_bca | qris ...
  // pending | paid | failed
  paymentStatus: text("payment_status").notNull().default("pending"),
  // menunggu | dijadwalkan | proses | selesai | dibatalkan
  serviceStatus: text("service_status").notNull().default("menunggu"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const labResults = sqliteTable("lab_results", {
  id: text("id").primaryKey().$defaultFn(uuid),
  orderId: text("order_id")
    .notNull()
    .unique()
    .references(() => orders.id, { onDelete: "cascade" }),
  // JSON array: [{ parameter, value, unit, reference, flag }]
  items: text("items", { mode: "json" })
    .notNull()
    .$type<LabResultItem[]>(),
  doctorNote: text("doctor_note"),
  releasedAt: integer("released_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey().$defaultFn(uuid),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  href: text("href"),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type LabResultItem = {
  parameter: string;
  value: string;
  unit?: string;
  reference?: string;
  flag?: "normal" | "rendah" | "tinggi";
};

export type User = typeof user.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type LabResult = typeof labResults.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export { sql };

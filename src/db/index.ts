import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// libSQL works with a local file (file:./larissa.db) in development and a
// remote Turso database (libsql://... + auth token) in production/Vercel.
const url =
  process.env.TURSO_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "file:./larissa.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const globalForDb = globalThis as unknown as { libsql?: Client };

const client =
  globalForDb.libsql ?? createClient({ url, authToken });

if (process.env.NODE_ENV !== "production") {
  globalForDb.libsql = client;
}

export const db = drizzle(client, { schema });
export * from "./schema";

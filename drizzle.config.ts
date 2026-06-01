import { defineConfig } from "drizzle-kit";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export default defineConfig(
  tursoUrl
    ? {
        dialect: "turso",
        schema: "./src/db/schema.ts",
        out: "./drizzle",
        dbCredentials: { url: tursoUrl, authToken },
      }
    : {
        dialect: "sqlite",
        schema: "./src/db/schema.ts",
        out: "./drizzle",
        dbCredentials: {
          url: process.env.DATABASE_URL ?? "file:./larissa.db",
        },
      },
);

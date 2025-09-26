import { defineConfig } from "drizzle-kit";
import { env } from "./env";

export default defineConfig({
  dialect: "postgresql",
  casing: "snake_case",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});

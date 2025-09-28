import { Pool } from "pg";
import { env } from "../schemas/env.ts";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "../../drizzle/schema.ts";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema,
  casing: "snake_case",
});

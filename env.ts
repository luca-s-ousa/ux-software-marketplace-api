import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(7383),
  DATABASE_URL: z.string().startsWith("postgres://"),
  REDIS_URL: z.string().startsWith("redis://"),
  EXPIRE_TIME_REDIS: z.coerce.number(),
});

export const env = envSchema.parse(process.env);

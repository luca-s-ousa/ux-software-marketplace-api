import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(7383),
  DATABASE_URL: z.string().startsWith("postgres://"),
  REDIS_URL: z.string().startsWith("redis://"),
  EXPIRE_TIME_REDIS: z.coerce.number(),
  JWT_SECRET: z.string(),
  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.coerce.number(),
  MINIO_USE_SSL: z.string(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
});

export const env = envSchema.parse(process.env);

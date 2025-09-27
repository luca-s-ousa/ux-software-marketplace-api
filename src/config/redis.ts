import { env } from "../../env.ts";
import { createClient } from "redis";

export const redis = createClient({
  url: env.REDIS_URL,
});

redis.on("error", (err) => console.log("Redis Error ", err));

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("✅ Redis conectado");
  }
};

import express from "express";
import { env } from "../env.ts";
import cors from "cors";
import { connectRedis } from "./config/redis.ts";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = env.PORT;

const startup = async () => {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
};

startup();

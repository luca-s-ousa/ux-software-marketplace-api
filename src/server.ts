import express from "express";
import { env } from "../env.ts";
import cors from "cors";
import { connectRedis } from "./config/redis.ts";
import usersRoutes from "./routes/users.route.ts";
import authRoutes from "./routes/auth.route.ts";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = env.PORT;

app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);

const startup = async () => {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
};

startup();

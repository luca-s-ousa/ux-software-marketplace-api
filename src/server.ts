import express from "express";
import { env } from "./schemas/env.ts";
import cors from "cors";
import { connectRedis } from "./config/redis.ts";
import usersRoutes from "./routes/users.route.ts";
import authRoutes from "./routes/auth.route.ts";
import productsRoutes from "./routes/products.route.ts";
import cartsRoutes from "./routes/carts.route.ts";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = env.PORT;

app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

const startup = async () => {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
};

startup();

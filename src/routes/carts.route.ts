import express from "express";
import { authGuard } from "../middlewares/auth.middleware.ts";
import { getAllItensCart } from "../controllers/carts.controller.ts";

const router = express.Router();

router.get("/", authGuard, getAllItensCart);

export default router;

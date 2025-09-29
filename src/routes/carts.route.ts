import express from "express";
import { authGuard } from "../middlewares/auth.middleware.ts";
import {
  addItemToCart,
  getAllItensCart,
} from "../controllers/carts.controller.ts";
import { validate } from "../middlewares/zod.middleware.ts";
import { createOrUpdateCartItemsSchema } from "../schemas/carts.ts";
import {
  normalizeNumberCartItems,
  validateExistingCart,
} from "../middlewares/carts.middleware.ts";
import { validateStockProduct } from "../middlewares/product.middleware.ts";

const router = express.Router();

router.get("/", authGuard, getAllItensCart);
router.post(
  "/items",
  authGuard,
  normalizeNumberCartItems,
  validate(createOrUpdateCartItemsSchema),
  validateExistingCart,
  validateStockProduct,
  addItemToCart
);

export default router;

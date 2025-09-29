import express from "express";
import { authGuard } from "../middlewares/auth.middleware.ts";
import {
  addItemToCart,
  getAllItensCart,
  removeItemFromCart,
} from "../controllers/carts.controller.ts";
import { validate } from "../middlewares/zod.middleware.ts";
import { createOrUpdateCartItemsSchema } from "../schemas/carts.ts";
import {
  normalizeNumberCartItems,
  validateExistingCart,
  validateExistingItemInCart,
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

router.delete(
  "/items/:id",
  authGuard,
  validateExistingItemInCart,
  removeItemFromCart
);

export default router;

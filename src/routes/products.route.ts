import express from "express";
import { authGuard } from "../middlewares/auth.middleware.ts";
import { adminOnly } from "../middlewares/users.middleware.ts";
import multer from "multer";
import {
  addNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProcuctById,
} from "../controllers/products.controller.ts";
import {
  addNewProductSchema,
  updateProductSchema,
} from "../schemas/products.ts";
import { validate } from "../middlewares/zod.middleware.ts";
import {
  normalizeProductNumbers,
  validateProductId,
} from "../middlewares/product.middleware.ts";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/products
router.post(
  "/",
  upload.single("file"),
  validate(addNewProductSchema),
  authGuard,
  adminOnly,
  addNewProduct
);

router.get("/", getAllProducts);
router.get("/:id", validateProductId, getProductById);
router.delete(
  "/:id",
  authGuard,
  adminOnly,
  validateProductId,
  deleteProductById
);
router.put(
  "/:id",
  upload.single("file"),
  normalizeProductNumbers,
  validate(updateProductSchema),
  authGuard,
  adminOnly,
  validateProductId,
  updateProcuctById
);

export default router;

import express from "express";
import { authGuard } from "../middlewares/auth.middleware.ts";
import { adminOnly } from "../middlewares/users.middleware.ts";
import multer from "multer";
import {
  addNewProduct,
  getAllProducts,
  getProductById,
} from "../controllers/products.controller.ts";
import { addNewProductSchema } from "../schemas/products.ts";
import { validate } from "../middlewares/zod.middleware.ts";
import { validateProductId } from "../middlewares/product.middleware.ts";

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

export default router;

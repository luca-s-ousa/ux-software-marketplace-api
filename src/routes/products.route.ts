import express from "express";
import { authGuard } from "../middlewares/auth.middleware.ts";
import { adminOnly } from "../middlewares/users.middleware.ts";
import multer from "multer";
import { addNewProduct } from "../controllers/products.controller.ts";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/products
router.post("/", authGuard, adminOnly, upload.single("file"), addNewProduct);

export default router;

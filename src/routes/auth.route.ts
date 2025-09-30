import express from "express";
import { login } from "../controllers/auth.controller.ts";
import { validate } from "../middlewares/zod.middleware.ts";
import { loginSchema } from "../schemas/auth.ts";
import {
  validateEmailQuery,
  validateTokenQuery,
} from "../middlewares/users.middleware.ts";
import { confirmUser } from "../controllers/users.controller.ts";

const router = express.Router();

// POST /api/auth/login
// Rota de Login de Usuários
router.post("/login", validate(loginSchema), login);
router.get("/confirm", validateEmailQuery, validateTokenQuery, confirmUser);

export default router;

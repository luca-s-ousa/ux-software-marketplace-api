import express from "express";
import { login } from "../controllers/auth.controller.ts";
import { validate } from "../middlewares/zod.middleware.ts";
import { loginSchema } from "../schemas/auth.ts";

const router = express.Router();

// POST /api/auth/login
// Rota de Login de Usuários
router.post("/login", validate(loginSchema), login);

export default router;

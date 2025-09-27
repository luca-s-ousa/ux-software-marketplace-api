import express from "express";
import { login } from "../controllers/auth.controller.ts";

const router = express.Router();

// POST /api/auth/login
// Rota de Login de Usuários
router.post("/login", login);

export default router;

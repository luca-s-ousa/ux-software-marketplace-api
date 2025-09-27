import express from "express";
import { registerNewUser } from "../controllers/users.controller.ts";

const router = express.Router();

// POST /api/users
// Criar Usuarios
router.post("/", registerNewUser);

export default router;

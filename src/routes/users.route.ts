import express from "express";
import { registerNewUser } from "../controllers/users.controller.ts";
import { validate } from "../middlewares/zod.middleware.ts";
import { registerUserSchema } from "../schemas/users.ts";
import {
  alreadyExistsUserWithCpf,
  alreadyExistsUserWithEmail,
} from "../middlewares/users.middleware.ts";

const router = express.Router();

// POST /api/users
// Criar Usuarios
router.post(
  "/",
  validate(registerUserSchema),
  alreadyExistsUserWithEmail,
  alreadyExistsUserWithCpf,
  registerNewUser
);

export default router;

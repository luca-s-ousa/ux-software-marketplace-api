import express from "express";
import { registerNewUser } from "../controllers/users.controller.ts";
import { validate } from "../middlewares/zod.middleware.ts";
import { registerUserSchema } from "../schemas/users.ts";
import {
  alreadyExistsUserWithCpf,
  alreadyExistsUserWithEmail,
} from "../middlewares/users.middleware.ts";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registro de novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - cpf
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 example: João Silva
 *               cpf:
 *                 type: string
 *                 pattern: '^\d{3}\.\d{3}\.\d{3}-\d{2}$'
 *                 example: "123.456.789-00"
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 pattern: '^\(\d{2}\) 9\d{4}-\d{4}$'
 *                 example: "(11) 91234-5678"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "minhasenha123"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro de validação nos dados enviados
 *       409:
 *         description: Usuário já existe com esse e-mail ou CPF
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  "/",
  validate(registerUserSchema),
  alreadyExistsUserWithEmail,
  alreadyExistsUserWithCpf,
  registerNewUser
);

export default router;

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
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login do usuário
 *     description: Autentica o usuário com email e senha e retorna um token JWT.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "usuario@exemplo.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 minLength: 6
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuário logado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token JWT de autenticação
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Credenciais inválidas ou conta não confirmada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Credenciais inválidas!"
 *       500:
 *         description: Erro inesperado no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro Inesperado"
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /auth/confirm:
 *   get:
 *     summary: Confirmação de conta do usuário
 *     description: Confirma a conta do usuário através de um token enviado por email. Caso o token seja inválido ou expirado, envia um novo link de confirmação.
 *     tags:
 *       - Autenticação
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Token de confirmação enviado por email
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email do usuário a ser confirmado
 *         example: "usuario@exemplo.com"
 *     responses:
 *       200:
 *         description: Conta confirmada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Conta confirmada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "c1a1d1e1-1234-5678-9abc-def123456789"
 *                     name:
 *                       type: string
 *                       example: "Lucas Sousa"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "usuario@exemplo.com"
 *       400:
 *         description: Token ou email inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token inválido"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       500:
 *         description: Erro inesperado no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro Inesperado"
 */
router.get("/confirm", validateEmailQuery, validateTokenQuery, confirmUser);

export default router;

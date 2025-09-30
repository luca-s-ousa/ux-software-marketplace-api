import express from "express";
import { authGuard } from "../middlewares/auth.middleware.ts";
import {
  addItemToCart,
  getAllItensCart,
  removeItemFromCart,
} from "../controllers/carts.controller.ts";
import { validate } from "../middlewares/zod.middleware.ts";
import { createOrUpdateCartItemsSchema } from "../schemas/carts.ts";
import {
  normalizeNumberCartItems,
  validateExistingCart,
  validateExistingItemInCart,
} from "../middlewares/carts.middleware.ts";
import { validateStockProduct } from "../middlewares/product.middleware.ts";

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Listar itens do carrinho do usuário
 *     description: Retorna todos os itens do carrinho do usuário autenticado, incluindo detalhes do produto.
 *     tags:
 *       - Carrinho
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Itens do carrinho retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "c1a1d1e1-1234-5678-9abc-def123456789"
 *                       productId:
 *                         type: string
 *                         format: uuid
 *                         example: "a9f1b2c3-4567-8901-bcde-f1234567890a"
 *                       name:
 *                         type: string
 *                         example: "Notebook Dell Inspiron"
 *                       description:
 *                         type: string
 *                         example: "Notebook potente para trabalho e estudos."
 *                       price:
 *                         type: number
 *                         example: 3999.90
 *                       stock:
 *                         type: integer
 *                         example: 15
 *                       imgUrl:
 *                         type: string
 *                         example: "https://cdn.meusite.com/produtos/notebook.jpg"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       cartId:
 *                         type: string
 *                         format: uuid
 *                         example: "d4e5f6a7-8901-2345-bcde-f1234567890a"
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: "u1234567-8901-2345-bcde-f1234567890a"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-29T18:30:00Z"
 *       401:
 *         description: Usuário não autenticado
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
router.get("/", authGuard, getAllItensCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Adicionar ou atualizar item no carrinho
 *     description: Adiciona um item no carrinho do usuário autenticado ou atualiza a quantidade se já existir. Valida estoque e carrinho existente.
 *     tags:
 *       - Carrinho
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: ID do produto a ser adicionado
 *                 example: "a9f1b2c3-4567-8901-bcde-f1234567890a"
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantidade de produtos a adicionar
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item adicionado ou atualizado com sucesso
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
 *                   example: "Item adicionado no carrinho"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "c1a1d1e1-1234-5678-9abc-def123456789"
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                       example: "a9f1b2c3-4567-8901-bcde-f1234567890a"
 *                     name:
 *                       type: string
 *                       example: "Notebook Dell Inspiron"
 *                     description:
 *                       type: string
 *                       example: "Notebook potente para trabalho e estudos."
 *                     price:
 *                       type: number
 *                       example: 3999.90
 *                     stock:
 *                       type: integer
 *                       example: 15
 *                     imgUrl:
 *                       type: string
 *                       example: "https://cdn.meusite.com/produtos/notebook.jpg"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-29T18:30:00Z"
 *       400:
 *         description: Quantidade inválida ou estoque insuficiente
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Carrinho não encontrado
 *       500:
 *         description: Erro inesperado no servidor
 */
router.post(
  "/items",
  authGuard,
  normalizeNumberCartItems,
  validate(createOrUpdateCartItemsSchema),
  validateExistingCart,
  validateStockProduct,
  addItemToCart
);

/**
 * @swagger
 * /cart/items/{id}:
 *   delete:
 *     summary: Remover item do carrinho
 *     description: Remove um item específico do carrinho do usuário autenticado.
 *     tags:
 *       - Carrinho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do item no carrinho a ser removido
 *         example: "c1a1d1e1-1234-5678-9abc-def123456789"
 *     responses:
 *       200:
 *         description: Item removido do carrinho com sucesso
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
 *                   example: "Item removido do carrinho"
 *       400:
 *         description: ID do item inválido
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
 *                   example: "ID do item inválido"
 *       401:
 *         description: Usuário não autenticado
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
 *         description: Item não encontrado no carrinho
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
 *                   example: "Item não encontrado no carrinho"
 *       500:
 *         description: Erro inesperado no servidor
 */
router.delete(
  "/items/:id",
  authGuard,
  validateExistingItemInCart,
  removeItemFromCart
);

export default router;

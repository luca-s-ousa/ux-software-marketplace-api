import express from "express";
import { authGuard } from "../middlewares/auth.middleware.ts";
import { adminOnly } from "../middlewares/users.middleware.ts";
import multer from "multer";
import {
  addNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProcuctById,
} from "../controllers/products.controller.ts";
import {
  addNewProductSchema,
  updateProductSchema,
} from "../schemas/products.ts";
import { validate } from "../middlewares/zod.middleware.ts";
import {
  normalizeProductNumbers,
  validateProductId,
} from "../middlewares/product.middleware.ts";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Adiciona um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagem do produto
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Notebook Dell Inspiron
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 nullable: true
 *                 example: Notebook potente para trabalho e estudos.
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 3999.90
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 15
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas administradores podem acessar
 *       500:
 *         description: Erro interno
 */
router.post(
  "/",
  upload.single("file"),
  validate(addNewProductSchema),
  authGuard,
  adminOnly,
  addNewProduct
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista produtos
 *     tags: [Produtos]
 *     description: Retorna produtos paginados, podendo filtrar por categoria ou buscar pelo nome.
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *         required: false
 *         description: Nome da categoria para filtrar
 *         example: Notebooks
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Busca por nome do produto
 *         example: Dell
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Quantidade de itens por página
 *         example: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Número da página
 *         example: 2
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca produto por ID
 *     tags: [Produtos]
 *     description: Retorna os detalhes de um produto a partir do seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *       400:
 *         description: ID de produto inválido
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro inesperado
 */
router.get("/:id", validateProductId, getProductById);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Produtos]
 *     description: Remove um produto existente pelo seu ID. Requer autenticação de administrador.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       400:
 *         description: ID de produto inválido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas administradores podem excluir produtos
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro inesperado
 */
router.delete(
  "/:id",
  authGuard,
  adminOnly,
  validateProductId,
  deleteProductById
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Produtos]
 *     description: Atualiza os dados de um produto existente. Requer autenticação de administrador.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *       - in: query
 *         name: categorieId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: ID da categoria para atualizar
 *         example: 66d9b1c0-18a3-4c43-bc56-6d3a50a8e77e
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Nova imagem do produto
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Notebook Dell Inspiron Plus
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Modelo atualizado com mais memória RAM.
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 4599.90
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 25
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas administradores podem atualizar produtos
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno
 */
router.put(
  "/:id",
  upload.single("file"),
  normalizeProductNumbers,
  validate(updateProductSchema),
  authGuard,
  adminOnly,
  validateProductId,
  updateProcuctById
);

export default router;

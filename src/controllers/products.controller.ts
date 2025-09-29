import express from "express";
import type { Product, ProductBodyParams } from "../types/products.ts";
import { db } from "../config/db.ts";
import { categoriesTable, productsTable } from "../../drizzle/schema.ts";
import path from "path";
import { deleteImg, uploadImg, urlImgProduct } from "../services/minio.ts";
import { and, eq, ilike, sql } from "drizzle-orm";

export const addNewProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, price, stock, description } = req.body as ProductBodyParams;
    const categorieId = req.query.categorieId as string;
    const file = req.file;

    const [product] = await db
      .insert(productsTable)
      .values({
        name,
        price,
        stock,
        description,
        categorieId: categorieId || null,
      })
      .returning();

    if (file) {
      const { id: idProduct } = product;

      const ext = path.extname(file.originalname);

      const objectName = `${idProduct}${ext}`;
      const bucket = "marketplace-ux";

      await uploadImg(bucket, `products/${objectName}`, file.buffer, file.size);

      const urlImg = urlImgProduct(bucket, `products/${objectName}`);

      const [productUpdated] = await db
        .update(productsTable)
        .set({ imgUrl: urlImg.data[0]["link"] })
        .returning();

      return res.status(200).json({
        success: true,
        message: "Produto criado com sucesso",
        data: { ...productUpdated },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Produto criado com sucesso",
      data: { ...product },
    });
  } catch (error) {
    console.error("Erro ao adicionar um novo produto: ", error);
    return res.status(500).json({
      success: false,
      message: "Erro Inesperado",
    });
  }
};

export const getAllProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { categorie, search, limit = "10", page = "1" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const conditions = [];
    if (search) {
      const searchNormalized = (search as string).toLowerCase().trim();
      conditions.push(
        ilike(sql`LOWER(${productsTable.name})`, `%${searchNormalized}%`)
      );
    }

    if (categorie) {
      const normalizedCat = String(categorie).trim().toLowerCase();

      const [categorieRow] = await db
        .select()
        .from(categoriesTable)
        .where(
          ilike(sql`LOWER(${categoriesTable.name})`, `%${normalizedCat}%`)
        );

      if (!categorieRow) {
        return res.status(404).json({
          success: false,
          message: "Categoria não encontrada",
          data: {
            items: [],
            total: 0,
            page: Number(page),
            limit: Number(limit),
          },
        });
      }
      conditions.push(eq(productsTable.categorieId, categorieRow.id));
    }

    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        imgUrl: productsTable.imgUrl,
        description: productsTable.description,
        price: productsTable.price,
        stock: productsTable.stock,
        createdAt: productsTable.createdAt,
        categorieId: productsTable.categorieId,
        categorieName: categoriesTable.name,
      })
      .from(productsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .leftJoin(
        categoriesTable,
        eq(productsTable.categorieId, categoriesTable.id)
      )
      .limit(Number(limit))
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql`COUNT(*)` })
      .from(productsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return res.status(200).json({
      success: true,
      message: "Produtos listados com sucesso",
      data: {
        products,
        total: Number(count),
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Erro ao listar produtos: ", error);
    return res.status(500).json({
      success: false,
      message: "Erro Inesperado",
    });
  }
};

export const getProductById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const product = req.product as Product;

    return res
      .status(200)
      .json({ success: true, message: "Produto encontrado", data: product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro Inesperado",
    });
  }
};

export const deleteProductById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const product = req.product as Product;

    await db.delete(productsTable).where(eq(productsTable.id, product.id!));

    if (product.imgUrl) {
      const ext = path.extname(product.imgUrl);
      await deleteImg("marketplace-ux", `products/${product.id}${ext}`);
    }

    return res.status(200).json({
      success: true,
      message: "Produto deletado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro Inesperado",
    });
  }
};

import express from "express";
import { db } from "../config/db.ts";
import { categoriesTable, productsTable } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import type { Product } from "../types/products.ts";

export const validateProductId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const productId = req.params.id as string;

    if (
      !productId ||
      !productId.match(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Id de produto inválido",
      });
    }

    const product = await db
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
      .leftJoin(
        categoriesTable,
        eq(productsTable.categorieId, categoriesTable.id)
      )
      .where(eq(productsTable.id, productId));

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    const productDto: Product & { categorieName: string | null } = {
      ...product[0],
      createdAt: product[0].createdAt.toISOString(),
    };

    req.product = { ...productDto };

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro inesperado",
    });
  }
};

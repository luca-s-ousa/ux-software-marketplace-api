import express from "express";
import type { ProductBodyParams } from "../types/products.ts";
import { db } from "../config/db.ts";
import { productsTable } from "../../drizzle/schema.ts";
import path from "path";
import { uploadImg, urlImgProduct } from "../services/minio.ts";

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

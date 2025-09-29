import express from "express";
import { db } from "../config/db.ts";
import { cartsTable, cartItemsTable } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";

export const getAllItensCart = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.user!.id as string;

    const cartItems = await db
      .select({
        id: cartItemsTable.id,
        productId: cartItemsTable.productId,
        quantity: cartItemsTable.quantity,
        cartId: cartsTable.id,
        userId: cartsTable.userId,
      })
      .from(cartItemsTable)
      .leftJoin(cartsTable, eq(cartItemsTable.cartId, cartsTable.id))
      .where(eq(cartsTable.userId, userId));

    return res.status(200).json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    console.error("Erro ao buscar itens do carrinho: ", error);
    return res.status(500).json({
      success: false,
      message: "Erro Inesperado",
    });
  }
};

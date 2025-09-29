import express from "express";
import { db } from "../config/db.ts";
import {
  cartsTable,
  cartItemsTable,
  productsTable,
} from "../../drizzle/schema.ts";
import { and, eq } from "drizzle-orm";
import type { Cart } from "../types/carts.ts";

export const getAllItensCart = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.user!.userId as string;

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

export const addItemToCart = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id: cartId } = req.cart! as Cart;
    const { productId, quantity } = req.body;

    const [existingItem] = await db
      .select()
      .from(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.cartId, cartId),
          eq(cartItemsTable.productId, productId)
        )
      )
      .limit(1);

    let item;
    if (existingItem) {
      [item] = await db
        .update(cartItemsTable)
        .set({ quantity })
        .where(eq(cartItemsTable.id, existingItem.id))
        .returning();
    } else {
      [item] = await db
        .insert(cartItemsTable)
        .values({
          cartId: cartId as string,
          productId: productId as string,
          quantity: Number(quantity),
        })
        .returning();
    }

    const [itemWithProduct] = await db
      .select({
        id: cartItemsTable.id,
        quantity: cartItemsTable.quantity,
        productId: cartItemsTable.productId,
        name: productsTable.name,
        description: productsTable.description,
        price: productsTable.price,
        stock: productsTable.stock,
        imgUrl: productsTable.imgUrl,
        createdAt: productsTable.createdAt,
      })
      .from(cartItemsTable)
      .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .where(eq(cartItemsTable.id, item.id))
      .limit(1);
    return res.status(200).json({
      success: true,
      message: "Item adicionado no carrinho",
      data: itemWithProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro inesperado",
    });
  }
};

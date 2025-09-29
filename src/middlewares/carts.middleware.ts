import express from "express";
import { db } from "../config/db.ts";
import { cartItemsTable, cartsTable } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import type { Cart } from "../types/carts.ts";

export const normalizeNumberCartItems = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.body.quantity) req.body.quantity = Number(req.body.quantity);
  next();
};

export const validateExistingCart = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = req.user?.userId as string;
  const [cart] = await db
    .select()
    .from(cartsTable)
    .where(eq(cartsTable.userId, userId));

  if (!cart) {
    console.log(req.user);

    return res.status(404).json({
      success: false,
      message: "Carrinho não encontrado",
    });
  }

  const cartDto: Cart = { ...cart, createdAt: cart.createdAt.toISOString() };

  req.cart = cartDto;

  next();
};

export const validateExistingItemInCart = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;

  if (
    !id ||
    !id.match(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "ID do item inválido",
    });
  }

  const [cartItem] = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.id, id))
    .limit(1);

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: "Item não encontrado no carrinho",
    });
  }

  req.cartItem = cartItem;

  next();
};

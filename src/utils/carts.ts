import { eq } from "drizzle-orm";
import { cartsTable } from "../../drizzle/schema.ts";
import { db } from "../config/db.ts";

export const createCart = async (userId: string) => {
  const [existsCart] = await db
    .select()
    .from(cartsTable)
    .where(eq(cartsTable.userId, userId));

  if (existsCart) {
    return existsCart;
  }

  const [newCart] = await db.insert(cartsTable).values({ userId }).returning();

  return newCart;
};

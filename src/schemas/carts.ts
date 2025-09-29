import z from "zod";

export const createOrUpdateCartItemsSchema = z.object({
  productId: z.uuid("Id de produto inválido"),
  quantity: z
    .number("Quantidade inválida")
    .min(1, "A quantidade mínima é 1")
    .nonnegative("A quantidade não pode ser negativa"),
});

import z from "zod";

export const addNewProductSchema = z.object({
  name: z
    .string("Você precisa informar um nome para o produto!")
    .min(2, "O nome do produto deve ter pelo menos 2 caracteres!"),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo somente 500 caracteres!")
    .nullable()
    .optional(),
  price: z.number("Preço inválido!").nonnegative("Preço inválido"),
  stock: z.number("Estoque inválido!").nonnegative("Estoque inválido!"),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do produto deve ter pelo menos 2 caracteres!")
    .nullable()
    .optional(),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo somente 500 caracteres!")
    .nullable()
    .optional(),
  price: z
    .number("Preço inválido!")
    .nonnegative("Preço inválido")
    .nullable()
    .optional(),
  stock: z
    .number("Estoque inválido!")
    .nonnegative("Estoque inválido!")
    .nullable()
    .optional(),
});

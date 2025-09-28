import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.email("Email Inválido"),
  name: z
    .string("Você precisa informar um nome!")
    .min(3, "O nome precisa ter pelo menos 3 caracteres!"),
  cpf: z
    .string("Você precisa informar um cpf!")
    .regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      "CPF deve estar no formato XXX.XXX.XXX-XX"
    ),
  phone: z
    .string("Você precisa informar um telefone!")
    .regex(
      /^\(\d{2}\) 9\d{4}-\d{4}$/,
      "Telefone deve estar no formato (XX) 9XXXX-XXXX"
    )
    .optional()
    .nullable(),
  password: z
    .string("Você precisa informar uma senha!")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

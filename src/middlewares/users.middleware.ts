import express from "express";
import type { UserRequest } from "../types/users.ts";
import { db } from "../config/db.ts";
import { usersTable } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";

export const adminOnly = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { isAdmin } = req.user as UserRequest;

  if (!isAdmin) {
    return res.status(401).json({
      success: false,
      message: "Não autorizado",
    });
  }

  next();
};

export const alreadyExistsUserWithEmail = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const email = req.body.email as string;
    const validateEmail = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (validateEmail.length > 0)
      return res.status(400).json({
        success: false,
        message: "Esse usuário já existe",
      });

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erro inesperado" });
  }
};

export const alreadyExistsUserWithCpf = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const cpf = req.body.cpf as string;

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.cpf, cpf));

    if (existing.length > 0)
      return res.status(400).json({
        success: false,
        message: "Esse usuário já existe no sistema!",
      });

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro inesperado",
    });
  }
};

export const validateTokenQuery = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { token } = req.query;

  if (
    !token ||
    typeof token !== "string" ||
    !token.match(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Token inválido",
    });
  }

  next();
};

export const validateEmailQuery = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const email = req.query.email as string;

  if (
    !email ||
    typeof email !== "string" ||
    !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  ) {
    return res.status(400).json({
      success: false,
      message: "Email inválido",
    });
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Usuário não encontrado",
    });
  }

  req.user = {
    ...user,
    userId: user.id,
    createdAt: user.createdAt.toISOString(),
  } as UserRequest;

  next();
};

import express from "express";
import { db } from "../config/db.ts";
import { usersTable } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../schemas/env.ts";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user || !user.password) {
      return res
        .status(400)
        .json({ success: false, message: "Credenciais inválidas!" });
    }

    if (!user.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Conta não confirmada!" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      env.JWT_SECRET,
      { expiresIn: "5d" }
    );
    res.status(200).json({
      success: true,
      message: "Usuário logado com sucesso",
      data: { token },
    });
  } catch (error) {
    console.error("Erro ao logar o usuario: ", error);
    return res.status(500).json({
      success: false,
      message: "Erro Inesperado",
    });
  }
};

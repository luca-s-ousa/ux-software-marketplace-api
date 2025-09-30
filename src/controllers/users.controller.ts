// import { Request, Response } from "express";
import express from "express";
import { db } from "../config/db.ts";
import { usersTable } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { stringifyJson } from "../utils/json.ts";
import { v4 as uuidv4 } from "uuid";
import { redis } from "../config/redis.ts";
import { env } from "../schemas/env.ts";
import { sendWebhook } from "../services/send.email.ts";
import { createCart } from "../utils/carts.ts";
import type { UserRequest } from "../types/users.ts";

export const registerNewUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { cpf, password, name, email, phone } = req.body;

    const hashed = await bcrypt.hash(password as string, 10);
    const [user] = await db
      .insert(usersTable)
      .values({ name, email, password: hashed, cpf, phone })
      .returning();

    await createCart(user.id);

    const { password: _, ...dataUser } = user;

    const token = uuidv4();

    const campos = { email, token };
    const dados = stringifyJson(campos, "stringify");

    const keyAccessToken = token as string;

    await redis.hSet(keyAccessToken, dados as Record<string, string>);
    await redis.expire(keyAccessToken, Number(env.EXPIRE_TIME_REDIS) || 3600);

    const responseSendEmail = await sendWebhook({
      email,
      name,
      link: `${env.ENDPOINT_API}/api/auth/confirm?token=${token}&email=${email}`,
    });

    return res.status(200).json({
      success: true,
      message: "Conta criada com sucesso",
      data: { ...dataUser, sendEmail: responseSendEmail?.success },
    });
  } catch (error) {
    console.error("Erro ao registrar o usuario: ", error);
    return res.status(500).json({
      success: false,
      message: "Erro Inesperado",
    });
  }
};

export const confirmUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token = req.query.token as string;
    const { email: emailUser, name } = req.user as UserRequest;

    const userData = await redis.hGetAll(token);

    if (!userData || Object.keys(userData).length === 0) {
      const newToken = uuidv4();
      const campos = { email: emailUser, token: newToken };
      const dados = stringifyJson(campos, "stringify");

      const keyAccessToken = newToken as string;

      await redis.hSet(keyAccessToken, dados as Record<string, string>);
      await redis.expire(keyAccessToken, Number(env.EXPIRE_TIME_REDIS) || 3600);

      const responseSendEmail = await sendWebhook({
        email: emailUser,
        name,
        link: `${env.ENDPOINT_API}/api/auth/confirm?token=${newToken}&email=${emailUser}`,
      });
      return res.status(400).json({
        success: true,
        message: "Enviamos um novo link de confirmação para seu email",
        data: { ...responseSendEmail },
      });
    }

    const { email } = userData;

    const [updatedUser] = await db
      .update(usersTable)
      .set({ isActive: true })
      .where(eq(usersTable.email, email))
      .returning();

    await redis.del(token);

    return res.status(200).json({
      success: true,
      message: "Conta confirmada com sucesso",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro Inesperado",
    });
  }
};

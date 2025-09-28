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

    const { password: _, ...dataUser } = user;

    const token = uuidv4();

    const campos = { cpf, name, email, token };

    const dados = stringifyJson(campos, "stringify");

    const key = `${name as string}:${cpf as string}`;

    await redis.hSet(key, dados as Record<string, string>);

    await redis.expire(key, Number(env.EXPIRE_TIME_REDIS) || 3600);

    const responseSendEmail = await sendWebhook({
      email,
      name,
      link: `http://localhost:3000/api/auth/confirm?token=${token}`,
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

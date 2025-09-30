import express from "express";
import jwt from "jsonwebtoken";
// import { TokenExpiredError } from "jsonwebtoken";
import type { UserRequest } from "../types/users.ts";
import { env } from "../schemas/env.ts";

export const authGuard = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ success: false, message: "Token inválido" });
  }

  try {
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, env.JWT_SECRET as string) as UserRequest;

    req.user = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      isAdmin: payload.isAdmin,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token inválido",
    });
  }
};

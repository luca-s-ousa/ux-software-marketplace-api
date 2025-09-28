import express from "express";
import type { UserRequest } from "../types/users.ts";

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

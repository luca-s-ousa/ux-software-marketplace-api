import { ZodError, ZodType } from "zod";
import express from "express";
export const validate =
  (schema: ZodType) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: err.issues.map((issue) => issue.message)[0],
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erro interno de validação",
      });
    }
  };

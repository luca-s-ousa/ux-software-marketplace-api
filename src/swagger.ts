import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";
import { env } from "./schemas/env.ts";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Loja API",
      version: "1.0.0",
      description: "API da loja virtual (desafio técnico)",
    },
    servers: [{ url: `${env.ENDPOINT_API}/api` }],
  },
  apis: ["./src/routes/*.ts"], // onde vão estar as anotações
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: express.Express) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📚 Swagger disponível em ${env.ENDPOINT_API}/api/docs`);
}

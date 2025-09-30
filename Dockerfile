# --------------------------
# Etapa 1: Build
# --------------------------
FROM node:20-slim AS build

WORKDIR /app

# Copia package.json e package-lock.json para usar cache
COPY package*.json ./

# Instala todas as dependências (dev + prod) para o build
RUN npm ci

# Copia o restante do código e builda
COPY . .
RUN npm run build

# --------------------------
# Etapa 2: Produção Minimalista
# --------------------------
FROM node:20-slim AS production

WORKDIR /app

# Copia apenas package.json e package-lock.json
COPY --from=build /app/package*.json ./

# Instala apenas dependências de produção
RUN npm install --omit=dev

# Copia apenas o build final
COPY --from=build /app/dist ./dist

# Copia arquivos necessários (opcional)
# COPY .env .env

EXPOSE 7383

CMD ["node", "dist/index.js"]

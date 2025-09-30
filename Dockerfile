FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Instala todas as dependências para conseguir compilar TypeScript
RUN npm install

COPY . .

# Compila TypeScript
RUN npm run build

# Remove devDependencies para produção
# RUN npm prune --production

EXPOSE 7383

# Roda migrations e inicia a aplicação
CMD ["sh", "-c", "npm run migrate:generate && npm run migrate:push && ts-node src/server.ts"]

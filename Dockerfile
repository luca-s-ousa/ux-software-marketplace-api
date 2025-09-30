# Imagem Node.js
FROM node:20-alpine

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências (produção)
RUN npm install --production

# Copia o restante do código
COPY . .

# Compila TypeScript
RUN npm run build

# Porta do app
EXPOSE 7383

# Roda migrations não destrutivas e inicia a API
CMD ["sh", "-c", "npm run migrate:generate &&npm run migrate:push && node dist/server.js"]

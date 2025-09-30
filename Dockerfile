# Use uma imagem oficial do Node.js
FROM node:20-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o código da aplicação
COPY . .

# Exponha a porta que sua aplicação usa
EXPOSE 7383

# Comando para rodar a aplicação em desenvolvimento
CMD ["npm", "run", "dev"]

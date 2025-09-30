# Marketplace API

API para loja virtual desenvolvida em Node.js, TypeScript, PostgreSQL e Redis.

## Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [npm](https://www.npmjs.com/)

## Instalação

1. Clone o repositório:

   ```sh
   git clone git@github.com:luca-s-ousa/ux-software-marketplace-api.git
   cd backend/marketplace
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env` e ajuste os valores conforme necessário.

## Subindo os serviços de banco de dados e cache

Execute o comando abaixo para subir o PostgreSQL e Redis via Docker Compose:

```sh
docker-compose up -d
```

## Rodando a aplicação em modo desenvolvimento

```sh
npm run dev
```

## Rodando a aplicação em produção (build)

1. Gere o build:

   ```sh
   npm run build
   ```

2. Inicie a aplicação:
   ```sh
   npm start
   ```

## Rodando a aplicação via Docker

1. Gere a imagem:

   ```sh
   docker build -t marketplace-api .
   ```

2. Execute o container:
   ```sh
   docker run --env-file .env --network="host" -p 7383:7383 marketplace-api
   ```

## Documentação da API

Acesse a documentação Swagger em:  
[http://localhost:7383/api/docs](http://localhost:7383/api/docs)

---

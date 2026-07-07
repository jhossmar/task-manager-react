# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Starting the services

This repository has two services:

- Frontend: the React/Vite app in the repository root
- Backend: the Express/Prisma app in `backend`

### 1. Install dependencies

```bash
npm install
cd backend
npm install
```

If Prisma packages are not already installed in `backend`, run:

```bash
cd backend
npm install prisma --save-dev @prisma/client
```

### 2. Configure the backend environment

Create or update `backend/.env` with your Postgres database connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

> If `backend/prisma` already exists, do not run `npx prisma init` again. That command is only for creating a new Prisma setup.

### 3. Using Docker Compose for the database

This project includes `infra_tools/docker-compose.yml` to start a local Postgres database and pgAdmin.

- The Docker Compose file starts:
  - `db` on Postgres 15
  - `client` on pgAdmin
- Environment values are loaded from your shell or a `.env` file in `infra_tools`.

If Docker is not installed, get it here:

- Docker Desktop: https://www.docker.com/get-started
- Linux install docs: https://docs.docker.com/engine/install/

Start the database and pgAdmin from the repo root:

```bash
cd infra_tools
docker-compose up -d
```

Check containers:

```bash
docker-compose ps
```

Stop them:

```bash
docker-compose down
```

### 4. Configure the backend with Docker Compose

If you use Docker Compose, set `backend/.env` using the same Postgres credentials and host/port mapping.

Example for the provided Compose file:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/mydb?schema=public"
```

Then continue with Prisma setup:

```bash
cd backend
npx prisma generate --schema=prisma/schema.prisma
```

To apply schema changes:

```bash
npx prisma migrate dev --schema=prisma/schema.prisma --name init
```

or

```bash
npx prisma db push --schema=prisma/schema.prisma
```

### 5. Start the backend

From `backend`:

```bash
cd backend
npm run dev
```

### 6. Start the frontend

From the repository root:

```bash
npm run dev
```

### Notes

- Start Docker Compose before the backend so the Postgres container is ready.
- If the Prisma folder already exists, use the existing files instead of running `npx prisma init` again.
- Keep `backend/prisma/schema.prisma` and `backend/prisma/migrations` in source control.
- Keep `backend/.env` out of source control; it contains your database credentials.

If the Prisma schema already exists in `backend/prisma/schema.prisma`, use the existing setup and then generate the client:

```bash
cd backend
npx prisma generate --schema=prisma/schema.prisma
```

To apply the schema to the database, use one of these commands:

```bash
cd backend
npx prisma migrate dev --schema=prisma/schema.prisma --name init
```

or, if you prefer to sync schema changes without creating a migration:

```bash
cd backend
npx prisma db push --schema=prisma/schema.prisma
```

### 4. Start the backend

From `backend`:

```bash
cd backend
npm run dev
```

### 5. Start the frontend

From the repository root:

```bash
npm run dev
```

### Notes

- Start the backend first so the frontend can connect to the API.
- Keep `backend/prisma/schema.prisma` and `backend/prisma/migrations` in source control.
- Keep `backend/.env` out of source control; it contains your database credentials.
- If the Prisma folder already exists, use the existing files instead of running `npx prisma init` again.

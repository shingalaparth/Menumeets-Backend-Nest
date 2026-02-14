# MenuMeets Backend (NestJS) - Setup Guide

This is the official setup guide for the `@menumeets-backend-nest` service.
It is built with **NestJS**, **Prisma (ORM)**, and **PostgreSQL**.

---

## 🛠️ Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: v18.x or higher
- **PostgreSQL**: v14.x or higher
- **Redis**: v6.x or higher (Required for Caching & Queues)
- **npm**: v9.x or higher

---

## 🚀 Step 1: Clone & Install

1.  **Navigate to the project directory:**
    ```bash
    cd Menumeets-Backend-Nest
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *This will also install `prisma` and `nest` CLI tools internally.*

---

## 🔐 Step 2: Environment Configuration

Create a `.env` file in the root directory. You can copy the structure below:

```ini
# --- Application ---
PORT=5000
NODE_ENV=development

# --- Database (PostgreSQL) ---
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:password@localhost:5432/menumeets_db?schema=public"

# --- Redis (Cache & Queue) ---
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD= (Optional)

# --- Authentication (JWT) ---
JWT_SECRET="YOUR_SUPER_SECRET_KEY_HERE"
JWT_EXPIRATION="7d"

# --- External Services (Optional for Dev, Required for Prod) ---
# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key
CASHFREE_ENV=TEST  # or PROD

# Razorpay (If applicable)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

---

## 🗄️ Step 3: Database Setup (Prisma)

The project uses Prisma ORM. You need to sync your database schema.

1.  **Generate Prisma Client** (Creates the type-safe client):
    ```bash
    npx prisma generate
    ```

2.  **Run Migrations** (Creates tables in PostgreSQL):
    ```bash
    npx prisma migrate dev --name init
    ```
    *If you are in production, use `npx prisma migrate deploy` instead.*

3.  **Verify Database Connection**:
    You can open Prisma Studio to view your tables in the browser:
    ```bash
    npx prisma studio
    ```
    Typically runs on `http://localhost:5555`.

---

## ▶️ Step 4: Running the Server

### Development Mode (Watch Mode)
Starts the server and restarts on file changes.
```bash
npm run dev
```
*Server usually starts on http://localhost:5000*

### Production Mode
Builds the TypeScript code to JavaScript (`dist/`) and runs it.
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

---

## 🧪 Testing (Optional)

To run unit tests:
```bash
npm run test
```
To run end-to-end (e2e) tests:
```bash
npm run test:e2e
```

---

## 📂 Project Structure Overview

- **`src/main.ts`**: Entry point. Sets up Swagger, Validation Pipes, and Global Interceptors.
- **`src/app.module.ts`**: The root module importing all features.
- **`src/modules/`**: Contains Feature Modules (DDD architecture).
    - `admin`, `user`, `vendor`, `shop`, `order`, etc.
- **`src/shared/`**:
    - `guards/`: Auth Guards (JWT, Roles).
    - `decorators/`: `@CurrentUser()`, `@Roles()`.
    - `filters/`: Global Exception Filters.
- **`src/infrastructure/`**: Database (Prisma), Cache (Redis), and External APIs.
- **`src/config/`**: Environment variable configurations.

---

## ⚠️ Troubleshooting

**Q: `PrismaClientInitializationError`?**
A: Check your `DATABASE_URL` in `.env`. Ensure Postgres is running.

**Q: `Redis connection failed`?**
A: Ensure Redis server is running on port 6379.

**Q: `Module not found`?**
A: Run `npm run build` to ensure `dist/` is created, or verify `tsconfig.json` paths.

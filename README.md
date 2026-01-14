## Order Service

An **order management REST API** with authentication, role-based access control, and MongoDB persistence. It exposes endpoints for:

- **Auth** – register/login, issue JWTs
- **Products** – admin-only create/update, public list
- **Orders** – customers create/list/pay/cancel orders
- **Users** – admin-only user listing

Built with **Node.js**, **Express 5**, **TypeScript**, and **Mongoose**.

---

### 1. Setup & Installation

- **Prerequisites**
  - **Node.js**: v20+ recommended
  - **Package manager**: `pnpm` (project uses `pnpm-lock.yaml`)
  - **MongoDB**: running locally or accessible via connection string

- **Clone and install**

```bash
git clone <your-fork-or-repo-url> order-service
cd order-service
pnpm install
```

- **Build the project**

```bash
pnpm run build
```

- **Start the server**

By default the compiled server entrypoint is `dist/server.js`:

```bash
node dist/server.js
```

The API will listen on `http://localhost:<PORT>` (defaults to `3000`).

---

### 2. Environment Variables

Environment variables are loaded via `dotenv` in `src/config/env.ts`. The following variables are **required/recommended**:

- **Required**
  - **`MONGO_URI`**: MongoDB connection string  
    Example: `mongodb://localhost:27017/order_service`
  - **`JWT_SECRET`**: Secret key used to sign JWT access tokens

- **Optional**
  - **`PORT`**: HTTP port to run the server on  
    Default: `3000`
  - **`NODE_ENV`**: `development` | `production`  
    Default: `development`
  - **`API_URL`**: External base URL for the API  
    Default: `http://localhost:3000`
  - **`JWT_EXPIRES_IN`**: Token lifetime, e.g. `1h`, `7d`  
    Default: `1h`

- **Example `.env`**

```bash
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

MONGO_URI=mongodb://localhost:27017/order_service

JWT_SECRET=super-secret-change-me
JWT_EXPIRES_IN=1h
```

Create a `.env` file at the project root before running the server or scripts.

---

### 3. Database, Migrations & Seeding

This project uses **MongoDB + Mongoose**. There is no formal migration tool configured; schemas are defined via Mongoose models under `src/models`.

- **Database connection**
  - Configured in `src/config/db.ts` using `MONGO_URI`.

- **Seeding products**

There is a seed script at `src/scripts/seed.ts` which:

- Connects to MongoDB
- Clears the `products` collection
- Inserts a fixed list of sample products (mice, keyboards, etc.)

**Run the seed script:**

```bash
pnpm run seed
```

Under the hood this will:

1. Compile TypeScript (`tsc`)
2. Run `node dist/scripts/seed.js`

Make sure:

- The project is built without errors.
- `MONGO_URI` is correctly set in your `.env`.

---

### 4. Running the Service

- **Build once:**

```bash
pnpm run build
```

- **Start server:**

```bash
node dist/server.js
```

The service will:

- Connect to MongoDB.
- Expose health check at `GET /health`.
- Expose REST endpoints under `/auth`, `/products`, `/orders`, `/users`.
- Expose Swagger docs under `/docs`.

> Note: For local development you can also use `ts-node` / `nodemon` if you wire custom scripts, but for this task the build‑then‑run flow above is sufficient.

---

### 5. API Reference & Example `curl` Requests

#### 5.1 Health Check

- **GET `/health`**

```bash
curl -i https://order-service-t77z.onrender.com/health
```

---

#### 5.2 Auth

##### Register

- **POST `/auth/register`**
- Body:

```bash
curl -i -X POST https://order-service-t77z.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "Password123",
    "role": "customer"
  }'
```

For an admin user, set `"role": "admin"`.

##### Login

- **POST `/auth/login`**

```bash
curl -i -X POST https://order-service-t77z.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "Password123"
  }'
```

The response includes a `token` field (JWT). Use this token in subsequent requests:

```text
Authorization: Bearer <token>
```

---

#### 5.3 Products

##### List products (public)

- **GET `/products`**

```bash
curl -i https://order-service-t77z.onrender.com/products
```

##### Create product (admin only)

- **POST `/products`**

```bash
curl -i -X POST https://order-service-t77z.onrender.com/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "New Gadget",
    "price": 1999,
    "stock": 25
  }'
```

##### Update product (admin only)

- **PATCH `/products/:id`**

```bash
curl -i -X PATCH https://order-service-t77z.onrender.com/products/<productId> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "price": 2499,
    "stock": 40
  }'
```

---

#### 5.4 Orders

##### Create order (customer or admin)

- **POST `/orders`**

```bash
curl -i -X POST https://order-service-t77z.onrender.com/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "items": [
      { "productId": "<productId>", "quantity": 2 },
      { "productId": "<otherProductId>", "quantity": 1 }
    ]
  }'
```

##### List my orders

- **GET `/orders`**

```bash
curl -i https://order-service-t77z.onrender.com/orders \
  -H "Authorization: Bearer <token>"
```

##### Pay for an order

- **POST `/orders/:id/pay`**

```bash
curl -i -X POST https://order-service-t77z.onrender.com/orders/<orderId>/pay \
  -H "Authorization: Bearer <token>"
```

##### Cancel an order

- **POST `/orders/:id/cancel`**

```bash
curl -i -X POST https://order-service-t77z.onrender.com/orders/<orderId>/cancel \
  -H "Authorization: Bearer <token>"
```

---

#### 5.5 Users (Admin only)

##### List users

- **GET `/users`**

```bash
curl -i https://order-service-t77z.onrender.com/users \
  -H "Authorization: Bearer <admin-token>"
```

---

### 6. Swagger / API Docs

The service is wired with `swagger-jsdoc` and `swagger-ui-express`. OpenAPI annotations live in the route files (e.g. `src/routes/auth.routes.ts`, `src/routes/order.routes.ts`, etc) and are aggregated in the Swagger configuration.

- **View documentation UI:**

```bash
open https://order-service-t77z.onrender.com/docs
```

This provides an interactive UI for exploring and testing all endpoints.

---

### 7. Design Notes

- **Architecture**
  - **Layered structure**:
    - `controllers/`: Express route handlers (request/response orchestration).
    - `services/`: Business logic (auth, orders, products, users).
    - `repositories/`: Data access layer over Mongoose models.
    - `models/`: Mongoose schemas and models.
    - `middleware/`: Cross-cutting concerns (auth, validation, error handling, rate limiting, role checks).
  - **Separation of concerns** keeps controllers thin and business logic testable.

- **Authentication & Authorization**
  - JWT-based auth (see `auth.middleware.ts` and `utils/jwt.ts`).
  - Role-based access control via `requireRole` middleware:
    - Customers can create/list/pay/cancel their own orders.
    - Admins can manage products and list all users.

- **Validation & Error Handling**
  - **Zod** schemas validate payloads (`validation/*.schema.ts`).
  - Central `error.middleware.ts` normalizes API error responses.
  - `rateLimit.middleware.ts` limits sensitive endpoints (e.g. auth) to mitigate brute-force.

- **Persistence**
  - MongoDB via Mongoose models (`user.model.ts`, `product.model.ts`, `order.model.ts`).
  - Order items reference products and store quantities and pricing data for consistency.

- **Observability & DX**
  - `morgan` + custom `logger` provide structured request logs.
  - TypeScript configuration (`tsconfig.json`) and linting (`eslint.config.mts`) encourage a consistent, safe codebase.

This design aims to emulate a **production-style order service** that is still compact enough to reason about in an interview setting while showcasing authentication, authorization, validation, error handling, and data modeling.

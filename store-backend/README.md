# BELHOS ACCESSORIES - Backend API

Backend API for the BELHOS ACCESSORIES e-commerce platform built with Node.js, Express, and Prisma.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **CORS**: cors middleware

## 📁 Project Structure

```
store-backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── reservationController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── reservationRoutes.js
│   ├── utils/
│   │   └── prisma.js
│   └── server.js
├── prisma/
│   └── schema.prisma
├── .env
├── .gitignore
└── package.json
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/storedb"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

### 3. Setup Database

Run Prisma migrations:

```bash
npm run prisma:migrate
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

### 4. Start Server

**Development**:
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📋 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```http
GET /api/products
Query Parameters:
  - category (optional)
  - minPrice (optional)
  - maxPrice (optional)
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Luxury Watch",
  "description": "Premium timepiece",
  "price": 499.99,
  "imageUrl": "https://example.com/watch.jpg",
  "category": "Watches",
  "stock": 10
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 599.99,
  "stock": 5
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <admin-token>
```

### Reservation Endpoints

#### Get All Reservations (Admin Only)
```http
GET /api/reservations
Authorization: Bearer <admin-token>
```

#### Get User Reservations
```http
GET /api/reservations/my-reservations
Authorization: Bearer <token>
```

#### Create Reservation
```http
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

#### Update Reservation Status (Admin Only)
```http
PUT /api/reservations/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

#### Delete Reservation
```http
DELETE /api/reservations/:id
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Models

#### User
```prisma
model User {
  id           Int           @id @default(autoincrement())
  name         String
  email        String        @unique
  password     String
  role         Role          @default(USER)
  createdAt    DateTime      @default(now())
  reservations Reservation[]
}
```

#### Product
```prisma
model Product {
  id           Int           @id @default(autoincrement())
  name         String
  description  String?
  price        Float
  imageUrl     String
  category     String?
  stock        Int           @default(0)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  reservations Reservation[]
}
```

#### Reservation
```prisma
model Reservation {
  id        Int      @id @default(autoincrement())
  userId    Int
  productId Int
  quantity  Int
  status    String   @default("pending")
  createdAt DateTime @default(now())
  
  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}
```

#### Role Enum
```prisma
enum Role {
  USER
  ADMIN
}
```

## 🔒 Authentication & Authorization

### JWT Token Structure
```javascript
{
  id: userId,
  email: userEmail,
  role: userRole,
  exp: expirationTimestamp
}
```

### Middleware

#### `authenticateToken`
Verifies JWT token from Authorization header

#### `isAdmin`
Checks if authenticated user has ADMIN role

## 📦 NPM Scripts

```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "prisma:migrate": "npx prisma migrate dev",
  "prisma:generate": "npx prisma generate",
  "prisma:studio": "npx prisma studio"
}
```

## 🧪 Testing with Prisma Studio

Open Prisma Studio to view and edit database:

```bash
npm run prisma:studio
```

Access at `http://localhost:5555`

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| JWT_SECRET | Secret key for JWT signing | `your-secret-key` |
| PORT | Server port | `5000` |
| NODE_ENV | Environment mode | `development` or `production` |

## 🔐 Security Best Practices

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with expiration (7 days)
- ✅ CORS configured for frontend origin
- ✅ Environment variables for secrets
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ Protected routes with authentication middleware

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📝 Development Tips

1. **Database Migrations**: After schema changes, run:
   ```bash
   npm run prisma:migrate
   ```

2. **Reset Database**: To reset and reseed:
   ```bash
   npx prisma migrate reset
   ```

3. **View Logs**: Server logs all errors to console

4. **CORS**: Update origin in `server.js` for production

## 🚀 Deployment

1. Set up PostgreSQL database on hosting platform
2. Update `DATABASE_URL` in production environment
3. Run migrations: `npm run prisma:migrate`
4. Set `NODE_ENV=production`
5. Start server: `npm start`

## 📄 License

This project is for educational purposes.

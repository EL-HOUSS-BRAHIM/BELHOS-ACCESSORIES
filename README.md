# BELHOS ACCESSORIES - E-Commerce Platform

A full-stack e-commerce platform for luxury accessories with product management, reservations, and admin dashboard.

## 🏗️ Project Structure

```
BELHOS-ACCESSORIES/
├── store-backend/          # Node.js + Express + Prisma backend
└── store-frontend/         # Next.js + TypeScript frontend
```

## 🚀 Tech Stack

### Backend
- **Framework**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios

## ✨ Features

### User Features
- 🏠 **Home Page**: Hero section with featured products
- 🛍️ **Product Catalog**: Browse products with filters
- 📝 **Reservations**: Create and manage product reservations
- 📧 **Contact Page**: Contact form with business information
- 🔐 **Authentication**: Register and login system

### Admin Features
- 📊 **Admin Dashboard**: Comprehensive management interface
- ➕ **Product Management**: Add, edit, delete products
- 📦 **Reservation Management**: View and update reservation status
- 👥 **User Management**: View user information

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd store-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Edit `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/storedb"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   NODE_ENV=development
   ```

4. **Run Prisma migrations**:
   ```bash
   npm run prisma:migrate
   ```

5. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

6. **Start the server**:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd store-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Reservations
- `GET /api/reservations` - Get all reservations (admin only)
- `GET /api/reservations/my-reservations` - Get user reservations (protected)
- `POST /api/reservations` - Create reservation (protected)
- `PUT /api/reservations/:id` - Update reservation status (admin only)
- `DELETE /api/reservations/:id` - Delete reservation (protected)

## 🗄️ Database Schema

### User
- id: Integer (Primary Key)
- name: String
- email: String (Unique)
- password: String (Hashed)
- role: Enum (USER, ADMIN)
- createdAt: DateTime

### Product
- id: Integer (Primary Key)
- name: String
- description: String (Optional)
- price: Float
- imageUrl: String
- category: String (Optional)
- stock: Integer
- createdAt: DateTime
- updatedAt: DateTime

### Reservation
- id: Integer (Primary Key)
- userId: Integer (Foreign Key)
- productId: Integer (Foreign Key)
- quantity: Integer
- status: String (pending, confirmed, cancelled)
- createdAt: DateTime

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Role-based access control (USER/ADMIN)
- CORS configuration
- HTTP-only cookies support

## 📱 Pages

- `/` - Home page
- `/articles` - Product catalog
- `/reservations` - User reservations
- `/contact` - Contact page
- `/login` - Login page
- `/register` - Registration page
- `/admin` - Admin dashboard (admin only)

## 🎨 UI/UX Features

- Responsive design (mobile, tablet, desktop)
- Modern and clean interface
- Tailwind CSS styling
- Loading states
- Error handling
- Success notifications

## 📝 Development Commands

### Backend
```bash
npm run dev          # Start development server
npm start            # Start production server
npm run prisma:migrate  # Run database migrations
npm run prisma:generate # Generate Prisma client
npm run prisma:studio   # Open Prisma Studio
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🚧 Future Enhancements

- Shopping cart functionality
- Payment integration (Stripe/PayPal)
- Email notifications
- Product reviews and ratings
- Advanced search and filters
- Order history
- Image upload for products
- Multi-language support

## 📄 License

This project is for educational purposes.

## 👥 Contributors

BELHOS ACCESSORIES Team

---

Made with ❤️ using Next.js, Node.js, and Prisma

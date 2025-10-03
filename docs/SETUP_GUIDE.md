# 🚀 BELHOS ACCESSORIES - Quick Start Guide

## Overview

Full-stack e-commerce platform with:
- ✅ Product catalog & management
- ✅ User authentication & authorization
- ✅ Reservation system
- ✅ Admin dashboard
- ✅ Contact form

## 🏗️ Architecture

```
Frontend (Next.js)  ←→  Backend (Express)  ←→  Database (PostgreSQL)
     :3000                    :5000                 :5432
```

## ⚡ Quick Setup (5 Minutes)

### Option 1: Automated Setup

```bash
# Run the setup script
./setup.sh
```

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
cd store-backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

#### 2. Frontend Setup (New Terminal)

```bash
cd store-frontend
npm install
npm run dev
```

## 🔧 Configuration

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/storedb"
JWT_SECRET="your-secret-key"
PORT=5000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📋 Default Admin Account

**Create an admin user:**

1. Register a regular user through the UI
2. Update in Prisma Studio:
   ```bash
   cd store-backend
   npm run prisma:studio
   ```
3. Change user's role to `ADMIN`

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Prisma Studio**: http://localhost:5555 (run `npm run prisma:studio`)

## 📱 User Flow

### For Customers:
1. **Register** → Create account
2. **Browse** → View products in catalog
3. **Reserve** → Make reservations
4. **Manage** → View/cancel reservations

### For Admins:
1. **Login** → Access admin dashboard
2. **Products** → Add/edit/delete products
3. **Reservations** → Manage customer reservations
4. **Status** → Update reservation status

## 🎯 Testing the Application

### 1. Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### 2. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. Create Sample Product (Admin)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name":"Luxury Watch",
    "description":"Premium timepiece",
    "price":499.99,
    "imageUrl":"https://via.placeholder.com/400",
    "category":"Watches",
    "stock":10
  }'
```

## 🛠️ Development Commands

### Backend
```bash
npm run dev              # Start with nodemon
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Create migration
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Check for errors
```

## 📦 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, bcrypt |
| API | REST, Axios |

## 🎨 Key Features

### ✅ Implemented
- User authentication (register/login)
- Product catalog with filters
- Reservation system
- Admin dashboard
- Role-based access control
- Responsive design

### 🚧 Future Enhancements
- Shopping cart
- Payment integration
- Email notifications
- Image upload
- Product reviews
- Order tracking

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Create database manually
psql -U postgres
CREATE DATABASE storedb;
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Prisma Errors
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

## 📚 Documentation

- [Main README](./README.md)
- [Backend README](./store-backend/README.md)
- [Frontend README](./store-frontend/README.md)

## 🔐 Security Notes

1. Change `JWT_SECRET` in production
2. Use environment variables for sensitive data
3. Enable HTTPS in production
4. Implement rate limiting
5. Add input validation
6. Use prepared statements (Prisma handles this)

## 📞 Support

For issues or questions:
1. Check documentation
2. Review error logs
3. Verify environment configuration
4. Test API endpoints individually

## 🎉 Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Database migrations completed
- [ ] Can register new user
- [ ] Can login and see token
- [ ] Can view products
- [ ] Admin can access dashboard
- [ ] Can create reservations

---

**Happy Coding! 🚀**

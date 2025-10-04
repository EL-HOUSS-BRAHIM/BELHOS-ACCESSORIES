# BELHOS ACCESSORIES - Frontend

Modern e-commerce frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Authentication**: JWT with localStorage

## 📁 Project Structure

```
store-frontend/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Home page
│   ├── admin/
│   │   └── page.tsx           # Admin dashboard
│   ├── articles/
│   │   └── page.tsx           # Product catalog
│   ├── contact/
│   │   └── page.tsx           # Contact page
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── register/
│   │   └── page.tsx           # Registration page
│   └── reservations/
│       └── page.tsx           # Reservations page
├── components/
│   └── Navbar.tsx             # Navigation component
├── lib/
│   ├── api.ts                 # Axios instance
│   └── AuthContext.tsx        # Authentication context
└── public/                    # Static assets
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Features

### Public Pages

- **Home (`/`)**: Hero section, featured products, CTA
- **Boutique (`/boutique`)**: Product catalog with search
- **Contact (`/contact`)**: Contact form and business info
- **Login/Register**: Authentication pages

### Protected Pages

- **Reservations (`/reservations`)**: Manage reservations
- **Admin (`/admin`)**: Product & reservation management (admin only)

## 🔐 Authentication

- JWT token authentication
- Auto-login from localStorage
- Role-based access control (USER/ADMIN)

## 📦 NPM Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🚀 Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import in Vercel
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

## 📄 License

This project is for educational purposes.

---

Built with ❤️ using Next.js and Tailwind CSS

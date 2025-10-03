# BELHOS-ACCESSORIES 🛍️

A modern e-commerce platform for accessories built with Next.js, Node.js, and Firebase.

## 🚀 Live Demo
- **Frontend**: [https://store-frontend-b6ep7yp15-bross-projects-17a2e313.vercel.app](https://store-frontend-b6ep7yp15-bross-projects-17a2e313.vercel.app)
- **Backend API**: [https://store-backend-cu36qfd27-bross-projects-17a2e313.vercel.app](https://store-backend-cu36qfd27-bross-projects-17a2e313.vercel.app)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Authentication**: JWT with Firebase Auth integration
- **State Management**: React Context
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express.js
- **Deployment**: Vercel Serverless Functions
- **Database**: Firebase Firestore
- **Authentication**: JWT + bcrypt
- **Language**: JavaScript

## 📁 Project Structure

```
BELHOS-ACCESSORIES/
├── store-frontend/          # Next.js frontend application
│   ├── app/                 # Next.js app directory
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utilities and configurations
│   └── public/              # Static assets
├── store-backend/           # Node.js backend application
│   ├── api/                 # Vercel serverless functions
│   ├── src/                 # Source code
│   │   ├── models/          # Firebase data models
│   │   └── config/          # Firebase configuration
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Vercel account (for deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/EL-HOUSS-BRAHIM/BELHOS-ACCESSORIES.git
   cd BELHOS-ACCESSORIES
   ```

2. **Run setup script**
   ```bash
   ./setup-dev.sh
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Firestore and Authentication
   - Update environment variables in `.env` files

4. **Start development servers**
   
   Backend:
   ```bash
   cd store-backend
   npm run dev
   ```
   
   Frontend:
   ```bash
   cd store-frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api (when deployed to Vercel)

## 🌐 Deployment

This application is designed to be deployed on Vercel with Firebase as the database backend.

### Quick Deployment
1. Fork this repository
2. Connect your GitHub repo to Vercel
3. Set up Firebase project
4. Configure environment variables
5. Deploy!

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🔧 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)
```bash
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## 📋 Features

### User Features
- ✅ User registration and authentication
- ✅ Product browsing and filtering
- ✅ Shopping cart functionality
- ✅ Order/Reservation management
- ✅ User profile management

### Admin Features
- ✅ Product management (CRUD)
- ✅ Order/Reservation management
- ✅ User management
- ✅ Inventory tracking

### Technical Features
- ✅ Responsive design
- ✅ Server-side rendering (SSR)
- ✅ API-first architecture
- ✅ Real-time database updates
- ✅ Secure authentication
- ✅ Error handling and validation

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Firebase security rules
- Input validation and sanitization
- CORS protection
- Environment variable protection

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/[id]` - Update product (Admin)
- `DELETE /api/products/[id]` - Delete product (Admin)

### Reservations
- `GET /api/reservations` - Get reservations
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/[id]` - Update reservation
- `DELETE /api/reservations/[id]` - Delete reservation

## 🧪 Testing

```bash
# Frontend testing
cd store-frontend
npm run test

# Backend testing
cd store-backend
npm run test
```

## 📈 Performance

- **Next.js**: Optimized with static generation and server-side rendering
- **Vercel**: Global CDN and edge functions
- **Firebase**: Real-time database with offline support
- **Images**: Optimized with Next.js Image component

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for the backend infrastructure
- Vercel for seamless deployment
- Tailwind CSS for the styling system

## 📞 Support

For support or questions:
- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/EL-HOUSS-BRAHIM/BELHOS-ACCESSORIES/issues)
- 📖 Documentation: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Built with ❤️ for modern e-commerce**

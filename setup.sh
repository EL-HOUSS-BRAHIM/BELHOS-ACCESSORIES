#!/bin/bash

echo "🚀 BELHOS ACCESSORIES - Setup Script"
echo "===================================="
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd store-backend

echo "  → Installing dependencies..."
npm install

echo "  → Generating Prisma Client..."
npx prisma generate

echo "  → Running database migrations..."
npx prisma migrate dev --name init

echo "✅ Backend setup complete!"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../store-frontend

echo "  → Installing dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

# Final Instructions
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Configure your database in store-backend/.env"
echo "2. Start the backend:"
echo "   cd store-backend && npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd store-frontend && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 See README.md for detailed documentation"

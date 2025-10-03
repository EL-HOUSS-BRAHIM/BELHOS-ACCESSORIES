#!/bin/bash

echo "🚀 BELHOS-ACCESSORIES Development Setup"
echo "======================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd store-backend
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from example..."
    cp .env.example .env
    echo "🔧 Please edit store-backend/.env with your Firebase credentials"
fi
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../store-frontend
if [ ! -f ".env.local" ]; then
    echo "⚠️  Creating .env.local file from example..."
    cp .env.local.example .env.local
    echo "🔧 Please edit store-frontend/.env.local with your Firebase credentials"
fi
npm install

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔥 Next steps:"
echo "1. Set up Firebase project (see DEPLOYMENT_GUIDE.md)"
echo "2. Update environment variables in both .env files"
echo "3. Run development servers:"
echo "   Backend:  cd store-backend && npm run dev"
echo "   Frontend: cd store-frontend && npm run dev"
echo ""
echo "📖 For deployment instructions, see DEPLOYMENT_GUIDE.md"
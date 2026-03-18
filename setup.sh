#!/bin/bash

# INSTALL AND RUN SCRIPT
# Run this to get everything set up quickly

echo "🚀 Task Management System - Setup Script"
echo "======================================="
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+";
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd ./backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and set your configuration:"
    echo "   - MONGODB_URI"
    echo "   - REDIS_URL"
    echo "   - JWT_SECRET"
fi

echo "✅ Backend ready!"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp .env.local.example .env.local
fi

echo "✅ Frontend ready!"
echo ""

echo "======================================="
echo "✨ Setup Complete!"
echo ""
echo "📚 Next Steps:"
echo "1. Read: ../SETUP.md (5-minute setup)"
echo "2. Read: ../README.md (understand architecture)"
echo "3. Read: ../PHASE1.md (Phase 1 guide)"
echo ""
echo "🚀 To Run:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "🌐 Access at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000/api/health"
echo ""
echo "❓ Questions? Check the README.md!"

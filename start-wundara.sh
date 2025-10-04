#!/bin/bash

# Wundara Development Startup Script
# This ensures both server and client start on consistent ports

echo "🚀 Starting Wundara Development Environment..."

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start server in background
echo "🖥️  Starting server on port 3001..."
cd server && npm run dev &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Start client
echo "💻 Starting client on port 3000..."
cd ../client && npm run dev &
CLIENT_PID=$!

echo "✅ Wundara is starting up!"
echo "📱 Client: http://localhost:3000"
echo "🖥️  Server: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
trap "echo '🛑 Stopping Wundara...'; kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit" INT
wait

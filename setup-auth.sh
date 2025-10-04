#!/bin/bash

echo "🔐 Wundara Authentication Setup"
echo "================================"

# Check if .env files exist
CLIENT_ENV="/Users/kristinadoyle/CascadeProjects/windsurf-project/client/.env"
SERVER_ENV="/Users/kristinadoyle/CascadeProjects/windsurf-project/server/.env"

echo ""
echo "📋 Current Authentication Status:"

# Check client env
if [ -f "$CLIENT_ENV" ]; then
    if grep -q "VITE_CLERK_PUBLISHABLE_KEY" "$CLIENT_ENV"; then
        echo "✅ Client Clerk key configured"
    else
        echo "❌ Client Clerk key missing"
    fi
else
    echo "❌ Client .env file missing"
fi

# Check server env
if [ -f "$SERVER_ENV" ]; then
    if grep -q "CLERK_SECRET_KEY" "$SERVER_ENV"; then
        echo "✅ Server Clerk key configured"
    else
        echo "❌ Server Clerk key missing"
    fi
    
    if grep -q "USE_DEV_AUTH=true" "$SERVER_ENV"; then
        echo "🔧 Development auth mode enabled"
    else
        echo "🔐 Production auth mode enabled"
    fi
else
    echo "❌ Server .env file missing"
fi

echo ""
echo "🚀 Quick Setup Options:"
echo ""
echo "1. Development Mode (No Clerk required):"
echo "   - App works without authentication"
echo "   - Shows mock user profile"
echo "   - Perfect for testing features"
echo ""
echo "2. Production Mode (Clerk required):"
echo "   - Full authentication with sign-up/sign-in"
echo "   - Real user management"
echo "   - Secure API access"
echo ""

read -p "Choose setup mode (1 for Dev, 2 for Production): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Setting up Development Mode..."
        
        # Create client .env for dev mode (no Clerk key needed)
        cat > "$CLIENT_ENV" << EOF
# Development Mode - No Clerk authentication required
# VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_URL=http://localhost:3001
EOF
        
        # Create server .env for dev mode
        cat > "$SERVER_ENV" << EOF
# Development Mode Configuration
USE_DEV_AUTH=true
USE_REAL_AI=true

# Database (optional for development)
# DATABASE_URL=postgresql://...

# Clerk (not required in dev mode)
# CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
# CLERK_SECRET_KEY=sk_test_your_key_here

# AI Configuration
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
ANTHROPIC_MODEL=claude-3-haiku-20240307

# Server Configuration
NODE_ENV=development
PORT=3001
EOF
        
        echo "✅ Development mode configured!"
        echo "📝 Next steps:"
        echo "   1. Add your Anthropic API key to server/.env"
        echo "   2. Run: cd server && npm run dev"
        echo "   3. Run: cd client && npm run dev"
        echo "   4. Visit: http://localhost:3000"
        ;;
        
    2)
        echo ""
        echo "🔐 Setting up Production Mode..."
        echo ""
        echo "📋 You'll need to:"
        echo "1. Create a Clerk account at https://dashboard.clerk.com/"
        echo "2. Create a new application"
        echo "3. Copy your publishable and secret keys"
        echo ""
        
        read -p "Enter your Clerk Publishable Key (pk_test_...): " pub_key
        read -p "Enter your Clerk Secret Key (sk_test_...): " secret_key
        
        if [[ $pub_key == pk_test_* ]] && [[ $secret_key == sk_test_* ]]; then
            # Create client .env for production mode
            cat > "$CLIENT_ENV" << EOF
# Production Mode - Clerk authentication enabled
VITE_CLERK_PUBLISHABLE_KEY=$pub_key
VITE_API_URL=http://localhost:3001
EOF
            
            # Create server .env for production mode
            cat > "$SERVER_ENV" << EOF
# Production Mode Configuration
USE_DEV_AUTH=false
USE_REAL_AI=true

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=$pub_key
CLERK_SECRET_KEY=$secret_key

# Database (recommended for production)
# DATABASE_URL=postgresql://...

# AI Configuration
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
ANTHROPIC_MODEL=claude-3-haiku-20240307

# Server Configuration
NODE_ENV=development
PORT=3001
EOF
            
            echo "✅ Production mode configured!"
            echo "📝 Next steps:"
            echo "   1. Add your Anthropic API key to server/.env"
            echo "   2. Configure redirect URLs in Clerk dashboard:"
            echo "      - http://localhost:3000"
            echo "   3. Run: cd server && npm run dev"
            echo "   4. Run: cd client && npm run dev"
            echo "   5. Visit: http://localhost:3000"
            echo "   6. Test sign-up and sign-in flows"
        else
            echo "❌ Invalid key format. Keys should start with pk_test_ and sk_test_"
            exit 1
        fi
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup complete! Your authentication is ready to go."

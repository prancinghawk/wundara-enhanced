# Wundara Authentication Setup Guide

## Overview

Wundara uses Clerk for authentication with a hybrid approach that supports both development and production environments.

## Development Setup

### 1. Environment Variables

Create a `.env` file in the client directory:

```bash
# Client (.env)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_API_URL=http://localhost:3001
```

Create a `.env` file in the server directory:

```bash
# Server (.env)
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
USE_DEV_AUTH=true  # Set to false for production Clerk auth
```

### 2. Clerk Dashboard Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your publishable and secret keys
4. Configure allowed redirect URLs:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

### 3. Authentication Flow

#### Development Mode (USE_DEV_AUTH=true)
- Server uses mock authentication with `dev-user-123`
- Client shows full authentication UI but bypasses server auth
- Perfect for development and testing

#### Production Mode (USE_DEV_AUTH=false)
- Server requires valid Clerk JWT tokens
- Client enforces authentication before accessing protected routes
- Full production security

## Authentication Components

### Client Components

1. **AuthProvider** (`/client/src/components/auth/AuthProvider.tsx`)
   - Wraps app with Clerk provider
   - Handles Clerk initialization

2. **ProtectedRoute** (`/client/src/components/auth/ProtectedRoute.tsx`)
   - Protects routes requiring authentication
   - Redirects to sign-in if not authenticated

3. **UserProfile** (`/client/src/components/auth/UserProfile.tsx`)
   - Shows user info and sign-out option
   - Displays in top app bar

4. **SignIn/SignUp Pages**
   - Custom styled Clerk authentication forms
   - Branded with Wundara design system

### Server Middleware

1. **hybridRequireAuth** (`/server/src/middleware/hybrid-auth.ts`)
   - Switches between dev and production auth
   - Controlled by `USE_DEV_AUTH` environment variable

## User Flow

### New User Registration
1. User visits `/sign-up`
2. Fills out registration form (email, password)
3. Clerk creates account and sends verification email
4. User verifies email and is redirected to dashboard
5. User creates child profiles and starts generating plans

### Existing User Login
1. User visits `/sign-in`
2. Enters credentials
3. Clerk validates and redirects to dashboard
4. User accesses their existing children and plans

### Protected Routes
All main app routes are protected:
- `/dashboard` - Overview and recent activity
- `/plans` - Plan management and creation
- `/profiles` - Child profile management
- `/progress` - Learning progress tracking

## Testing Authentication

### Development Testing
```bash
# Start server with dev auth
cd server && npm run dev

# Start client
cd client && npm run dev

# Visit http://localhost:3000
# Should redirect to /sign-in
# Sign up/in will work with Clerk UI
# App routes will be accessible after auth
```

### Production Testing
```bash
# Set USE_DEV_AUTH=false in server .env
# Deploy to production environment
# Test full authentication flow
```

## Security Features

1. **JWT Token Validation** - Server validates Clerk JWT tokens
2. **Route Protection** - All API routes require authentication
3. **User Isolation** - Users only see their own data
4. **Session Management** - Clerk handles session lifecycle
5. **Secure Redirects** - Proper redirect handling after auth

## Troubleshooting

### Common Issues

1. **"Missing Publishable Key" Error**
   - Check VITE_CLERK_PUBLISHABLE_KEY in client .env
   - Ensure key starts with `pk_test_` or `pk_live_`

2. **"Unauthenticated" API Errors**
   - Check CLERK_SECRET_KEY in server .env
   - Verify USE_DEV_AUTH setting matches environment

3. **Redirect Loop**
   - Check Clerk dashboard redirect URLs
   - Ensure client and server URLs match

4. **CORS Issues**
   - Verify API_URL in client matches server port
   - Check server CORS configuration

### Debug Commands

```bash
# Test API authentication
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3001/api/children

# Check server auth mode
grep "Using.*authentication" server_logs.txt

# Verify environment variables
echo $VITE_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY
```

## Production Deployment

1. Set `USE_DEV_AUTH=false` in production
2. Configure production Clerk keys
3. Update redirect URLs in Clerk dashboard
4. Test authentication flow thoroughly
5. Monitor authentication errors and user feedback

## Next Steps

- [ ] Test sign-up flow with new users
- [ ] Test sign-in flow with existing users
- [ ] Verify user data isolation
- [ ] Test session persistence
- [ ] Configure production environment
- [ ] Set up monitoring and analytics

# Clerk Dashboard Configuration Checklist

## **Required Settings for Wundara**

### **1. Application Settings**
- **Application Name**: Wundara
- **Framework**: React
- **Environment**: Development

### **2. Redirect URLs Configuration**

Go to **Settings > Paths** in your Clerk dashboard and configure:

**Sign-in URL**: `/sign-in`
**Sign-up URL**: `/sign-up`
**After sign-in URL**: `/dashboard`
**After sign-up URL**: `/dashboard`

**Allowed redirect URLs**:
```
http://localhost:3000
http://localhost:3000/dashboard
http://localhost:3000/sign-in
http://localhost:3000/sign-up
```

⚠️ **IMPORTANT**: Clerk may default to port 5173, but Wundara runs on port 3000. Make sure to use port 3000 in all redirect URLs.

### **3. Authentication Methods**

Enable the following sign-in methods:
- ✅ **Email address** (primary)
- ✅ **Password** (required)
- ✅ **Email verification** (recommended)
- ⚠️ **Google OAuth** (optional - for easier sign-up)

### **4. User Profile Settings**

Configure required fields:
- ✅ **Email address** (required)
- ✅ **First name** (optional but recommended)
- ✅ **Last name** (optional)

### **5. Session Settings**

**Session timeout**: 7 days (default)
**Inactivity timeout**: 1 day (recommended)

### **6. Email Settings**

**From email**: Use Clerk's default or configure custom domain
**Email templates**: Use default Clerk templates

### **7. Security Settings**

- ✅ **Bot protection** enabled
- ✅ **Rate limiting** enabled
- ✅ **Password requirements**: Medium strength

## **Testing Checklist**

### **Sign-Up Flow Test**
1. Visit http://localhost:3000
2. Should redirect to `/sign-in`
3. Click "Create an account" or navigate to `/sign-up`
4. Fill out registration form
5. Check email for verification link
6. Click verification link
7. Should redirect to `/dashboard`
8. Verify user profile appears in top bar

### **Sign-In Flow Test**
1. Sign out from user profile dropdown
2. Should redirect to `/sign-in`
3. Enter credentials
4. Should redirect to `/dashboard`
5. Verify access to all protected routes

### **API Authentication Test**
1. Open browser dev tools
2. Check Network tab during API calls
3. Verify Authorization headers are present
4. Confirm API responses are user-specific

### **Session Persistence Test**
1. Sign in successfully
2. Refresh the page
3. Should remain signed in
4. Close and reopen browser
5. Should remain signed in (within session timeout)

## **Troubleshooting**

### **Common Issues**

**"Redirect URL not allowed"**:
- Add the exact URL to allowed redirects in Clerk dashboard
- Include both http://localhost:3000 and the specific path

**"Invalid publishable key"**:
- Verify key starts with `pk_test_`
- Check for extra spaces or characters
- Ensure key matches the one in Clerk dashboard

**"Authentication failed"**:
- Check server logs for Clerk errors
- Verify secret key is correct
- Ensure USE_DEV_AUTH=false in server .env

**Infinite redirect loop**:
- Check that sign-in/sign-up URLs don't require authentication
- Verify ProtectedRoute logic excludes auth pages

## **Production Deployment Notes**

When deploying to production:
1. **Update redirect URLs** to production domain
2. **Switch to live keys** (pk_live_ and sk_live_)
3. **Configure custom domain** for emails (optional)
4. **Set up monitoring** for authentication metrics
5. **Test all flows** in production environment

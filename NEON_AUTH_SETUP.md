# Neon Auth (Stack Auth) Setup Complete ✅

## Your Stack Auth Configuration

**Project ID**: `ddb5065b-a008-4f51-b576-0cbced7f83c2`
**JWKS URL**: `https://api.stack-auth.com/api/v1/projects/ddb5065b-a008-4f51-b576-0cbced7f83c2/.well-known/jwks.json`

## URLs to Configure in Stack Auth Dashboard

You mentioned you have 2 URLs for Wundara. Here's what you need to configure in the Stack Auth dashboard:

### 1. Development/Local URLs
```
http://localhost:3000
http://localhost:3000/handler/sign-in
http://localhost:3000/handler/sign-up
http://localhost:3000/handler/callback
```

### 2. Production/Beta URLs
Replace `your-domain.com` with your actual domains:

**Option A: If using custom domains**
```
https://wundara.com
https://wundara.com/handler/sign-in
https://wundara.com/handler/sign-up
https://wundara.com/handler/callback

https://app.wundara.com
https://app.wundara.com/handler/sign-in
https://app.wundara.com/handler/sign-up
https://app.wundara.com/handler/callback
```

**Option B: If using deployment platform domains (Vercel/Netlify)**
```
https://wundara.vercel.app
https://wundara.vercel.app/handler/sign-in
https://wundara.vercel.app/handler/sign-up
https://wundara.vercel.app/handler/callback

https://wundara-beta.vercel.app
https://wundara-beta.vercel.app/handler/sign-in
https://wundara-beta.vercel.app/handler/sign-up
https://wundara-beta.vercel.app/handler/callback
```

## How to Configure in Stack Auth Dashboard

1. **Go to Stack Auth Dashboard**: https://app.stack-auth.com/
2. **Select your project**: `ddb5065b-a008-4f51-b576-0cbced7f83c2`
3. **Navigate to Settings → Domains**
4. **Add Allowed Origins**:
   - Add all your URLs (development + production)
   - Include both the base URL and the handler paths

5. **Configure Redirect URLs**:
   - After sign-in: `/dashboard` or `/account-type`
   - After sign-up: `/account-type`
   - After sign-out: `/`

## Email Server Setup

For the custom SMTP server you're configuring:

### Recommended Email Providers for Beta Testing

**Option 1: SendGrid (Recommended)**
- Free tier: 100 emails/day
- Easy setup
- Good deliverability
- Host: `smtp.sendgrid.net`
- Port: `587` or `465`
- Get API key from: https://sendgrid.com/

**Option 2: AWS SES**
- Very cheap ($ 0.10 per 1000 emails)
- Excellent deliverability
- Requires domain verification
- Host: `email-smtp.us-east-1.amazonaws.com`
- Port: `587`

**Option 3: Resend (Modern, Developer-Friendly)**
- Free tier: 3,000 emails/month
- Great DX
- Host: `smtp.resend.com`
- Port: `587`
- Get API key from: https://resend.com/

### Email Configuration

**Sender Email**: `noreply@wundara.com` or `hello@wundara.com`
**Sender Name**: `Wundara`

**Email Templates Needed**:
- Welcome email
- Email verification
- Password reset
- Magic link sign-in (if enabled)

## Environment Variables for Deployment

### Client (.env for Vite)
```bash
VITE_API_URL=https://your-api-domain.com
VITE_STACK_PROJECT_ID=ddb5065b-a008-4f51-b576-0cbced7f83c2
VITE_STACK_PUBLISHABLE_CLIENT_KEY=pck_kafrm4r7qqw6ac37xg0fvhxkq0cmf8ycc9xxdsxbp5dj8
VITE_STACK_SECRET_SERVER_KEY=ssk_s87v1se1sfach57jr0bn36b5k4mm7kt6v96bwj45j1s3g
```

### Server (.env for Node.js)
```bash
# Database
DATABASE_URL=postgresql://neondb_owner:...@ep-aged-cherry-a5qkqvqv.us-east-2.aws.neon.tech/neondb?sslmode=require

# AI
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Stack Auth
STACK_PROJECT_ID=ddb5065b-a008-4f51-b576-0cbced7f83c2
STACK_SECRET_SERVER_KEY=ssk_s87v1se1sfach57jr0bn36b5k4mm7kt6v96bwj45j1s3g

# Configuration
NODE_ENV=production
PORT=3001
```

## Testing the Setup

### 1. Local Testing
```bash
# Start the dev server
npm run dev

# Open browser
http://localhost:3000

# Try to sign up
http://localhost:3000/sign-up
```

### 2. Verify Auth Flow
1. ✅ Sign up with email
2. ✅ Receive verification email
3. ✅ Verify email
4. ✅ Redirected to dashboard
5. ✅ Can create child profiles
6. ✅ Can generate plans

### 3. Check Database
- User should be created in `users` table
- Clerk ID should be the Stack Auth user ID
- Email should match

## Deployment Checklist

### Before Deploying
- [ ] Configure all URLs in Stack Auth dashboard
- [ ] Set up custom SMTP server
- [ ] Test email sending (verification, password reset)
- [ ] Update environment variables for production
- [ ] Test sign-up flow end-to-end locally

### Deploy Client (Vercel/Netlify)
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test production URL

### Deploy Server (Railway/Render)
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Deploy
- [ ] Update client API_URL to point to server

### After Deployment
- [ ] Test sign-up on production URL
- [ ] Verify emails are being sent
- [ ] Test creating child profiles
- [ ] Test generating plans
- [ ] Invite beta testers!

## Benefits of Neon Auth (Stack Auth)

✅ **Simpler**: No separate auth service, integrated with Neon
✅ **Cheaper**: No Clerk subscription needed
✅ **Better Integration**: Native with your Neon database
✅ **Modern**: Uses latest auth best practices
✅ **Flexible**: Easy to customize and extend

## Support

- **Stack Auth Docs**: https://docs.stack-auth.com/
- **Stack Auth Dashboard**: https://app.stack-auth.com/
- **Neon Dashboard**: https://console.neon.tech/

## Next Steps

1. ✅ Stack Auth is configured
2. 🔄 Restart dev server to pick up changes
3. 📧 Configure email server in Stack Auth dashboard
4. 🌐 Add your production URLs
5. 🧪 Test sign-up flow
6. 🚀 Deploy to production!

---

**Current Status**: Stack Auth configured, ready for testing! 🎉

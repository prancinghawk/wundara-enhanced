# Wundara Deployment Guide

## Overview

This guide will help you deploy Wundara to production using:
- **Cloudflare Pages** - Frontend (wundara.app)
- **Railway** - Backend API (api.wundara.app)
- **Neon** - Database + Authentication
- **Anthropic** - AI plan generation

---

## Part 1: Deploy Backend to Railway

### Step 1: Push Code to GitHub

If you haven't already:
```bash
cd /Users/kristinadoyle/CascadeProjects/windsurf-project
git init
git add .
git commit -m "Initial commit - Wundara beta"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wundara.git
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your **wundara** repository
6. Railway will detect it's a Node.js app

### Step 3: Configure Root Directory

Since your server is in `/server` folder:
1. In Railway dashboard, go to **Settings**
2. Find **"Root Directory"**
3. Set it to: `server`
4. Click **Save**

### Step 4: Add Environment Variables

In Railway dashboard, go to **Variables** tab and add these:

```bash
# Node Environment
NODE_ENV=production
PORT=3001

# Neon Database (from your .env)
DATABASE_URL=postgresql://neondb_owner:npg_l9rXzLnhwDu8@ep-gentle-forest-a7cj2j17-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require

# Anthropic AI
ANTHROPIC_API_KEY=your_anthropic_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Stack Auth (Neon Auth)
STACK_PROJECT_ID=ddb5065b-a008-4f51-b576-0cbced7f83c2
STACK_SECRET_SERVER_KEY=ssk_myah7x4azn49pnnsbendkxzmvet5hwvcjz5wjx0747bd8

# Development flags (set to false for production)
USE_DEV_AUTH=false
USE_REAL_AI=true
```

### Step 5: Deploy

1. Railway will automatically deploy
2. Wait for deployment to complete (~2-3 minutes)
3. You'll get a URL like: `https://wundara-production.up.railway.app`

### Step 6: Add Custom Domain

1. In Railway, go to **Settings** → **Domains**
2. Click **"Add Custom Domain"**
3. Enter: `api.wundara.app`
4. Railway will give you a CNAME record

### Step 7: Configure DNS in Cloudflare

1. Go to Cloudflare dashboard
2. Select **wundara.app** domain
3. Go to **DNS** → **Records**
4. Click **"Add record"**
5. Add CNAME record:
   - **Type**: CNAME
   - **Name**: api
   - **Target**: [Railway's CNAME from step 6]
   - **Proxy status**: Proxied (orange cloud)
6. Click **Save**

Wait 5-10 minutes for DNS to propagate.

---

## Part 2: Deploy Frontend to Cloudflare Pages

### Step 1: Build the Frontend

```bash
cd client
npm run build
```

This creates a `dist` folder with your production build.

### Step 2: Create Cloudflare Pages Project

1. Go to Cloudflare dashboard
2. Click **Workers & Pages** → **Create application** → **Pages**
3. Click **"Connect to Git"**
4. Select your GitHub repository
5. Configure build settings:
   - **Project name**: wundara
   - **Production branch**: main
   - **Build command**: `cd client && npm install && npm run build`
   - **Build output directory**: `client/dist`

### Step 3: Add Environment Variables

In Cloudflare Pages settings, add:

```bash
# API URL (your Railway backend)
VITE_API_URL=https://api.wundara.app

# Stack Auth (Neon Auth)
VITE_STACK_PROJECT_ID=ddb5065b-a008-4f51-b576-0cbced7f83c2
VITE_STACK_PUBLISHABLE_CLIENT_KEY=pck_eddnhmpctz5rnm6brbqphxj4t52xanw610e81xbajj1d0
VITE_STACK_SECRET_SERVER_KEY=ssk_myah7x4azn49pnnsbendkxzmvet5hwvcjz5wjx0747bd8
```

### Step 4: Deploy

1. Click **"Save and Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. You'll get a URL like: `https://wundara.pages.dev`

### Step 5: Add Custom Domain

1. In Cloudflare Pages, go to **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter: `wundara.app`
4. Cloudflare will automatically configure DNS (since you own the domain)
5. Click **"Activate domain"**

---

## Part 3: Configure Neon Auth Domains

1. Go to Neon dashboard: https://console.neon.tech
2. Select your **wundara** project
3. Go to **Authentication** settings
4. Under **Domains**, add:
   ```
   wundara.app
   api.wundara.app
   ```
5. Click **Save**

---

## Part 4: Test the Deployment

### Test Backend API
```bash
curl https://api.wundara.app/health
```

Should return:
```json
{"status":"ok","service":"wundara-server"}
```

### Test Frontend
1. Open browser to: `https://wundara.app`
2. You should see the Wundara homepage
3. Try to sign up with a test account
4. Verify email works
5. Create a child profile
6. Generate a learning plan

---

## Troubleshooting

### Backend Issues

**"Cannot connect to database"**
- Check DATABASE_URL in Railway environment variables
- Verify Neon database is running
- Check Neon IP allowlist (should allow all IPs)

**"Anthropic API error"**
- Verify ANTHROPIC_API_KEY is correct
- Check your Anthropic account has credits
- Verify API key has correct permissions

**"Authentication failed"**
- Check Stack Auth credentials in Railway
- Verify STACK_SECRET_SERVER_KEY is correct
- Check Neon Auth is provisioned

### Frontend Issues

**"Cannot connect to API"**
- Verify VITE_API_URL points to `https://api.wundara.app`
- Check Railway backend is running
- Verify CORS is configured (should be automatic)

**"Authentication not working"**
- Check Stack Auth credentials in Cloudflare Pages
- Verify domains are added in Neon Auth
- Check browser console for errors

### DNS Issues

**"Site not found"**
- Wait 10-15 minutes for DNS propagation
- Clear browser cache
- Try incognito/private browsing
- Verify DNS records in Cloudflare

---

## Post-Deployment Checklist

- [ ] Backend API is accessible at `https://api.wundara.app/health`
- [ ] Frontend loads at `https://wundara.app`
- [ ] Can sign up for new account
- [ ] Receive verification email
- [ ] Can log in
- [ ] Can create child profile
- [ ] Can generate learning plan
- [ ] Plan displays correctly
- [ ] All data persists after logout/login

---

## Monitoring & Maintenance

### Railway (Backend)
- Monitor logs in Railway dashboard
- Check CPU/Memory usage
- Set up alerts for downtime

### Cloudflare Pages (Frontend)
- Monitor analytics in Cloudflare dashboard
- Check build logs for errors
- Review performance metrics

### Neon (Database)
- Monitor database size
- Check query performance
- Review user growth

### Anthropic (AI)
- Monitor API usage
- Track costs
- Review plan quality

---

## Costs (Estimated Monthly)

### Free Tier Usage:
- **Railway**: $5 credit/month (should cover beta testing)
- **Cloudflare Pages**: Free (unlimited bandwidth)
- **Neon**: Free tier (0.5 GB storage, 191.9 compute hours)
- **Stack Auth**: Free (managed by Neon)

### Paid Usage (if you exceed free tier):
- **Railway**: ~$5-10/month for small app
- **Neon**: ~$0-5/month for small database
- **Anthropic**: ~$0.06-0.08 per plan generated

**Total for 50 beta users**: ~$15-25/month

---

## Scaling for Production

When you're ready to scale beyond beta:

1. **Upgrade Railway**: Move to paid plan for more resources
2. **Upgrade Neon**: Add more storage and compute
3. **Add monitoring**: Set up Sentry or LogRocket
4. **Add analytics**: Google Analytics or Plausible
5. **Custom email**: Set up SendGrid or AWS SES
6. **CDN**: Already have Cloudflare ✅
7. **Backups**: Set up automated database backups

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages
- **Neon Docs**: https://neon.tech/docs
- **Stack Auth Docs**: https://docs.stack-auth.com
- **Anthropic Docs**: https://docs.anthropic.com

---

## Security Checklist

- [ ] All API keys stored in environment variables (not in code)
- [ ] HTTPS enabled everywhere
- [ ] Database uses SSL connections
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (consider adding)
- [ ] Error messages don't expose sensitive info
- [ ] User data encrypted at rest (Neon does this)
- [ ] Regular security updates (npm audit)

---

## Next Steps After Deployment

1. **Test thoroughly** with multiple accounts
2. **Invite 5-10 beta testers** to start
3. **Gather feedback** and iterate
4. **Monitor errors** and fix issues
5. **Scale gradually** as you add more users
6. **Add features** based on feedback
7. **Prepare for public launch** on wundara.com.au

---

**You're ready to deploy!** 🚀

Start with Railway backend, then Cloudflare Pages frontend. Take it step by step and test after each deployment.

# 🚀 Deployment Guide

Complete guide for deploying your Paths application to production.

## 📋 Deployment Overview

Your application has three components to deploy:

1. **Frontend** (Next.js) → Vercel (recommended) or Netlify
2. **Backend** (Express API) → Railway, Render, or Fly.io
3. **Database** (PostgreSQL) → Included with backend host or Neon/Supabase

## 🎯 Recommended Setup

**Best for beginners:**
- Frontend: Vercel (free tier, optimized for Next.js)
- Backend + Database: Railway (free tier includes PostgreSQL)

**Best for production:**
- Frontend: Vercel (Pro plan)
- Backend: Railway or Render
- Database: Neon, Supabase, or Railway PostgreSQL

---

## Option 1: Deploy to Vercel + Railway (Recommended)

### Step 1: Deploy Database + Backend to Railway

**1.1 Create Railway Account**
- Go to https://railway.app
- Sign up with GitHub
- Create a new project

**1.2 Deploy PostgreSQL**

```bash
# In Railway dashboard:
1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Note the DATABASE_URL from the Variables tab
```

**1.3 Deploy Backend API**

```bash
# In Railway dashboard:
1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. Choose "apps/api" as the root directory
4. Add these environment variables:
```

**Environment Variables for Backend:**
```env
# Database (copy from PostgreSQL service)
DATABASE_URL=postgresql://...

# Server
PORT=3001
NODE_ENV=production

# CORS - Update with your Vercel domain
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**1.4 Update Railway Settings**

```bash
# In Railway service settings → Build:
Root Directory: apps/api
Build Command: pnpm install && pnpm --filter=@workspace/db db:generate && pnpm --filter=api build
Start Command: node dist/index.js

# In Railway service settings → Networking:
Generate Domain: Click to get your API URL (e.g., your-api.up.railway.app)
```

**1.5 Run Database Migration**

```bash
# In Railway PostgreSQL service, click "Connect" → "Connection URL"
# Copy the DATABASE_URL

# In your local terminal:
DATABASE_URL="<your-railway-postgres-url>" pnpm --filter=@workspace/db db:push

# Seed the database (optional):
DATABASE_URL="<your-railway-postgres-url>" pnpm --filter=@workspace/db db:seed
```

### Step 2: Deploy Frontend to Vercel

**2.1 Prepare Frontend**

Update `apps/web/.env.production`:
```bash
# Create this file in apps/web/
NEXT_PUBLIC_API_URL=https://your-api.up.railway.app
```

**2.2 Deploy to Vercel**

Option A - Using Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to your project
cd /home/shrid/projects/paths

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set root directory to: apps/web
# - Override build command: pnpm build
# - Override output directory: .next
```

Option B - Using Vercel Dashboard:
```bash
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: apps/web
   - Build Command: cd ../.. && pnpm install && pnpm --filter=web build
   - Output Directory: .next
5. Add Environment Variable:
   - NEXT_PUBLIC_API_URL: https://your-api.up.railway.app
6. Click "Deploy"
```

**2.3 Update CORS**

After frontend is deployed:
```bash
# Go back to Railway → Your API Service → Variables
# Update ALLOWED_ORIGINS to:
ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
```

### Step 3: Verify Deployment

```bash
# Test API
curl https://your-api.up.railway.app/health

# Test Frontend
# Visit https://your-app.vercel.app/api-test
```

---

## Option 2: Deploy to Render

### Step 1: Deploy PostgreSQL

```bash
1. Go to https://render.com
2. Dashboard → New → PostgreSQL
3. Name: paths-db
4. Instance Type: Free (or paid for production)
5. Click "Create Database"
6. Copy "Internal Database URL" from the database page
```

### Step 2: Deploy Backend API

**2.1 Create Web Service**
```bash
1. Dashboard → New → Web Service
2. Connect your Git repository
3. Configure:
   - Name: paths-api
   - Root Directory: apps/api
   - Environment: Node
   - Build Command: pnpm install && pnpm --filter=@workspace/db db:generate && pnpm --filter=api build
   - Start Command: node dist/index.js
```

**2.2 Environment Variables**
```env
DATABASE_URL=<your-render-postgres-internal-url>
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**2.3 Run Migration**
```bash
# In Render dashboard → your web service → Shell
pnpm --filter=@workspace/db db:push
pnpm --filter=@workspace/db db:seed
```

### Step 3: Deploy Frontend to Vercel

Same as Option 1, Step 2.

---

## Option 3: Deploy Everything to Railway

### Deploy Monorepo to Railway

**3.1 Create Railway Project**
```bash
1. New Project → Deploy from GitHub repo
2. Add PostgreSQL database to the project
```

**3.2 Configure API Service**
```bash
# Settings:
Root Directory: apps/api
Build Command: pnpm install && pnpm --filter=@workspace/db db:generate && pnpm --filter=api build
Start Command: node dist/index.js

# Environment Variables:
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=${{Web.RAILWAY_STATIC_URL}}
```

**3.3 Configure Web Service**
```bash
# Add new service (+ New → GitHub Repo → Same repo)
# Settings:
Root Directory: apps/web
Build Command: pnpm install && pnpm --filter=web build
Start Command: pnpm --filter=web start

# Environment Variables:
NEXT_PUBLIC_API_URL=${{API.RAILWAY_STATIC_URL}}
```

---

## Option 4: Deploy Database to Neon/Supabase

### Using Neon (Serverless PostgreSQL)

**4.1 Create Neon Database**
```bash
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string
```

**4.2 Update Environment Variables**
```env
# Use Neon connection string with pooling:
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/paths?sslmode=require&pgbouncer=true
```

### Using Supabase (PostgreSQL with extras)

**4.1 Create Supabase Project**
```bash
1. Go to https://supabase.com
2. New project → Choose region
3. Settings → Database → Connection String (URI)
```

**4.2 Update Environment Variables**
```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

---

## 🔐 Environment Variables Checklist

### Backend `.env` (Production)
```env
# Database - from your database provider
DATABASE_URL=postgresql://...

# Server
PORT=3001
NODE_ENV=production

# CORS - your frontend domain
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app.com
```

### Frontend `.env.production`
```env
# API URL - your backend domain
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

---

## 📦 Pre-Deployment Checklist

### Code Preparation

- [ ] Remove console.logs and debug code
- [ ] Add proper error handling
- [ ] Set up error monitoring (Sentry)
- [ ] Add analytics (if needed)
- [ ] Test all API endpoints
- [ ] Test frontend pages
- [ ] Review security (rate limiting, validation)

### Database

- [ ] Run migrations
- [ ] Seed initial data (if needed)
- [ ] Set up backups
- [ ] Configure connection pooling

### Environment Variables

- [ ] Set all required env vars on backend
- [ ] Set all required env vars on frontend
- [ ] Update CORS origins
- [ ] Update API URLs
- [ ] Never commit `.env` files

### Performance

- [ ] Enable production builds
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable compression

---

## 🔧 Post-Deployment Tasks

### 1. Set Up Custom Domain (Optional)

**Vercel:**
```bash
1. Project Settings → Domains
2. Add your domain (e.g., paths.com)
3. Configure DNS records as instructed
```

**Railway:**
```bash
1. Service Settings → Networking → Custom Domain
2. Add your API domain (e.g., api.paths.com)
3. Configure DNS:
   - Type: CNAME
   - Name: api
   - Value: your-service.up.railway.app
```

### 2. Set Up SSL/HTTPS

Both Vercel and Railway provide automatic SSL certificates.

### 3. Set Up Monitoring

**Vercel Analytics:**
```bash
1. Install: pnpm add @vercel/analytics
2. Add to apps/web/app/layout.tsx:
   import { Analytics } from '@vercel/analytics/react'
   
   <Analytics />
```

**Sentry for Error Tracking:**
```bash
1. Sign up at https://sentry.io
2. Install: pnpm add @sentry/nextjs @sentry/node
3. Configure for both frontend and backend
```

### 4. Database Backups

**Railway:**
- Automatic daily backups on paid plans
- Manual backups: Dashboard → Database → Backups

**Render:**
- Automatic daily backups on paid plans

**Neon/Supabase:**
- Automatic backups included

### 5. Set Up CI/CD

Both Vercel and Railway automatically deploy on Git push.

Configure branch deployments:
- `main` → Production
- `develop` → Staging
- Pull requests → Preview deployments

---

## 🚨 Troubleshooting Deployment Issues

### Build Fails

```bash
# Check build logs
# Common issues:
1. Missing dependencies → Run pnpm install
2. TypeScript errors → Fix type issues locally first
3. Environment variables → Verify all are set

# Test build locally:
cd apps/api
pnpm build

cd apps/web
pnpm build
```

### Database Connection Errors

```bash
# Check:
1. DATABASE_URL is correct
2. Database allows external connections
3. Database is running
4. Prisma client is generated

# Debug:
DATABASE_URL=<your-url> pnpm --filter=@workspace/db db:push
```

### CORS Errors

```bash
# Check:
1. ALLOWED_ORIGINS includes your frontend URL
2. Frontend is using correct API URL
3. Both are using https:// (not http://)

# Update backend CORS:
ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
```

### Frontend Can't Connect to API

```bash
# Check:
1. NEXT_PUBLIC_API_URL is set correctly
2. API is accessible (test with curl)
3. CORS is configured
4. Both use https://

# Test API:
curl https://your-api.railway.app/health
```

### Database Migration Issues

```bash
# Manual migration in production:
1. Connect to your production database
2. Run: DATABASE_URL=<prod-url> pnpm --filter=@workspace/db db:push
3. Or use: pnpm --filter=@workspace/db db:migrate
```

---

## 📊 Cost Estimates

### Free Tier (Good for MVP/Testing)
- **Vercel**: Free (Next.js hosting)
- **Railway**: $5/month credit (includes PostgreSQL)
- **Render**: Free (with limitations)
- **Total**: ~$0-5/month

### Production (Recommended)
- **Vercel Pro**: $20/month (better performance, analytics)
- **Railway**: ~$10-20/month (API + Database)
- **Neon**: ~$20/month (scalable PostgreSQL)
- **Total**: ~$50/month

### Enterprise
- Custom pricing based on needs
- Dedicated resources
- SLA guarantees
- Priority support

---

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for dev/prod
   - Rotate secrets regularly

2. **Database**
   - Use connection pooling
   - Enable SSL/TLS
   - Regular backups
   - Limit access by IP (if possible)

3. **API**
   - Add rate limiting
   - Validate all inputs
   - Use helmet.js (already configured)
   - Enable CORS only for your domain

4. **Frontend**
   - Don't expose API keys
   - Use environment variables properly
   - Enable CSP headers

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🎉 Quick Deploy Commands

```bash
# Deploy Frontend to Vercel
cd apps/web
vercel --prod

# Deploy Backend to Railway (using CLI)
railway login
railway init
railway up

# Manual deployment via Git
git push origin main  # Auto-deploys to both platforms
```

---

## Need Help?

1. Check deployment logs in your hosting dashboard
2. Test locally first with production builds
3. Verify all environment variables are set
4. Review the troubleshooting section above
5. Check your hosting provider's documentation

Happy deploying! 🚀

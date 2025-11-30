# 🚀 How to Deploy - Quick Guide

## 🎯 Fastest Way (30 minutes)

### **Vercel (Frontend) + Railway (Backend + Database)**

#### 1. Deploy Backend to Railway

```bash
# Visit https://railway.app and signup
# Create new project → Provision PostgreSQL
# Add GitHub repo → Select your repository

# Configure in Railway:
Root Directory: apps/api
Build Command: pnpm install && pnpm --filter=@workspace/db db:generate && pnpm --filter=api build
Start Command: node dist/index.js

# Environment Variables:
DATABASE_URL: (copy from PostgreSQL service)
PORT: 3001
NODE_ENV: production
ALLOWED_ORIGINS: https://your-app.vercel.app

# Generate domain → Copy API URL
# Example: https://your-api.up.railway.app
```

#### 2. Run Database Migration

```bash
# Copy DATABASE_URL from Railway
DATABASE_URL="postgresql://..." pnpm --filter=@workspace/db db:push
DATABASE_URL="postgresql://..." pnpm --filter=@workspace/db db:seed
```

#### 3. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /home/shrid/projects/paths
vercel

# When prompted:
# - Root directory: apps/web
# - Framework: Next.js

# Add environment variable in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://your-api.up.railway.app

# Redeploy
vercel --prod
```

#### 4. Update CORS

```bash
# In Railway → API service → Variables
# Update ALLOWED_ORIGINS to your Vercel URL:
ALLOWED_ORIGINS=https://your-app.vercel.app
```

#### 5. Test

```bash
# Visit your Vercel URL:
https://your-app.vercel.app/api-test

# Should show live data from database!
```

---

## 📚 Full Documentation

- **Complete Guide:** See `DEPLOYMENT.md`
- **Step-by-Step Checklist:** See `DEPLOYMENT_CHECKLIST.md`
- **Integration Guide:** See `INTEGRATION.md`

---

## 💰 Cost

**Free Tier:**
- Vercel: Free
- Railway: $5/month credit
- **Total: ~$0-5/month**

**Production:**
- Vercel Pro: $20/month
- Railway: ~$15/month
- **Total: ~$35/month**

---

## 🆘 Common Issues

### Build Fails?
```bash
# Test build locally first:
pnpm --filter=api build
pnpm --filter=web build
```

### CORS Error?
```bash
# Add your frontend URL to backend ALLOWED_ORIGINS
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Can't Connect to Database?
```bash
# Verify DATABASE_URL is correct
# Run migration manually:
DATABASE_URL="..." pnpm --filter=@workspace/db db:push
```

---

## 🎉 Success!

When deployment is successful, you'll have:
- ✅ Frontend live at `your-app.vercel.app`
- ✅ Backend live at `your-api.up.railway.app`  
- ✅ Database hosted on Railway
- ✅ Auto-deployment on every git push

---

**Need more details?** Check `DEPLOYMENT.md` for the complete guide!

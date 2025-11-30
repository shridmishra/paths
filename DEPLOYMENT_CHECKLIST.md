# 🚀 Quick Deployment Checklist

Use this checklist to deploy your application step-by-step.

## 🎯 **Option 1: Vercel + Railway** (Recommended - Fastest Setup)

### Part A: Railway (Backend + Database)

- [ ] **1. Create Railway account** at https://railway.app
- [ ] **2. Create new project** → "Provision PostgreSQL"
- [ ] **3. Add GitHub repo** → Select your repository
- [ ] **4. Configure API service:**
  ```
  Root Directory: apps/api
  Build Command: pnpm install && pnpm --filter=@workspace/db db:generate && pnpm --filter=api build
  Start Command: node dist/index.js
  ```
- [ ] **5. Add environment variables:**
  ```
  DATABASE_URL: (copy from PostgreSQL service Variables tab)
  PORT: 3001
  NODE_ENV: production
  ALLOWED_ORIGINS: https://your-app.vercel.app (update after frontend deploy)
  ```
- [ ] **6. Generate domain** in Networking tab → Note the URL
- [ ] **7. Run database migration:**
  ```bash
  # Copy DATABASE_URL from Railway
  DATABASE_URL="<railway-url>" pnpm --filter=@workspace/db db:push
  DATABASE_URL="<railway-url>" pnpm --filter=@workspace/db db:seed
  ```
- [ ] **8. Test API:**
  ```bash
  curl https://your-api.up.railway.app/health
  curl https://your-api.up.railway.app/api/v1/paths
  ```

### Part B: Vercel (Frontend)

- [ ] **9. Install Vercel CLI:**
  ```bash
  npm i -g vercel
  ```
- [ ] **10. Deploy from project root:**
  ```bash
  cd /home/shrid/projects/paths
  vercel
  ```
- [ ] **11. Follow prompts:**
  - Set root directory: `apps/web`
  - Framework preset: Next.js
  - Build command: (leave default)
  - Don't override settings: No
  
- [ ] **12. Add environment variable** in Vercel dashboard:
  ```
  NEXT_PUBLIC_API_URL: https://your-api.up.railway.app
  ```
- [ ] **13. Redeploy** after adding env var:
  ```bash
  vercel --prod
  ```
- [ ] **14. Update Railway CORS** with your Vercel URL:
  ```
  ALLOWED_ORIGINS: https://your-app.vercel.app
  ```

### Part C: Verify

- [ ] **15. Test frontend:** Visit `https://your-app.vercel.app/api-test`
- [ ] **16. Check all data loads** from the database
- [ ] **17. Test creating/updating** data if applicable
- [ ] **18. Check browser console** for any errors

---

## 🎯 **Option 2: Everything on Railway**

- [ ] **1. Create Railway project** from GitHub
- [ ] **2. Add PostgreSQL** to the project
- [ ] **3. Add API service:**
  - Root Directory: `apps/api`
  - Environment: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] **4. Add Web service:**
  - Root Directory: `apps/web`
  - Environment: `NEXT_PUBLIC_API_URL=https://${{API.RAILWAY_STATIC_URL}}`
- [ ] **5. Run migrations** via Railway shell or locally
- [ ] **6. Test both services**

---

## 🎯 **Option 3: Render + Vercel**

### Part A: Render (Backend + Database)

- [ ] **1. Create Render account** at https://render.com
- [ ] **2. New PostgreSQL database:**
  - Name: paths-db
  - Region: Choose closest to you
  - Instance: Free or paid
- [ ] **3. Copy Internal Database URL**
- [ ] **4. New Web Service** from GitHub repo:
  - Root Directory: `apps/api`
  - Build Command: `pnpm install && pnpm --filter=@workspace/db db:generate && pnpm --filter=api build`
  - Start Command: `node dist/index.js`
- [ ] **5. Add environment variables:**
  ```
  DATABASE_URL: <internal-db-url>
  PORT: 3001
  NODE_ENV: production
  ALLOWED_ORIGINS: https://your-app.vercel.app
  ```
- [ ] **6. Run migration** in Render shell
- [ ] **7. Test API** at your Render URL

### Part B: Vercel (Frontend)

- [ ] **8-14.** Follow same steps as Option 1, Part B

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed and pushed to GitHub
- [ ] Tests pass locally
- [ ] Build succeeds locally:
  ```bash
  pnpm --filter=api build
  pnpm --filter=web build
  ```
- [ ] No console.errors or warnings
- [ ] Environment variables are prepared
- [ ] Database schema is finalized
- [ ] You have accounts on hosting platforms

---

## 🔐 Environment Variables to Set

### Backend (Railway/Render)
```
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

---

## ✅ Post-Deployment Checklist

After deploying:

- [ ] **Test all pages** on production
- [ ] **Test API endpoints** work correctly
- [ ] **Check database** has correct data
- [ ] **Verify CORS** is configured correctly
- [ ] **Check logs** for any errors
- [ ] **Set up monitoring** (Vercel Analytics, Sentry)
- [ ] **Configure custom domain** (optional)
- [ ] **Set up backups** for database
- [ ] **Enable SSL/HTTPS** (automatic on most platforms)
- [ ] **Add deployment notifications** to Slack/Discord

---

## 🐛 Quick Troubleshooting

### Build fails?
```bash
# Check build logs
# Test locally:
pnpm --filter=api build
pnpm --filter=web build
```

### Database connection error?
```bash
# Verify DATABASE_URL is correct
# Check database is running
# Test connection locally:
DATABASE_URL=<prod-url> pnpm --filter=@workspace/db db:push
```

### CORS error?
```bash
# Update ALLOWED_ORIGINS in backend to include frontend URL
# Must use https:// not http://
```

### Frontend can't reach API?
```bash
# Verify NEXT_PUBLIC_API_URL is set
# Test API directly:
curl https://your-api.railway.app/health
# Check browser Network tab for exact error
```

---

## 📞 Need Help?

1. **Check logs** in your hosting dashboard
2. **Review DEPLOYMENT.md** for detailed guide
3. **Test locally** with production builds first
4. **Verify environment variables** are correct
5. **Check hosting provider docs**

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Frontend loads at your Vercel URL
- ✅ `/api-test` page shows data from database
- ✅ No errors in browser console
- ✅ API health check returns `{"status":"ok"}`
- ✅ All pages work correctly
- ✅ Data can be created/updated (if applicable)

---

**Time estimate:** 30-60 minutes for first deployment

**Next steps after deployment:**
1. Share your app with users/testers
2. Monitor performance and errors
3. Iterate based on feedback
4. Set up CI/CD for automatic deployments

Good luck! 🚀

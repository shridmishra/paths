# Railway Deployment Fix

## Problem
Railway was trying to use `npm` which doesn't support `workspace:*` protocol used in pnpm monorepos.

## Solution
Created configuration files to force Railway to use pnpm and properly handle the monorepo structure.

## Files Created

### 1. `nixpacks.toml` (Root Directory)
This tells Railway/Nixpacks to:
- Use Node.js 20 and pnpm
- Install dependencies with pnpm using workspace filtering
- Generate Prisma client before building
- Build only the API app
- Start the API service

### 2. `railway.toml` (Root Directory)
Railway-specific configuration for:
- Explicitly using nixpacks builder
- Defining the start command
- Setting restart policies

## Next Steps

1. **Commit and push these files to your repository:**
   ```bash
   git add nixpacks.toml railway.toml
   git commit -m "Add Railway deployment configuration for pnpm monorepo"
   git push
   ```

2. **Ensure your Railway project has these environment variables set:**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NODE_ENV` - Set to `production`
   - `PORT` - Railway will set this automatically, but the API should use `process.env.PORT`
   - Any other environment variables from your `.env` file

3. **Redeploy on Railway:**
   - Railway should automatically trigger a new deployment when you push
   - Or manually trigger a redeploy from the Railway dashboard

## Verification

After deployment, you should see in the build logs:
- ✅ pnpm being used instead of npm
- ✅ Workspace dependencies being installed correctly
- ✅ Prisma client being generated
- ✅ API building successfully

## Alternative Solution (If Above Doesn't Work)

If Railway still has issues, you can try these alternatives:

### Option A: Use Root Directory Deployment
In Railway dashboard:
1. Set root directory to "/"
2. Ensure nixpacks.toml is being read
3. Check build logs for pnpm usage

### Option B: Deploy Only the API (Without Workspaces)
This requires creating a standalone deployment package, which is more complex. Let me know if you need this approach.

## Troubleshooting

If you still see the `EUNSUPPORTEDPROTOCOL` error:
1. Verify `nixpacks.toml` is in the repository root
2. Check Railway build logs to confirm pnpm is being used
3. Ensure `pnpm-lock.yaml` is committed to the repository
4. Verify Railway is reading from the correct branch and directory

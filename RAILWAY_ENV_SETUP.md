# Railway Environment Variables Checklist

Based on your API structure, here are the environment variables you need to configure in Railway:

## Required Environment Variables

### 1. Database
```
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```
- If you're using Railway's PostgreSQL addon, this will be auto-configured
- Make sure to include `?sslmode=require` for Railway's managed database

### 2. Node Environment
```
NODE_ENV="production"
```

### 3. Port (Optional - Auto-set by Railway)
```
PORT=3001
```
- Railway automatically sets PORT, but your app defaults to 3001 if not set

## How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your API service
3. Navigate to the "Variables" tab
4. Add each variable:
   - Click "New Variable"
   - Enter the variable name and value
   - Click "Add"

## Database Setup

If you haven't already:

1. **Add PostgreSQL to your Railway project:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically create `DATABASE_URL` variable

2. **Run database migrations after deployment:**
   ```bash
   # You'll need to do this through Railway CLI or setup a migration script
   pnpm --filter=@workspace/db db:push
   ```

## Post-Deployment Steps

After your first successful deployment:

1. **Run Prisma migrations:**
   ```bash
   railway run pnpm --filter=@workspace/db db:push
   ```

2. **Seed the database (if needed):**
   ```bash
   railway run pnpm --filter=@workspace/db db:seed
   ```

3. **Verify the deployment:**
   - Check the deployment URL Railway provides
   - Test your API endpoints
   - Check the logs for any errors

## Common Issues

### Database Connection
- Make sure `DATABASE_URL` includes `?sslmode=require`
- Verify database is in the same Railway project/region

### Build Failures
- Check that `nixpacks.toml` is in the root directory
- Verify `pnpm-lock.yaml` is committed
- Review build logs for specific errors

### Runtime Errors
- Check application logs in Railway dashboard
- Verify all environment variables are set
- Ensure database migrations have been run

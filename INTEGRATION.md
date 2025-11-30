# Frontend-Backend Integration Guide

This guide explains how the frontend (Next.js web app) connects to the backend (Express API).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│                     http://localhost:3000                    │
│                                                              │
│  ┌──────────────┐      ┌─────────────┐     ┌─────────────┐ │
│  │   Pages      │─────▶│  API Hooks  │────▶│ API Client  │ │
│  │  (React)     │      │ (React Query)│     │  (fetch)    │ │
│  └──────────────┘      └─────────────┘     └──────┬──────┘ │
│                                                     │        │
└─────────────────────────────────────────────────────┼────────┘
                                                      │
                                                      │ HTTP/REST
                                                      │
┌─────────────────────────────────────────────────────┼────────┐
│                                                     ▼        │
│  ┌──────────────┐      ┌─────────────┐     ┌─────────────┐ │
│  │   Routes     │─────▶│ Controllers │────▶│  Services   │ │
│  │  (Express)   │      │             │     │             │ │
│  └──────────────┘      └─────────────┘     └──────┬──────┘ │
│                                                     │        │
│                         Backend (Express)           │        │
│                     http://localhost:3001           │        │
└─────────────────────────────────────────────────────┼────────┘
                                                      │
                                                      │ Prisma ORM
                                                      │
                                        ┌─────────────▼─────────────┐
                                        │   PostgreSQL Database      │
                                        │    localhost:5432          │
                                        └───────────────────────────┘
```

## Quick Start

### 1. Initial Setup

Run the automated setup script:

```bash
./setup.sh
```

This will:
- ✅ Install all dependencies
- ✅ Start PostgreSQL database (Docker)
- ✅ Create environment files
- ✅ Generate Prisma client
- ✅ Push database schema
- ✅ Seed with sample data

### 2. Start Development Servers

**Terminal 1 - Start the API:**
```bash
pnpm dev --filter=api
# API will run at http://localhost:3001
```

**Terminal 2 - Start the Web App:**
```bash
pnpm dev --filter=web
# Web app will run at http://localhost:3000
```

### 3. Verify Connection

Open your browser to http://localhost:3000

The web app should now be fetching data from the API!

## Project Structure

### Frontend (`apps/web/`)

```
apps/web/
├── lib/
│   ├── api-client.ts          # HTTP client for API calls
│   ├── types.ts               # TypeScript interfaces
│   └── hooks/
│       └── use-api.ts         # React Query hooks
├── app/
│   └── (main)/
│       ├── page.tsx           # Homepage - uses usePaths()
│       ├── path/[id]/         # Path details - uses usePath()
│       └── ...
└── .env.local                 # Frontend environment variables
```

### Backend (`apps/api/`)

```
apps/api/
├── src/
│   ├── routes/                # API endpoints
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── repositories/          # Database queries
│   └── app.ts                 # Express app configuration
└── .env                       # Backend environment variables
```

### Database (`packages/db/`)

```
packages/db/
└── prisma/
    ├── schema.prisma          # Database schema
    └── seed.ts                # Sample data
```

## API Endpoints

### Paths
- `GET /api/paths` - Get all learning paths
- `GET /api/paths/:id` - Get path by ID
- `POST /api/paths` - Create new path
- `PUT /api/paths/:id` - Update path
- `DELETE /api/paths/:id` - Delete path

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get topic by ID
- `POST /api/topics` - Create new topic

### Questions
- `GET /api/questions` - Get all questions (with filters)
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create new question

### Progress
- `GET /api/progress/user/:userId` - Get user's progress
- `GET /api/progress/user/:userId/stats` - Get progress statistics
- `POST /api/progress` - Update progress

## Using the API in Frontend

### Example 1: Fetch All Paths

```tsx
'use client';

import { usePaths } from '@/lib/hooks/use-api';

export function PathsList() {
  const { data: paths, isLoading, error } = usePaths();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading paths</div>;

  return (
    <div>
      {paths?.map((path) => (
        <div key={path.id}>
          <h2>{path.title}</h2>
          <p>{path.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Create a New Path

```tsx
'use client';

import { useCreatePath } from '@/lib/hooks/use-api';

export function CreatePathForm() {
  const createPath = useCreatePath();

  const handleSubmit = async (data: CreatePathRequest) => {
    try {
      await createPath.mutateAsync(data);
      // Success! The cache will automatically update
    } catch (error) {
      console.error('Failed to create path:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Example 3: Direct API Call

```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const paths = await apiClient.get('/api/paths');

// POST request
const newPath = await apiClient.post('/api/paths', {
  title: 'My Path',
  difficulty: 'beginner',
  category: 'frontend',
  userId: 'user-id',
});
```

## Environment Variables

### Frontend (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (`.env`)

```bash
DATABASE_URL="postgresql://paths_user:paths_password@localhost:5432/paths_db?schema=public"
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

## Common Commands

### Database Management

```bash
# View database in Prisma Studio
pnpm --filter=@workspace/db db:studio

# Reset database and re-seed
pnpm --filter=@workspace/db db:push --force-reset
pnpm --filter=@workspace/db db:seed

# Generate Prisma client after schema changes
pnpm --filter=@workspace/db db:generate

# Create a migration
pnpm --filter=@workspace/db db:migrate
```

### Development

```bash
# Install dependencies
pnpm install

# Run both frontend and backend
pnpm dev

# Run only frontend
pnpm dev --filter=web

# Run only backend
pnpm dev --filter=api

# Build for production
pnpm build
```

### Docker

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View database logs
docker-compose logs -f postgres

# Access PostgreSQL shell
docker exec -it paths-postgres psql -U paths_user -d paths_db
```

## Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to database

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep paths-postgres

# Restart database
docker-compose down
docker-compose up -d

# Check database logs
docker-compose logs postgres
```

### CORS Errors

**Problem:** Frontend can't access API due to CORS

**Solution:** Check that `ALLOWED_ORIGINS` in `apps/api/.env` includes your frontend URL:
```bash
ALLOWED_ORIGINS=http://localhost:3000
```

### API Not Responding

**Problem:** API returns 404 or connection refused

**Solution:**
```bash
# Ensure API is running
cd apps/api
pnpm dev

# Check API is accessible
curl http://localhost:3001/health
```

### Stale Data

**Problem:** Frontend shows old data after API changes

**Solution:** React Query caches data. Either:
1. Refresh the page
2. Use the mutation hooks which auto-invalidate cache
3. Manually invalidate queries in DevTools

## React Query DevTools

React Query includes DevTools for debugging. They're automatically available in development at the bottom of the page.

Features:
- View all queries and their status
- Inspect cached data
- Manually refetch or invalidate queries
- Monitor background refetches

## Testing the Connection

### 1. Health Check

```bash
curl http://localhost:3001/health
# Should return: {"status":"ok"}
```

### 2. Fetch Paths

```bash
curl http://localhost:3001/api/paths
# Should return array of paths
```

### 3. Check Frontend

Open http://localhost:3000 in your browser. Open DevTools Console and Network tab to see API requests.

## Next Steps

1. **Authentication**: Add user authentication (JWT, OAuth, etc.)
2. **Error Handling**: Improve error messages and user feedback
3. **Loading States**: Add skeletons and better loading indicators
4. **Validation**: Add input validation with Zod
5. **Tests**: Add unit and integration tests
6. **Deployment**: Deploy to production (Vercel + Railway/Render)

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)

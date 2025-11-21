# Quick Reference: Restructured API

## Database Commands

All database commands should be run from the root:

```bash
# Generate Prisma client
pnpm --filter @workspace/db db:generate

# Push schema changes (development)
pnpm --filter @workspace/db db:push

# Create and run migrations (production)
pnpm --filter @workspace/db db:migrate

# Open Prisma Studio
pnpm --filter @workspace/db db:studio
```

## Development

```bash
# Start API dev server
pnpm --filter api dev

# Build API
pnpm --filter api build

# Type check
pnpm --filter api typecheck

# Lint
pnpm --filter api lint
```

## Using the Database Package

```typescript
// Import Prisma client and types
import { prisma, User, Path, Topic, Question, Progress } from '@workspace/db';

// Use in services
const users = await prisma.user.findMany();
```

## Creating New Features

### 1. Create a Service

`src/services/example.service.ts`:
```typescript
import { prisma } from '@workspace/db';
import { NotFoundError } from '../lib/errors.js';

export class ExampleService {
  async getAll() {
    return prisma.example.findMany();
  }

  async getById(id: string) {
    const item = await prisma.example.findUnique({ where: { id } });
    if (!item) throw new NotFoundError('Item not found');
    return item;
  }
}

export const exampleService = new ExampleService();
```

### 2. Create a Controller

`src/controllers/example.controller.ts`:
```typescript
import type { Request, Response, NextFunction } from 'express';
import { exampleService } from '../services/example.service.js';
import { BadRequestError } from '../lib/errors.js';

export class ExampleController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const items = await exampleService.getAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError('ID is required');
      
      const item = await exampleService.getById(id);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
}

export const exampleController = new ExampleController();
```

### 3. Create Routes

`src/routes/example.routes.ts`:
```typescript
import { Router, type Router as ExpressRouter } from 'express';
import { exampleController } from '../controllers/example.controller.js';

const router: ExpressRouter = Router();

router.get('/', exampleController.getAll.bind(exampleController));
router.get('/:id', exampleController.getById.bind(exampleController));

export default router;
```

### 4. Register Routes

In `src/app.ts`:
```typescript
import exampleRoutes from './routes/example.routes.js';

// ...
app.use('/api/examples', exampleRoutes);
```

## Error Handling

Use custom error classes for consistent error responses:

```typescript
import { 
  BadRequestError,    // 400
  UnauthorizedError,  // 401
  ForbiddenError,     // 403
  NotFoundError,      // 404
  ConflictError       // 409
} from '../lib/errors.js';

// Example usage
if (!email) {
  throw new BadRequestError('Email is required');
}

if (!user) {
  throw new NotFoundError('User not found');
}
```

## Logging

Use the logger utility for consistent logging:

```typescript
import { logger } from '../lib/logger.js';

logger.info('User created', { userId: user.id });
logger.warn('Invalid request', { error: err.message });
logger.error('Database error', { error: err });
logger.debug('Debug info', { data }); // Only in development
```

## Project Structure

```
apps/api/src/
├── index.ts              # Server entry point
├── app.ts                # Express app configuration
├── controllers/          # HTTP request handlers
│   └── users.controller.ts
├── services/             # Business logic & database operations
│   └── users.service.ts
├── routes/               # Route definitions
│   └── users.routes.ts
├── schemas/              # Validation schemas (future: Zod)
└── lib/                  # Utilities
    ├── errors.ts         # Custom error classes
    └── logger.ts         # Logging utility
```

## Environment Variables

Create `.env` in the root or in `apps/api/`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/paths"

# Server
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

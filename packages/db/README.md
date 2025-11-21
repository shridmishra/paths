# @workspace/db

Shared database package for the Paths monorepo.

## Features

- Centralized Prisma schema
- Shared Prisma client instance
- Type-safe database access across all apps

## Usage

```typescript
import { prisma } from '@workspace/db';

// Use prisma client
const users = await prisma.user.findMany();
```

## Scripts

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

## Environment Variables

Create a `.env` file in the root of the monorepo or in this package:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

# Paths Learning Platform

A monorepo for the Paths learning platform containing the web application and backend API.

## Apps

- **web**: Next.js frontend application
- **api**: Express + Prisma + PostgreSQL backend

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the database:**
   ```bash
   docker-compose up -d
   ```

3. **Setup the backend:**
   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env if needed (default values work with docker-compose)
   pnpm db:push
   cd ../..
   ```

4. **Start development servers:**
   ```bash
   pnpm dev
   ```

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button"
```

# Paths API

Backend API for the Paths learning platform built with Express, Prisma, and PostgreSQL.

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the `DATABASE_URL` with your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/paths_db?schema=public"
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma Client
   pnpm db:generate
   
   # Push the schema to your database (for development)
   pnpm db:push
   
   # Or run migrations (for production)
   pnpm db:migrate
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:3001`.

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Health Check
- `GET /health` - Check API health status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

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
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic

### Questions
- `GET /api/questions` - Get all questions (supports filtering by type, difficulty, topicId)
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Progress
- `GET /api/progress/user/:userId` - Get all progress for a user
- `GET /api/progress/user/:userId/stats` - Get progress statistics
- `POST /api/progress` - Create or update progress
- `DELETE /api/progress/:id` - Delete progress

## Database Schema

The database includes the following models:
- **User** - User accounts
- **Path** - Learning paths
- **Topic** - Topics within paths
- **Question** - Questions for quizzes and interviews
- **Progress** - User progress tracking

## Tech Stack

- **Express** - Web framework
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **tsx** - TypeScript execution for development

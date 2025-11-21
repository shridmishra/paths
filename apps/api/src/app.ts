import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { AppError } from './lib/errors.js';
import { logger } from './lib/logger.js';

// Import routes
import userRoutes from './routes/users.routes.js';
import pathRoutes from './routes/paths.js';
import topicRoutes from './routes/topics.js';
import questionRoutes from './routes/questions.js';
import progressRoutes from './routes/progress.js';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.get('/api', (_req: Request, res: Response) => {
    res.json({ message: 'Paths API - Learning Platform Backend' });
  });

  app.use('/api/users', userRoutes);
  app.use('/api/paths', pathRoutes);
  app.use('/api/topics', topicRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/progress', progressRoutes);

  // Error handling middleware
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      logger.warn(`AppError: ${err.message}`, { statusCode: err.statusCode });
      return res.status(err.statusCode).json({ error: err.message });
    }

    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  return app;
}

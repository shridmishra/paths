import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { serverConfig, corsConfig, apiConfig } from './config/index.js';
import { errorHandler, notFound } from './middleware/index.js';
import routes from './routes/index.js';
import { logger } from './utils/logger.util.js';

export function createApp(): Express {
  const app = express();

  // Security & Performance Middleware
  app.use(helmet());
  app.use(compression());
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request Logging
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: serverConfig.env,
    });
  });

  // API Routes
  app.use(apiConfig.prefix, routes);

  // 404 Handler
  app.use(notFound);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

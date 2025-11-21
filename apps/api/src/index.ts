import dotenv from 'dotenv';
import { prisma } from '@workspace/db';
import { createApp } from './app.js';
import { logger } from './lib/logger.js';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3001;
const app = createApp();

// Start server
const server = app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM signal');
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});

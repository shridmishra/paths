/**
 * Database Configuration
 * Centralized configuration for database settings
 */

export const databaseConfig = {
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/paths',
  logQueries: process.env.DB_LOG_QUERIES === 'true',
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000', 10),
} as const;

/**
 * Server Configuration
 * Centralized configuration for server settings
 */

export const serverConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

/**
 * CORS Configuration
 */
export const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
} as const;

/**
 * API Configuration
 */
export const apiConfig = {
  prefix: '/api',
  version: 'v1',
  get basePath() {
    return `${this.prefix}/${this.version}`;
  },
} as const;

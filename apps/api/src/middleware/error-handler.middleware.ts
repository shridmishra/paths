import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.util.js';
import { logger } from '../utils/logger.util.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle known application errors
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`, {
      statusCode: err.statusCode,
      stack: err.stack,
    });

    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.statusCode,
      },
    });
    return;
  }

  // Handle unknown errors
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
  });

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      message: 'An unexpected error occurred',
      code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    },
  });
};

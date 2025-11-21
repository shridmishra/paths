import type { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * 404 Not Found middleware
 * Handles requests to undefined routes
 */
export const notFound = (_req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      message: 'Resource not found',
      code: HTTP_STATUS.NOT_FOUND,
    },
  });
};

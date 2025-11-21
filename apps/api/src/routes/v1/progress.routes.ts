import { Router } from 'express';
import { progressController } from '../../controllers/progress.controller.js';
import { asyncHandler } from '../../utils/async-handler.util.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  updateProgressSchema,
  getProgressSchema,
  deleteProgressSchema,
} from '../../validators/progress.validator.js';

const router: Router = Router();

router.get(
  '/user/:userId',
  validate(getProgressSchema),
  asyncHandler(progressController.getByUser.bind(progressController))
);

router.get(
  '/user/:userId/stats',
  validate(getProgressSchema),
  asyncHandler(progressController.getStats.bind(progressController))
);

router.post(
  '/',
  validate(updateProgressSchema),
  asyncHandler(progressController.update.bind(progressController))
);

router.delete(
  '/:id',
  validate(deleteProgressSchema),
  asyncHandler(progressController.delete.bind(progressController))
);

export default router;

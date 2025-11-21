import { Router } from 'express';
import { topicsController } from '../../controllers/topics.controller.js';
import { asyncHandler } from '../../utils/async-handler.util.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  createTopicSchema,
  updateTopicSchema,
  getTopicSchema,
} from '../../validators/topics.validator.js';

const router: Router = Router();

router.get(
  '/',
  asyncHandler(topicsController.getAll.bind(topicsController))
);

router.get(
  '/:id',
  validate(getTopicSchema),
  asyncHandler(topicsController.getById.bind(topicsController))
);

router.post(
  '/',
  validate(createTopicSchema),
  asyncHandler(topicsController.create.bind(topicsController))
);

router.put(
  '/:id',
  validate(updateTopicSchema),
  asyncHandler(topicsController.update.bind(topicsController))
);

router.delete(
  '/:id',
  validate(getTopicSchema),
  asyncHandler(topicsController.delete.bind(topicsController))
);

export default router;

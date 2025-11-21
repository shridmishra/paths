import { Router } from 'express';
import { pathsController } from '../../controllers/paths.controller.js';
import { asyncHandler } from '../../utils/async-handler.util.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  createPathSchema,
  updatePathSchema,
  getPathSchema,
} from '../../validators/paths.validator.js';

const router: Router = Router();

router.get(
  '/',
  asyncHandler(pathsController.getAll.bind(pathsController))
);

router.get(
  '/:id',
  validate(getPathSchema),
  asyncHandler(pathsController.getById.bind(pathsController))
);

router.post(
  '/',
  validate(createPathSchema),
  asyncHandler(pathsController.create.bind(pathsController))
);

router.put(
  '/:id',
  validate(updatePathSchema),
  asyncHandler(pathsController.update.bind(pathsController))
);

router.delete(
  '/:id',
  validate(getPathSchema),
  asyncHandler(pathsController.delete.bind(pathsController))
);

export default router;

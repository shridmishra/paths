import { Router } from 'express';
import { usersController } from '../../controllers/users.controller.js';
import { asyncHandler } from '../../utils/async-handler.util.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
} from '../../validators/users.validator.js';

const router: Router = Router();

router.get(
  '/',
  asyncHandler(usersController.getAll.bind(usersController))
);

router.get(
  '/:id',
  validate(getUserSchema),
  asyncHandler(usersController.getById.bind(usersController))
);

router.post(
  '/',
  validate(createUserSchema),
  asyncHandler(usersController.create.bind(usersController))
);

router.put(
  '/:id',
  validate(updateUserSchema),
  asyncHandler(usersController.update.bind(usersController))
);

router.delete(
  '/:id',
  validate(getUserSchema),
  asyncHandler(usersController.delete.bind(usersController))
);

export default router;

import { Router } from 'express';
import { questionsController } from '../../controllers/questions.controller.js';
import { asyncHandler } from '../../utils/async-handler.util.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  createQuestionSchema,
  updateQuestionSchema,
  getQuestionSchema,
  getQuestionsSchema,
} from '../../validators/questions.validator.js';

const router: Router = Router();

router.get(
  '/',
  validate(getQuestionsSchema),
  asyncHandler(questionsController.getAll.bind(questionsController))
);

router.get(
  '/:id',
  validate(getQuestionSchema),
  asyncHandler(questionsController.getById.bind(questionsController))
);

router.post(
  '/',
  validate(createQuestionSchema),
  asyncHandler(questionsController.create.bind(questionsController))
);

router.put(
  '/:id',
  validate(updateQuestionSchema),
  asyncHandler(questionsController.update.bind(questionsController))
);

router.delete(
  '/:id',
  validate(getQuestionSchema),
  asyncHandler(questionsController.delete.bind(questionsController))
);

export default router;

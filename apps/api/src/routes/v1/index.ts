import { Router } from 'express';
import usersRoutes from './users.routes.js';
import pathsRoutes from './paths.routes.js';
import topicsRoutes from './topics.routes.js';
import questionsRoutes from './questions.routes.js';
import progressRoutes from './progress.routes.js';

const router: Router = Router();

router.use('/users', usersRoutes);
router.use('/paths', pathsRoutes);
router.use('/topics', topicsRoutes);
router.use('/questions', questionsRoutes);
router.use('/progress', progressRoutes);

export default router;

import type { Request, Response } from 'express';
import { progressService } from '../services/progress.service.js';
import { HTTP_STATUS } from '../constants/index.js';

export class ProgressController {
  async getByUser(req: Request, res: Response) {
    const { userId } = req.params;
    const progress = await progressService.getUserProgress(userId as string);
    res.status(HTTP_STATUS.OK).json(progress);
  }

  async getStats(req: Request, res: Response) {
    const { userId } = req.params;
    const stats = await progressService.getUserStats(userId as string);
    res.status(HTTP_STATUS.OK).json(stats);
  }

  async update(req: Request, res: Response) {
    const progress = await progressService.updateProgress(req.body);
    res.status(HTTP_STATUS.OK).json(progress);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await progressService.deleteProgress(id as string);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export const progressController = new ProgressController();

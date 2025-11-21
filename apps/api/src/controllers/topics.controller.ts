import type { Request, Response } from 'express';
import { topicsService } from '../services/topics.service.js';
import { HTTP_STATUS } from '../constants/index.js';

export class TopicsController {
  async getAll(_req: Request, res: Response) {
    const topics = await topicsService.getAllTopics();
    res.status(HTTP_STATUS.OK).json(topics);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const topic = await topicsService.getTopicById(id as string);
    res.status(HTTP_STATUS.OK).json(topic);
  }

  async create(req: Request, res: Response) {
    const topic = await topicsService.createTopic(req.body);
    res.status(HTTP_STATUS.CREATED).json(topic);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const topic = await topicsService.updateTopic(id as string, req.body);
    res.status(HTTP_STATUS.OK).json(topic);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await topicsService.deleteTopic(id as string);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export const topicsController = new TopicsController();

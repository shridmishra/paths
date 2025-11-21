import type { Request, Response } from 'express';
import { questionsService } from '../services/questions.service.js';
import { HTTP_STATUS } from '../constants/index.js';

export class QuestionsController {
  async getAll(req: Request, res: Response) {
    const filters = {
      type: req.query.type as string,
      difficulty: req.query.difficulty as string,
      topicId: req.query.topicId as string,
    };
    const questions = await questionsService.getAllQuestions(filters);
    res.status(HTTP_STATUS.OK).json(questions);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const question = await questionsService.getQuestionById(id as string);
    res.status(HTTP_STATUS.OK).json(question);
  }

  async create(req: Request, res: Response) {
    const question = await questionsService.createQuestion(req.body);
    res.status(HTTP_STATUS.CREATED).json(question);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const question = await questionsService.updateQuestion(id as string, req.body);
    res.status(HTTP_STATUS.OK).json(question);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await questionsService.deleteQuestion(id as string);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export const questionsController = new QuestionsController();

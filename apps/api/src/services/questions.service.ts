import { questionsRepository } from '../repositories/questions.repository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.util.js';
import type { Question } from '@workspace/db';

export class QuestionsService {
  async getAllQuestions(filters: {
    type?: string;
    difficulty?: string;
    topicId?: string;
  }): Promise<Question[]> {
    const where: any = {};
    if (filters.type) where.type = filters.type;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.topicId) where.topicId = filters.topicId;

    return questionsRepository.findAll(where);
  }

  async getQuestionById(id: string): Promise<Question> {
    const question = await questionsRepository.findById(id);

    if (!question) {
      throw new NotFoundError(`Question with ID ${id} not found`);
    }

    return question;
  }

  async createQuestion(data: {
    question: string;
    answer: string;
    difficulty?: string;
    type?: string;
    topicId: string;
  }): Promise<Question> {
    if (!data.question || !data.answer || !data.topicId) {
      throw new BadRequestError('Question, answer, and topicId are required');
    }

    return questionsRepository.create({
      question: data.question,
      answer: data.answer,
      difficulty: data.difficulty || 'medium',
      type: data.type || 'quiz',
      topic: {
        connect: { id: data.topicId },
      },
    });
  }

  async updateQuestion(
    id: string,
    data: {
      question?: string;
      answer?: string;
      difficulty?: string;
      type?: string;
    }
  ): Promise<Question> {
    const exists = await questionsRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Question with ID ${id} not found`);
    }

    return questionsRepository.update(id, data);
  }

  async deleteQuestion(id: string): Promise<void> {
    const exists = await questionsRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Question with ID ${id} not found`);
    }

    await questionsRepository.delete(id);
  }
}

export const questionsService = new QuestionsService();

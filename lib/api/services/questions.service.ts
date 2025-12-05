import { questionsRepository } from '../repositories/questions.repository';
import { NotFoundError, BadRequestError } from '../utils/errors.util';
import type { Question } from '@/lib/db';

export class QuestionsService {
  async getAllQuestions(filters: {
    type?: string;
    difficulty?: string;
    topicId?: string;
  }): Promise<Question[]> {
    return questionsRepository.findAll(filters);
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
      topicId: data.topicId,
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

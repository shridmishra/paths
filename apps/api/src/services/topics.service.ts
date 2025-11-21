import { topicsRepository } from '../repositories/topics.repository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.util.js';
import type { Topic } from '@workspace/db';

export class TopicsService {
  async getAllTopics(): Promise<Topic[]> {
    return topicsRepository.findAll();
  }

  async getTopicById(id: string): Promise<Topic> {
    const topic = await topicsRepository.findById(id);

    if (!topic) {
      throw new NotFoundError(`Topic with ID ${id} not found`);
    }

    return topic;
  }

  async createTopic(data: {
    title: string;
    description?: string;
    order?: number;
    pathId: string;
  }): Promise<Topic> {
    if (!data.title) {
      throw new BadRequestError('Title is required');
    }
    if (!data.pathId) {
      throw new BadRequestError('Path ID is required');
    }

    return topicsRepository.create({
      title: data.title,
      description: data.description,
      order: data.order || 0,
      path: {
        connect: { id: data.pathId },
      },
    });
  }

  async updateTopic(
    id: string,
    data: {
      title?: string;
      description?: string;
      order?: number;
    }
  ): Promise<Topic> {
    const exists = await topicsRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Topic with ID ${id} not found`);
    }

    return topicsRepository.update(id, data);
  }

  async deleteTopic(id: string): Promise<void> {
    const exists = await topicsRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Topic with ID ${id} not found`);
    }

    await topicsRepository.delete(id);
  }
}

export const topicsService = new TopicsService();

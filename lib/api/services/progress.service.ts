import { progressRepository } from '../repositories/progress.repository';
import { NotFoundError, BadRequestError } from '../utils/errors.util';
import type { Progress } from '@/lib/db';

export class ProgressService {
  async getUserProgress(userId: string): Promise<Progress[]> {
    return progressRepository.findByUserId(userId);
  }

  async getUserStats(userId: string) {
    const totalProgress = await progressRepository.countByUserId(userId);
    const completedProgress = await progressRepository.countByUserId(userId, true);
    
    const averageScore = await progressRepository.getAverageScore(userId);

    return {
      total: totalProgress,
      completed: completedProgress,
      averageScore: averageScore,
      completionRate: totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0,
    };
  }

  async updateProgress(data: {
    userId: string;
    questionId: string;
    completed?: boolean;
    score?: number;
  }) {
    if (!data.userId || !data.questionId) {
      throw new BadRequestError('userId and questionId are required');
    }

    return progressRepository.upsert(
      data.userId,
      data.questionId,
      {
        completed: data.completed,
        score: data.score,
        completedAt: data.completed ? new Date() : null,
      }
    );
  }

  async deleteProgress(id: string): Promise<void> {
    const exists = await progressRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Progress with ID ${id} not found`);
    }

    await progressRepository.delete(id);
  }
}

export const progressService = new ProgressService();

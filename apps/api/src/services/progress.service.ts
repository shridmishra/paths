import { progressRepository } from '../repositories/progress.repository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.util.js';
import type { Progress } from '@workspace/db';

export class ProgressService {
  async getUserProgress(userId: string): Promise<Progress[]> {
    return progressRepository.findByUserId(userId);
  }

  async getUserStats(userId: string) {
    const totalProgress = await progressRepository.count({ userId });
    const completedProgress = await progressRepository.count({ userId, completed: true });
    
    const averageScore = await progressRepository.aggregate({
      where: { userId, completed: true },
      _avg: { score: true },
    });

    return {
      total: totalProgress,
      completed: completedProgress,
      averageScore: averageScore._avg?.score || 0,
      completionRate: totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0,
    };
  }

  async updateProgress(data: {
    userId: string;
    questionId: string;
    completed?: boolean;
    score?: number;
  }): Promise<Progress> {
    if (!data.userId || !data.questionId) {
      throw new BadRequestError('userId and questionId are required');
    }

    return progressRepository.upsert(
      data.userId,
      data.questionId,
      {
        user: { connect: { id: data.userId } },
        question: { connect: { id: data.questionId } },
        completed: data.completed || false,
        score: data.score || null,
        completedAt: data.completed ? new Date() : null,
      },
      {
        completed: data.completed ?? undefined,
        score: data.score ?? undefined,
        completedAt: data.completed ? new Date() : undefined,
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

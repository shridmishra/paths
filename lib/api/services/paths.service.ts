import { pathsRepository } from '../repositories/paths.repository';
import { NotFoundError, BadRequestError } from '../utils/errors.util';
import type { Path, Prisma } from '@/lib/db';

export class PathsService {
  /**
   * Get all paths
   */
  async getAllPaths(): Promise<Path[]> {
    return pathsRepository.findAll();
  }

  /**
   * Get path by ID
   */
  async getPathById(id: string): Promise<Path> {
    const path = await pathsRepository.findById(id);

    if (!path) {
      throw new NotFoundError(`Path with ID ${id} not found`);
    }

    return path;
  }

  /**
   * Create a new path
   */
  async createPath(data: {
    title: string;
    description?: string;
    difficulty?: string;
    category?: string;
    userId: string;
  }): Promise<Path> {
    if (!data.title) {
      throw new BadRequestError('Title is required');
    }
    if (!data.userId) {
      throw new BadRequestError('User ID is required');
    }

    return pathsRepository.create({
      title: data.title,
      description: data.description,
      difficulty: data.difficulty || 'beginner',
      category: data.category || 'general',
      user: {
        connect: { id: data.userId },
      },
    });
  }

  /**
   * Update path
   */
  async updatePath(
    id: string,
    data: {
      title?: string;
      description?: string;
      difficulty?: string;
      category?: string;
    }
  ): Promise<Path> {
    const exists = await pathsRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Path with ID ${id} not found`);
    }

    return pathsRepository.update(id, data);
  }

  /**
   * Delete path
   */
  async deletePath(id: string): Promise<void> {
    const exists = await pathsRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Path with ID ${id} not found`);
    }

    await pathsRepository.delete(id);
  }
}

export const pathsService = new PathsService();

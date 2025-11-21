import { prisma } from '@workspace/db';
import type { Path, Prisma } from '@workspace/db';

/**
 * Paths Repository
 * Handles all database operations for learning paths
 */
export class PathsRepository {
  /**
   * Find all paths with optional filtering
   */
  async findAll(include?: Prisma.PathInclude): Promise<Path[]> {
    return prisma.path.findMany({
      include: include || {
        user: {
          select: { id: true, name: true, email: true },
        },
        topics: {
          include: {
            _count: {
              select: { questions: true },
            },
          },
        },
        _count: {
          select: { topics: true },
        },
      },
    });
  }

  /**
   * Find path by ID
   */
  async findById(id: string, include?: Prisma.PathInclude): Promise<Path | null> {
    return prisma.path.findUnique({
      where: { id },
      include: include || {
        user: {
          select: { id: true, name: true, email: true },
        },
        topics: {
          include: {
            questions: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  /**
   * Find paths by user ID
   */
  async findByUserId(userId: string): Promise<Path[]> {
    return prisma.path.findMany({
      where: { userId },
      include: {
        topics: {
          include: {
            _count: {
              select: { questions: true },
            },
          },
        },
      },
    });
  }

  /**
   * Create a new path
   */
  async create(data: Prisma.PathCreateInput): Promise<Path> {
    return prisma.path.create({
      data,
      include: {
        topics: true,
      },
    });
  }

  /**
   * Update path by ID
   */
  async update(id: string, data: Prisma.PathUpdateInput): Promise<Path> {
    return prisma.path.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete path by ID
   */
  async delete(id: string): Promise<Path> {
    return prisma.path.delete({
      where: { id },
    });
  }

  /**
   * Check if path exists
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.path.count({
      where: { id },
    });
    return count > 0;
  }
}

export const pathsRepository = new PathsRepository();

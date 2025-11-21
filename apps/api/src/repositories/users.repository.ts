import { prisma } from '@workspace/db';
import type { User, Prisma } from '@workspace/db';

/**
 * Users Repository
 * Handles all database operations for users
 */
export class UsersRepository {
  /**
   * Find all users with optional filtering
   */
  async findAll(include?: Prisma.UserInclude): Promise<User[]> {
    return prisma.user.findMany({
      include: include || {
        _count: {
          select: { paths: true, progress: true },
        },
      },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string, include?: Prisma.UserInclude): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: include || {
        paths: true,
        progress: {
          include: {
            question: true,
          },
        },
      },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Create a new user
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Update user by ID
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Check if user exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Check if email is already taken
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: {
        email,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return count > 0;
  }
}

export const usersRepository = new UsersRepository();

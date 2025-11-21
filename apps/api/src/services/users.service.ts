import { prisma } from '@workspace/db';
import { NotFoundError } from '../lib/errors.js';

export class UsersService {
  async getAllUsers() {
    return prisma.user.findMany({
      include: {
        _count: {
          select: { paths: true, progress: true }
        }
      }
    });
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        paths: true,
        progress: {
          include: {
            question: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async createUser(data: { email: string; name?: string }) {
    return prisma.user.create({
      data
    });
  }

  async updateUser(id: string, data: { email?: string; name?: string }) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id }
    });
  }
}

export const usersService = new UsersService();

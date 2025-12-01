import { prisma } from '@/lib/db';
import type { Progress, Prisma } from '@/lib/db';

export class ProgressRepository {
  async findByUserId(userId: string): Promise<Progress[]> {
    return prisma.progress.findMany({
      where: { userId },
      include: {
        question: {
          include: {
            topic: {
              include: {
                path: true,
              },
            },
          },
        },
      },
    });
  }

  async count(where: Prisma.ProgressWhereInput): Promise<number> {
    return prisma.progress.count({ where });
  }

  async aggregate(args: Prisma.ProgressAggregateArgs) {
    return prisma.progress.aggregate(args);
  }

  async upsert(
    userId: string,
    questionId: string,
    createData: Prisma.ProgressCreateInput,
    updateData: Prisma.ProgressUpdateInput
  ): Promise<Progress> {
    return prisma.progress.upsert({
      where: {
        userId_questionId: { userId, questionId },
      },
      create: createData,
      update: updateData,
    });
  }

  async delete(id: string): Promise<Progress> {
    return prisma.progress.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.progress.count({
      where: { id },
    });
    return count > 0;
  }
}

export const progressRepository = new ProgressRepository();

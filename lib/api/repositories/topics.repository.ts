import { prisma } from '@/lib/db';
import type { Topic, Prisma } from '@/lib/db';

export class TopicsRepository {
  async findAll(include?: Prisma.TopicInclude): Promise<Topic[]> {
    return prisma.topic.findMany({
      include: include || {
        path: {
          select: { id: true, title: true },
        },
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string, include?: Prisma.TopicInclude): Promise<Topic | null> {
    return prisma.topic.findUnique({
      where: { id },
      include: include || {
        path: true,
        questions: true,
      },
    });
  }

  async create(data: Prisma.TopicCreateInput): Promise<Topic> {
    return prisma.topic.create({
      data,
    });
  }

  async update(id: string, data: Prisma.TopicUpdateInput): Promise<Topic> {
    return prisma.topic.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Topic> {
    return prisma.topic.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.topic.count({
      where: { id },
    });
    return count > 0;
  }
}

export const topicsRepository = new TopicsRepository();

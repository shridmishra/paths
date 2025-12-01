import { prisma } from '@/lib/db';
import type { Question, Prisma } from '@/lib/db';

export class QuestionsRepository {
  async findAll(where?: Prisma.QuestionWhereInput, include?: Prisma.QuestionInclude): Promise<Question[]> {
    return prisma.question.findMany({
      where,
      include: include || {
        topic: {
          select: { id: true, title: true },
        },
      },
    });
  }

  async findById(id: string, include?: Prisma.QuestionInclude): Promise<Question | null> {
    return prisma.question.findUnique({
      where: { id },
      include: include || {
        topic: {
          include: {
            path: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.QuestionCreateInput): Promise<Question> {
    return prisma.question.create({
      data,
    });
  }

  async update(id: string, data: Prisma.QuestionUpdateInput): Promise<Question> {
    return prisma.question.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Question> {
    return prisma.question.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.question.count({
      where: { id },
    });
    return count > 0;
  }
}

export const questionsRepository = new QuestionsRepository();

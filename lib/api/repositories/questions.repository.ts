import { db } from '@/lib/db';
import { questions, type questions as QuestionType } from '@/lib/db/schema';
import { eq, sql, and } from 'drizzle-orm';

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export class QuestionsRepository {
  async findAll(filters: { topicId?: string; type?: string; difficulty?: string } = {}) {
    const conditions = [];
    if (filters.topicId) conditions.push(eq(questions.topicId, filters.topicId));
    if (filters.type) conditions.push(eq(questions.type, filters.type));
    if (filters.difficulty) conditions.push(eq(questions.difficulty, filters.difficulty));

    return db.query.questions.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        topic: {
          columns: { id: true, title: true },
        },
      },
    });
  }

  async findById(id: string) {
    return db.query.questions.findFirst({
      where: eq(questions.id, id),
      with: {
        topic: {
          with: {
            path: true,
          },
        },
      },
    });
  }

  async create(data: NewQuestion) {
    const [question] = await db.insert(questions).values(data).returning();
    return question;
  }

  async update(id: string, data: Partial<NewQuestion>) {
    const [question] = await db
      .update(questions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(questions.id, id))
      .returning();
    return question;
  }

  async delete(id: string) {
    const [question] = await db.delete(questions).where(eq(questions.id, id)).returning();
    return question;
  }

  async exists(id: string): Promise<boolean> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(questions)
      .where(eq(questions.id, id));
    return Number(result[0]?.count) > 0;
  }
}

export const questionsRepository = new QuestionsRepository();

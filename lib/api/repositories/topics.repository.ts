import { db } from '@/lib/db';
import { topics, type topics as TopicType } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;

export class TopicsRepository {
  async findAll() {
    return db.query.topics.findMany({
      with: {
        path: {
          columns: { id: true, title: true },
        },
        questions: {
          columns: { id: true },
        },
      },
      orderBy: (topics, { asc }) => [asc(topics.order)],
    });
  }

  async findById(id: string) {
    return db.query.topics.findFirst({
      where: eq(topics.id, id),
      with: {
        path: true,
        questions: true,
      },
    });
  }

  async create(data: NewTopic) {
    const [topic] = await db.insert(topics).values(data).returning();
    return topic;
  }

  async update(id: string, data: Partial<NewTopic>) {
    const [topic] = await db
      .update(topics)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(topics.id, id))
      .returning();
    return topic;
  }

  async delete(id: string) {
    const [topic] = await db.delete(topics).where(eq(topics.id, id)).returning();
    return topic;
  }

  async exists(id: string): Promise<boolean> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(topics)
      .where(eq(topics.id, id));
    return Number(result[0]?.count) > 0;
  }
}

export const topicsRepository = new TopicsRepository();

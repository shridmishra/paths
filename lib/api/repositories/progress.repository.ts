import { db } from '@/lib/db';
import { progress, type progress as ProgressType } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;

export class ProgressRepository {
  async findByUserId(userId: string) {
    return db.query.progress.findMany({
      where: eq(progress.userId, userId),
      with: {
        question: {
          with: {
            topic: {
              with: {
                path: true,
              },
            },
          },
        },
      },
    });
  }

  async countByUserId(userId: string, completed?: boolean): Promise<number> {
    const conditions = [eq(progress.userId, userId)];
    if (completed !== undefined) {
      conditions.push(eq(progress.completed, completed));
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(progress)
      .where(and(...conditions));
    
    return Number(result[0]?.count);
  }

  async getAverageScore(userId: string): Promise<number> {
    const result = await db
      .select({ avg: sql<number>`avg(${progress.score})` })
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.completed, true)));
    
    return Number(result[0]?.avg) || 0;
  }

  async upsert(
    userId: string,
    questionId: string,
    data: Partial<NewProgress>
  ) {
    // We use onConflictDoUpdate
    // The constraint is on [userId, questionId]
    // But Drizzle needs the constraint name or columns.
    // In schema I defined `unique([userId, questionId])`.
    // I need to check how to target it.
    // Usually `target: [progress.userId, progress.questionId]` works.
    
    const values = {
      userId,
      questionId,
      ...data,
      updatedAt: new Date(),
    } as NewProgress; // Cast because we might be missing some required fields if they were default, but here we should have them or they are nullable.
    // Actually userId and questionId are required.

    const [result] = await db.insert(progress)
      .values(values)
      .onConflictDoUpdate({
        target: [progress.userId, progress.questionId],
        set: { ...data, updatedAt: new Date() },
      })
      .returning();
    
    return result;
  }

  async delete(id: string) {
    const [result] = await db.delete(progress).where(eq(progress.id, id)).returning();
    return result;
  }

  async exists(id: string): Promise<boolean> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(progress)
      .where(eq(progress.id, id));
    return Number(result[0]?.count) > 0;
  }
}

export const progressRepository = new ProgressRepository();

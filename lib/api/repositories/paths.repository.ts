import { db } from '@/lib/db';
import { paths, topics, type paths as PathType } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export type Path = typeof paths.$inferSelect;
export type NewPath = typeof paths.$inferInsert;

/**
 * Paths Repository
 * Handles all database operations for learning paths
 */
export class PathsRepository {
  /**
   * Find all paths
   */
  async findAll() {
    return db.query.paths.findMany({
      with: {
        user: {
          columns: { id: true, name: true, email: true },
        },
        topics: {
          with: {
            questions: {
              columns: { id: true },
            },
          },
        },
      },
    });
  }

  /**
   * Find path by ID
   */
  async findById(id: string) {
    return db.query.paths.findFirst({
      where: eq(paths.id, id),
      with: {
        user: {
          columns: { id: true, name: true, email: true },
        },
        topics: {
          orderBy: (topics, { asc }) => [asc(topics.order)],
          with: {
            questions: true,
          },
        },
      },
    });
  }

  /**
   * Find paths by user ID
   */
  async findByUserId(userId: string) {
    return db.query.paths.findMany({
      where: eq(paths.userId, userId),
      with: {
        topics: {
          with: {
            questions: {
              columns: { id: true },
            },
          },
        },
      },
    });
  }

  /**
   * Create a new path
   */
  async create(data: NewPath) {
    const [path] = await db.insert(paths).values(data).returning();
    return path;
  }

  /**
   * Update path by ID
   */
  async update(id: string, data: Partial<NewPath>) {
    const [path] = await db
      .update(paths)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(paths.id, id))
      .returning();
    return path;
  }

  /**
   * Delete path by ID
   */
  async delete(id: string) {
    const [path] = await db.delete(paths).where(eq(paths.id, id)).returning();
    return path;
  }

  /**
   * Check if path exists
   */
  async exists(id: string): Promise<boolean> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(paths)
      .where(eq(paths.id, id));
    return Number(result[0]?.count) > 0;
  }
}

export const pathsRepository = new PathsRepository();

import { db } from '@/lib/db';
import { users, type users as UserType } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * Users Repository
 * Handles all database operations for users
 */
export class UsersRepository {
  /**
   * Find all users
   */
  async findAll() {
    return db.query.users.findMany({
      with: {
        paths: true,
        progress: true,
      },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        paths: true,
        progress: {
          with: {
            question: true,
          },
        },
      },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  /**
   * Create a new user
   */
  async create(data: NewUser) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  /**
   * Update user by ID
   */
  async update(id: string, data: Partial<NewUser>) {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  /**
   * Delete user by ID
   */
  async delete(id: string) {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();
    return user;
  }

  /**
   * Check if user exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.id, id));
    return Number(result[0]?.count) > 0;
  }

  /**
   * Check if email is already taken
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const result = await db.execute(sql`
      SELECT count(*) as count FROM ${users} 
      WHERE ${users.email} = ${email} 
      ${excludeId ? sql`AND ${users.id} != ${excludeId}` : sql``}
    `);
    
    return Number(result[0]?.count) > 0;
  }
}

export const usersRepository = new UsersRepository();

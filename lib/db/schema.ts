
import { pgTable, text, timestamp, boolean, integer, primaryKey, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Helper for timestamps
const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
};

// Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  name: text("name"),
  ...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
  paths: many(paths),
  progress: many(progress),
}));

// Paths Table
export const paths = pgTable("paths", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  category: text("category").notNull(), // frontend, backend, fullstack
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const pathsRelations = relations(paths, ({ one, many }) => ({
  user: one(users, {
    fields: [paths.userId],
    references: [users.id],
  }),
  topics: many(topics),
}));

// Topics Table
export const topics = pgTable("topics", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  pathId: text("path_id").notNull().references(() => paths.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const topicsRelations = relations(topics, ({ one, many }) => ({
  path: one(paths, {
    fields: [topics.pathId],
    references: [paths.id],
  }),
  questions: many(questions),
}));

// Questions Table
export const questions = pgTable("questions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  type: text("type").notNull(), // quiz, interview
  topicId: text("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  topic: one(topics, {
    fields: [questions.topicId],
    references: [topics.id],
  }),
  progress: many(progress),
}));

// Progress Table
export const progress = pgTable("progress", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  completed: boolean("completed").default(false).notNull(),
  score: integer("score"),
  completedAt: timestamp("completed_at"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  ...timestamps,
}, (t) => ({
  unq: unique().on(t.userId, t.questionId),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [progress.questionId],
    references: [questions.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Path = typeof paths.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Progress = typeof progress.$inferSelect;

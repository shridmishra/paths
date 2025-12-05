
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
  password: text("password"),
  role: text("role").default("user").notNull(),
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
  published: boolean("published").default(false).notNull(),
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
  lessons: many(lessons),
}));

// Lessons Table
export const lessons = pgTable("lessons", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content").notNull(), // URL or text content
  type: text("type").notNull(), // video, article, exercise, quiz
  duration: text("duration"),
  order: integer("order").notNull(),
  topicId: text("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  topic: one(topics, {
    fields: [lessons.topicId],
    references: [topics.id],
  }),
  progress: many(progress),
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
  questionId: text("question_id").references(() => questions.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id").references(() => lessons.id, { onDelete: "cascade" }),
  ...timestamps,
}, (t) => ({
  unq: unique().on(t.userId, t.questionId, t.lessonId),
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
  lesson: one(lessons, {
    fields: [progress.lessonId],
    references: [lessons.id],
  }),
}));

// Discussions Table
export const discussions = pgTable("discussions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  pathId: text("path_id").notNull().references(() => paths.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isPinned: boolean("is_pinned").default(false).notNull(),
  ...timestamps,
});

export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  path: one(paths, {
    fields: [discussions.pathId],
    references: [paths.id],
  }),
  user: one(users, {
    fields: [discussions.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

// Comments Table
export const comments = pgTable("comments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  discussionId: text("discussion_id").notNull().references(() => discussions.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const commentsRelations = relations(comments, ({ one }) => ({
  discussion: one(discussions, {
    fields: [comments.discussionId],
    references: [discussions.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Path = typeof paths.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Progress = typeof progress.$inferSelect;
export type Discussion = typeof discussions.$inferSelect;
export type Comment = typeof comments.$inferSelect;

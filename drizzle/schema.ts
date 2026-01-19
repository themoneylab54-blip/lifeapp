import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tasks table - stores both Protocol (recurring) and Tactical (one-time) tasks
 */
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: text("title").notNull(),
  type: mysqlEnum("type", ["protocol", "tactical"]).notNull(),
  completed: int("completed").default(0).notNull(), // boolean as int
  date: timestamp("date").notNull(),
  frequency: mysqlEnum("frequency", ["once", "daily", "custom"]).default("once").notNull(),
  customDays: text("customDays"), // JSON array of day numbers [0-6]
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Habits table - stores recurring operations (Protocol tasks templates)
 */
export const habits = mysqlTable("habits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: text("title").notNull(),
  frequency: mysqlEnum("frequency", ["daily", "custom"]).notNull(),
  customDays: text("customDays"), // JSON array of day numbers [0-6]
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = typeof habits.$inferInsert;

/**
 * Logs table - stores completion logs for habits
 */
export const logs = mysqlTable("logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  habitId: int("habitId").notNull(),
  date: timestamp("date").notNull(),
  completed: int("completed").default(0).notNull(), // boolean as int
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Log = typeof logs.$inferSelect;
export type InsertLog = typeof logs.$inferInsert;

/**
 * Stats table - stores financial data (cashflow)
 */
export const stats = mysqlTable("stats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(), // in cents to avoid floating point issues
  date: timestamp("date").notNull(),
  type: mysqlEnum("type", ["income", "expense"]).default("income").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Stat = typeof stats.$inferSelect;
export type InsertStat = typeof stats.$inferInsert;

/**
 * Goals table - stores long-term projects/objectives
 */
export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: text("title").notNull(),
  target: int("target").notNull(),
  current: int("current").default(0).notNull(),
  deadline: timestamp("deadline"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

/**
 * Journal table - stores timestamped notes
 */
export const journal = mysqlTable("journal", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JournalEntry = typeof journal.$inferSelect;
export type InsertJournalEntry = typeof journal.$inferInsert;

/**
 * User profile extension - stores XP, level, and rank
 */
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  xp: int("xp").default(0).notNull(),
  level: int("level").default(1).notNull(),
  rank: mysqlEnum("rank", [
    "Recrue",
    "Éclaireur",
    "Soldat",
    "Caporal",
    "Sergent",
    "Lieutenant",
    "Capitaine",
    "Commandant",
    "Colonel",
    "Général",
    "Warlord",
    "Empereur"
  ]).default("Recrue").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
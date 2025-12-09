import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const priorities = ["low", "medium", "high"] as const;
export type Priority = (typeof priorities)[number];

export const categories = ["work", "study", "health", "finance", "personal"] as const;
export type Category = (typeof categories)[number];

export const statuses = ["pending", "completed"] as const;
export type Status = (typeof statuses)[number];

export const plans = pgTable("plans", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").$type<Priority>().notNull().default("medium"),
  category: text("category").$type<Category>().notNull().default("personal"),
  status: text("status").$type<Status>().notNull().default("pending"),
  deadline: text("deadline"),
  createdAt: text("created_at").notNull().default(sql`now()`),
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const updatePlanSchema = insertPlanSchema.partial();

export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type UpdatePlan = z.infer<typeof updatePlanSchema>;
export type Plan = typeof plans.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

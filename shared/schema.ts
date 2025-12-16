import { z } from "zod";

export const priorities = ["low", "medium", "high"] as const;
export type Priority = (typeof priorities)[number];

export const categories = ["work", "study", "health", "finance", "personal"] as const;
export type Category = (typeof categories)[number];

export const statuses = ["pending", "completed"] as const;
export type Status = (typeof statuses)[number];

// User Schema
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export const userSchema = insertUserSchema.extend({
  id: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Plan Schema
export const insertPlanSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  priority: z.enum(priorities).default("medium"),
  category: z.enum(categories).default("personal"),
  status: z.enum(statuses).default("pending"),
  deadline: z.string().optional().nullable(),
});

export type InsertPlan = z.infer<typeof insertPlanSchema>;

export const updatePlanSchema = insertPlanSchema.partial();

export type UpdatePlan = z.infer<typeof updatePlanSchema>;

export const planSchema = insertPlanSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
});

export type Plan = z.infer<typeof planSchema>;

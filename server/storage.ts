import { type Plan, type InsertPlan, type UpdatePlan, type User, type InsertUser, plans, users } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllPlans(userId: string): Promise<Plan[]>;
  getPlan(id: string, userId: string): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan, userId: string): Promise<Plan>;
  updatePlan(id: string, plan: UpdatePlan, userId: string): Promise<Plan | undefined>;
  deletePlan(id: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllPlans(userId: string): Promise<Plan[]> {
    return await db.select().from(plans).where(eq(plans.userId, userId)).orderBy(desc(plans.createdAt));
  }

  async getPlan(id: string, userId: string): Promise<Plan | undefined> {
    const result = await db.select().from(plans).where(and(eq(plans.id, id), eq(plans.userId, userId)));
    return result[0];
  }

  async createPlan(insertPlan: InsertPlan, userId: string): Promise<Plan> {
    const result = await db.insert(plans).values({
      userId,
      title: insertPlan.title,
      description: insertPlan.description || null,
      priority: insertPlan.priority || "medium",
      category: insertPlan.category || "personal",
      status: insertPlan.status || "pending",
      deadline: insertPlan.deadline || null,
    }).returning();
    return result[0];
  }

  async updatePlan(id: string, updateData: UpdatePlan, userId: string): Promise<Plan | undefined> {
    const result = await db.update(plans)
      .set(updateData)
      .where(and(eq(plans.id, id), eq(plans.userId, userId)))
      .returning();
    return result[0];
  }

  async deletePlan(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(plans).where(and(eq(plans.id, id), eq(plans.userId, userId))).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();

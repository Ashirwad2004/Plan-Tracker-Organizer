import { type Plan, type InsertPlan, type UpdatePlan, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: string, plan: UpdatePlan): Promise<Plan | undefined>;
  deletePlan(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private plans: Map<string, Plan>;

  constructor() {
    this.users = new Map();
    this.plans = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getPlan(id: string): Promise<Plan | undefined> {
    return this.plans.get(id);
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const id = randomUUID();
    const plan: Plan = {
      id,
      title: insertPlan.title,
      description: insertPlan.description || null,
      priority: insertPlan.priority || "medium",
      category: insertPlan.category || "personal",
      status: insertPlan.status || "pending",
      deadline: insertPlan.deadline || null,
      createdAt: new Date().toISOString(),
    };
    this.plans.set(id, plan);
    return plan;
  }

  async updatePlan(id: string, updateData: UpdatePlan): Promise<Plan | undefined> {
    const existing = this.plans.get(id);
    if (!existing) return undefined;

    const updated: Plan = {
      ...existing,
      ...updateData,
    };
    this.plans.set(id, updated);
    return updated;
  }

  async deletePlan(id: string): Promise<boolean> {
    return this.plans.delete(id);
  }
}

export const storage = new MemStorage();

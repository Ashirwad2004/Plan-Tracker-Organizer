import { type Plan, type InsertPlan, type UpdatePlan, type User, type InsertUser } from "@shared/schema";
import { mongoose } from "./db";
import { Schema } from "mongoose";

// User Model
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: false,
  _id: true,
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

// Plan Model
const PlanSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: null },
  priority: { type: String, required: true, default: "medium" },
  category: { type: String, required: true, default: "personal" },
  status: { type: String, required: true, default: "pending" },
  deadline: { type: String, default: null },
  createdAt: { type: String, required: true, default: () => new Date().toISOString() },
}, {
  timestamps: false,
  _id: true,
});

const PlanModel = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);

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
    const user = await UserModel.findById(id).lean();
    if (!user) return undefined;
    return {
      id: user._id.toString(),
      username: user.username,
      password: user.password,
    };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username }).lean();
    if (!user) return undefined;
    return {
      id: user._id.toString(),
      username: user.username,
      password: user.password,
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = new UserModel(insertUser);
    const saved = await user.save();
    return {
      id: saved._id.toString(),
      username: saved.username,
      password: saved.password,
    };
  }

  async getAllPlans(userId: string): Promise<Plan[]> {
    const plans = await PlanModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return plans.map((plan: any) => ({
      id: plan._id.toString(),
      userId: plan.userId,
      title: plan.title,
      description: plan.description || null,
      priority: plan.priority as Plan["priority"],
      category: plan.category as Plan["category"],
      status: plan.status as Plan["status"],
      deadline: plan.deadline || null,
      createdAt: plan.createdAt,
    }));
  }

  async getPlan(id: string, userId: string): Promise<Plan | undefined> {
    const plan = await PlanModel.findOne({ _id: id, userId }).lean();
    if (!plan) return undefined;
    return {
      id: plan._id.toString(),
      userId: plan.userId,
      title: plan.title,
      description: plan.description || null,
      priority: plan.priority as Plan["priority"],
      category: plan.category as Plan["category"],
      status: plan.status as Plan["status"],
      deadline: plan.deadline || null,
      createdAt: plan.createdAt,
    };
  }

  async createPlan(insertPlan: InsertPlan, userId: string): Promise<Plan> {
    const plan = new PlanModel({
      userId,
      title: insertPlan.title,
      description: insertPlan.description || null,
      priority: insertPlan.priority || "medium",
      category: insertPlan.category || "personal",
      status: insertPlan.status || "pending",
      deadline: insertPlan.deadline || null,
      createdAt: new Date().toISOString(),
    });
    const saved = await plan.save();
    return {
      id: saved._id.toString(),
      userId: saved.userId,
      title: saved.title,
      description: saved.description || null,
      priority: saved.priority as Plan["priority"],
      category: saved.category as Plan["category"],
      status: saved.status as Plan["status"],
      deadline: saved.deadline || null,
      createdAt: saved.createdAt,
    };
  }

  async updatePlan(id: string, updateData: UpdatePlan, userId: string): Promise<Plan | undefined> {
    const plan = await PlanModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true }
    ).lean();
    if (!plan) return undefined;
    return {
      id: plan._id.toString(),
      userId: plan.userId,
      title: plan.title,
      description: plan.description || null,
      priority: plan.priority as Plan["priority"],
      category: plan.category as Plan["category"],
      status: plan.status as Plan["status"],
      deadline: plan.deadline || null,
      createdAt: plan.createdAt,
    };
  }

  async deletePlan(id: string, userId: string): Promise<boolean> {
    const result = await PlanModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
}

export const storage = new DatabaseStorage();

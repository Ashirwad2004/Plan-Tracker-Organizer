import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlanSchema, updatePlanSchema } from "@shared/schema";
import { register, login, logout, getCurrentUser, requireAuth } from "./auth";
import { aiSuggestImprovements, aiSortTasks, aiDailyPlanner } from "./ai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", getCurrentUser);

  // Protected plan routes
  app.get("/api/plans", requireAuth, async (req, res) => {
    try {
      const plans = await storage.getAllPlans(req.userId!);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  app.get("/api/plans/:id", requireAuth, async (req, res) => {
    try {
      const plan = await storage.getPlan(req.params.id, req.userId!);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plan" });
    }
  });

  app.post("/api/plans", requireAuth, async (req, res) => {
    try {
      const parsed = insertPlanSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid plan data", details: parsed.error.errors });
      }
      const plan = await storage.createPlan(parsed.data, req.userId!);
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to create plan" });
    }
  });

  app.patch("/api/plans/:id", requireAuth, async (req, res) => {
    try {
      const parsed = updatePlanSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid plan data", details: parsed.error.errors });
      }
      const plan = await storage.updatePlan(req.params.id, parsed.data, req.userId!);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update plan" });
    }
  });

  app.delete("/api/plans/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deletePlan(req.params.id, req.userId!);
      if (!deleted) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete plan" });
    }
  });

  // AI routes
  app.post("/api/ai/suggest", requireAuth, async (req, res) => {
    try {
      const plans = await storage.getAllPlans(req.userId!);
      const suggestions = await aiSuggestImprovements(plans);
      res.json({ suggestions });
    } catch (error) {
      res.status(500).json({ error: "Failed to get AI suggestions" });
    }
  });

  app.post("/api/ai/sort", requireAuth, async (req, res) => {
    try {
      const plans = await storage.getAllPlans(req.userId!);
      const prioritized = await aiSortTasks(plans);
      res.json({ prioritized });
    } catch (error) {
      res.status(500).json({ error: "Failed to sort tasks" });
    }
  });

  app.post("/api/ai/plan", requireAuth, async (req, res) => {
    try {
      const userPrompt = typeof req.body?.prompt === "string" ? req.body.prompt : "";
      const plans = await storage.getAllPlans(req.userId!);
      const plan = await aiDailyPlanner(plans, userPrompt);
      res.json({ plan });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate daily plan" });
    }
  });

  return httpServer;
}

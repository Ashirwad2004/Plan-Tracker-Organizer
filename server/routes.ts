import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlanSchema, updatePlanSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getAllPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  app.get("/api/plans/:id", async (req, res) => {
    try {
      const plan = await storage.getPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plan" });
    }
  });

  app.post("/api/plans", async (req, res) => {
    try {
      const parsed = insertPlanSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid plan data", details: parsed.error.errors });
      }
      const plan = await storage.createPlan(parsed.data);
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to create plan" });
    }
  });

  app.patch("/api/plans/:id", async (req, res) => {
    try {
      const parsed = updatePlanSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid plan data", details: parsed.error.errors });
      }
      const plan = await storage.updatePlan(req.params.id, parsed.data);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update plan" });
    }
  });

  app.delete("/api/plans/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePlan(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete plan" });
    }
  });

  return httpServer;
}

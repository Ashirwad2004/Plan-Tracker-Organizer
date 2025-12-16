import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

// Extend Express Session
declare module "express-session" {
  interface SessionData {
    userId?: string;
    username?: string;
  }
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: { id: string; username: string };
    }
  }
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = req.session.userId;
  next();
}

// Register endpoint
export async function register(req: Request, res: Response) {
  try {
    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid user data", details: parsed.error.errors });
    }

    const { username, password } = parsed.data;

    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await storage.createUser({
      username,
      password: hashedPassword,
    });

    // Set session
    req.session!.userId = user.id;
    req.session!.username = user.username;

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
}

// Login endpoint
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/156e0de5-5b0a-41a1-9f61-de7a7e561518", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "server/auth.ts:75",
        message: "Login request body received",
        data: {
          hasBody: !!req.body,
          bodyKeys: req.body ? Object.keys(req.body) : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Find user
    const user = await storage.getUserByUsername(username);

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/156e0de5-5b0a-41a1-9f61-de7a7e561518", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "server/auth.ts:83",
        message: "Result of getUserByUsername in login",
        data: {
          foundUser: !!user,
          userId: user?.id ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/156e0de5-5b0a-41a1-9f61-de7a7e561518", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H3",
        location: "server/auth.ts:90",
        message: "Password comparison result in login",
        data: {
          isValidPassword,
          passwordType: typeof password,
          userPasswordType: typeof user.password,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Set session
    req.session!.userId = user.id;
    req.session!.username = user.username;

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/156e0de5-5b0a-41a1-9f61-de7a7e561518", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H4",
        location: "server/auth.ts:98",
        message: "Login session set successfully",
        data: {
          userId: user.id,
          username: user.username,
          hasSession: !!req.session,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
}

// Logout endpoint
export function logout(req: Request, res: Response) {
  req.session?.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
}

// Get current user endpoint
export async function getCurrentUser(req: Request, res: Response) {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to get current user" });
  }
}


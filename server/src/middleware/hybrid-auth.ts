import { Request, Response, NextFunction } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { env } from "../config/env";

export interface AuthedRequest extends Request {
  auth?: {
    userId: string;
  };
}

// Development middleware that bypasses authentication
function devRequireAuth() {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    // In development, add a mock user ID
    req.auth = {
      userId: "dev-user-123"
    };
    next();
  };
}

// Production middleware using Clerk
const prodRequireAuth = ClerkExpressRequireAuth();

// Hybrid middleware that chooses based on environment
export function hybridRequireAuth() {
  const useDevAuth = process.env.USE_DEV_AUTH === "true";
  
  if (useDevAuth) {
    console.log("🔓 Using development authentication bypass");
    return devRequireAuth();
  } else {
    console.log("🔐 Using Clerk authentication");
    return prodRequireAuth;
  }
}

export function getUserId(req: AuthedRequest): string {
  const userId = req.auth?.userId;
  if (!userId) throw new Error("Unauthenticated");
  return userId;
}

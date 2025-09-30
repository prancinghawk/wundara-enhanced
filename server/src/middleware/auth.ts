import { Request, Response, NextFunction } from "express";
import { clerkMiddleware, requireAuth as clerkRequireAuth } from "@clerk/clerk-sdk-node";

export const requireAuth = clerkRequireAuth();

export interface AuthedRequest extends Request {
  auth?: {
    userId: string;
  };
}

export function getUserId(req: AuthedRequest): string {
  const userId = req.auth?.userId;
  if (!userId) throw new Error("Unauthenticated");
  return userId;
}

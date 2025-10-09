import { Request, Response, NextFunction } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { env } from "../config/env";
import { db } from "../config/db";
import { users } from "./drizzle/schema";
import { eq } from "drizzle-orm";

export interface AuthedRequest extends Request {
  auth?: {
    userId: string;
    sessionClaims?: any;
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

// Middleware to ensure user exists in database after Clerk auth
async function ensureUserInDatabase(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return next();
    }

    // Check if user exists in database
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!existingUser) {
      // Get email from Clerk session claims
      const sessionClaims = req.auth?.sessionClaims;
      const email = sessionClaims?.email || sessionClaims?.primaryEmail || `user-${clerkId}@temp.com`;
      const name = sessionClaims?.name || sessionClaims?.firstName || null;

      console.log('👤 Creating new user in database:', { clerkId, email, name });

      // Create user in database
      await db
        .insert(users)
        .values({
          clerkId,
          email: email as string,
          name: name as string | null,
        });

      console.log('✅ User created in database');
    }

    next();
  } catch (error) {
    console.error('❌ Error ensuring user exists:', error);
    // Don't block the request, just log the error
    next();
  }
}

// Production middleware using Clerk with database sync
function prodRequireAuth() {
  return [ClerkExpressRequireAuth(), ensureUserInDatabase];
}

// Hybrid middleware that chooses based on environment
export function hybridRequireAuth() {
  const useDevAuth = process.env.USE_DEV_AUTH === "true";
  
  if (useDevAuth) {
    console.log("🔓 Using development authentication bypass");
    return devRequireAuth();
  } else {
    console.log("🔐 Using Clerk authentication with database sync");
    return prodRequireAuth();
  }
}

export function getUserId(req: AuthedRequest): string {
  const userId = req.auth?.userId;
  if (!userId) throw new Error("Unauthenticated");
  return userId;
}

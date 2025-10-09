import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Middleware to ensure a user exists in the database
 * Creates a user record if it doesn't exist based on Clerk auth data
 */
export async function ensureUserExists(req: Request, res: Response, next: NextFunction) {
  try {
    // Check if auth data exists (set by Clerk middleware)
    const auth = (req as any).auth;
    if (!auth || !auth.userId) {
      return next();
    }

    const clerkId = auth.userId;
    
    // Check if user exists in database
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!existingUser) {
      // Get email from Clerk session claims
      const email = auth.sessionClaims?.email || auth.sessionClaims?.primaryEmail || `user-${clerkId}@temp.com`;
      const name = auth.sessionClaims?.name || auth.sessionClaims?.firstName || null;

      console.log('👤 Creating new user in database:', { clerkId, email, name });

      // Create user in database
      const [newUser] = await db
        .insert(users)
        .values({
          clerkId,
          email: email as string,
          name: name as string | null,
        })
        .returning();

      console.log('✅ User created with ID:', newUser.id);
    }

    next();
  } catch (error) {
    console.error('❌ Error ensuring user exists:', error);
    // Don't block the request, just log the error
    next();
  }
}

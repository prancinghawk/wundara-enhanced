import { Router } from "express";
import { db } from "../config/db";
import { children } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { hybridRequireAuth, AuthedRequest, getUserId } from "../middleware/hybrid-auth";

export const childrenRouter = Router();

// Create child profile
childrenRouter.post("/", hybridRequireAuth(), async (req: AuthedRequest, res: any) => {
  const userId = getUserId(req);
  const { firstName, ageYears, neurotype, interests, learningContext, state } = req.body ?? {};
  
  console.log('📝 Creating child profile:', {
    userId,
    firstName,
    ageYears,
    neurotype: neurotype?.substring(0, 50),
    interests: interests?.substring(0, 50),
    learningContext,
    state
  });
  
  const [inserted] = await db
    .insert(children)
    .values({ userId, firstName, ageYears, neurotype, interests, learningContext, state })
    .returning();
    
  console.log('✅ Child profile created with ID:', inserted.id);
  res.status(201).json(inserted);
});

// List children for user
childrenRouter.get("/", hybridRequireAuth(), async (req: AuthedRequest, res: any) => {
  const userId = getUserId(req);
  console.log('📋 Fetching children for user:', userId);
  const rows = await db.select().from(children).where(eq(children.userId, userId));
  console.log('✅ Found', rows.length, 'children');
  res.json(rows);
});

// Update child
childrenRouter.put("/:id", hybridRequireAuth(), async (req: AuthedRequest, res: any) => {
  const userId = getUserId(req);
  const id = req.params.id;
  const values = req.body ?? {};
  const updated = await db
    .update(children)
    .set(values)
    .where(eq(children.id, id))
    .returning();
  // Optionally ensure ownership by selecting after update
  res.json(updated[0] ?? null);
});

// Delete child
childrenRouter.delete("/:id", hybridRequireAuth(), async (req: AuthedRequest, res: any) => {
  const id = req.params.id;
  const deleted = await db.delete(children).where(eq(children.id, id)).returning();
  res.json(deleted[0] ?? null);
});

import { Router } from "express";
import { db } from "../config/db";
import { children } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { requireAuth, AuthedRequest, getUserId } from "../middleware/auth";

export const childrenRouter = Router();

// Create child profile
childrenRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  const { firstName, ageYears, neurotype, interests, learningContext, state } = req.body ?? {};
  const [inserted] = await db
    .insert(children)
    .values({ userId, firstName, ageYears, neurotype, interests, learningContext, state })
    .returning();
  res.status(201).json(inserted);
});

// List children for user
childrenRouter.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  const rows = await db.select().from(children).where(eq(children.userId, userId));
  res.json(rows);
});

// Update child
childrenRouter.put("/:id", requireAuth, async (req: AuthedRequest, res) => {
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
childrenRouter.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const deleted = await db.delete(children).where(eq(children.id, id)).returning();
  res.json(deleted[0] ?? null);
});

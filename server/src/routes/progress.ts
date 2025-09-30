import { Router } from "express";
import { db } from "../config/db";
import { planProgress, learningPlans } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { requireAuth, AuthedRequest, getUserId } from "../middleware/auth";

export const progressRouter = Router();

// Record progress for a specific day
progressRouter.post("/:planId/day/:dayIndex", requireAuth, async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  const { planId, dayIndex } = req.params;

  // Optionally verify the user owns the plan (join via child -> user)
  const [plan] = await db.select().from(learningPlans).where(eq(learningPlans.id, planId));
  if (!plan) return res.status(404).json({ error: "Plan not found" });

  const { engagementNotes, evidenceJson } = req.body ?? {};
  const [rec] = await db
    .insert(planProgress)
    .values({ planId, dayIndex: Number(dayIndex), engagementNotes, evidenceJson })
    .returning();
  res.status(201).json(rec);
});

// Get progress entries for a plan
progressRouter.get("/:planId", requireAuth, async (req: AuthedRequest, res) => {
  const { planId } = req.params;
  const rows = await db.select().from(planProgress).where(eq(planProgress.planId, planId));
  res.json(rows);
});

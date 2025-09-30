import { Router } from "express";
import { db } from "../config/db";
import { children, learningPlans } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthedRequest, getUserId } from "../middleware/auth";
import { generateWeeklyPlan } from "../services/ai";

export const plansRouter = Router();

// Generate a plan for a child
plansRouter.post("/generate/:childId", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const userId = getUserId(req);
    const { childId } = req.params;

    const [child] = await db.select().from(children).where(eq(children.id, childId));
    if (!child) return res.status(404).json({ error: "Child not found" });
    if (child.userId !== userId) return res.status(403).json({ error: "Forbidden" });

    const ai = await generateWeeklyPlan({ child: {
      firstName: child.firstName,
      ageYears: child.ageYears,
      neurotype: child.neurotype,
      interests: child.interests,
      learningContext: (child.learningContext as any) ?? "homeschool",
      state: child.state,
    }});

    // Use structured data if available, otherwise fallback to raw content
    const themeTitle = ai.planData?.themeTitle ?? `Weekly Plan for ${child.firstName}`;
    const overview = ai.planData?.overview ?? "AI-generated learning plan";
    const planJson = ai.planData ? { structured: ai.planData, raw: ai.content } : { raw: ai.content };

    const [plan] = await db.insert(learningPlans).values({
      childId: child.id,
      weekOf: new Date(),
      themeTitle,
      overview,
      planJson,
      tags: null,
    }).returning();

    res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
});

// List plans for a child
plansRouter.get("/child/:childId", requireAuth, async (req: AuthedRequest, res) => {
  const userId = getUserId(req);
  const { childId } = req.params;
  // Ensure child belongs to user
  const [child] = await db.select().from(children).where(eq(children.id, childId));
  if (!child || child.userId !== userId) return res.status(404).json({ error: "Not found" });

  const plans = await db.select().from(learningPlans).where(eq(learningPlans.childId, childId));
  res.json(plans);
});

// Get plan by id
plansRouter.get("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const [plan] = await db.select().from(learningPlans).where(eq(learningPlans.id, id));
  if (!plan) return res.status(404).json({ error: "Not found" });
  res.json(plan);
});

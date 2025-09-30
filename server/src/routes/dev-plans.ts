import { Router } from "express";
import { devRequireAuth, AuthedRequest, getUserId } from "../middleware/dev-auth";
import { generateWeeklyPlan } from "../services/ai";
import { db } from "../config/db";
import { children, learningPlans } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const devPlansRouter = Router();

// In-memory storage for mock plans (when database fails)
const mockPlansStorage: any[] = [];

// Generate a plan for a child using real AI but dev auth
devPlansRouter.post("/generate/:childId", devRequireAuth(), async (req: AuthedRequest, res, next) => {
  try {
    const userId = getUserId(req);
    const { childId } = req.params;

    // Try to get child from database first, then check mock children via internal API
    let child;
    try {
      [child] = await db.select().from(children).where(eq(children.id, childId));
    } catch (err) {
      console.log(`Child not found in database, checking mock children: ${childId}`);
    }

    // If not found in database, make internal API call to get mock children
    if (!child) {
      try {
        const response = await fetch(`http://localhost:${process.env.PORT || 3002}/api/children`, {
          headers: { 'Authorization': req.headers.authorization || '' }
        });
        const mockChildren = await response.json();
        child = mockChildren.find((c: any) => c.id === childId);
      } catch (apiErr) {
        console.log('Failed to fetch mock children:', apiErr);
      }
    }

    if (!child) return res.status(404).json({ error: "Child not found" });

    console.log(`🤖 Attempting to generate real AI plan for ${child.firstName}...`);
    let ai;
    try {
      ai = await generateWeeklyPlan({ 
        child: {
          firstName: child.firstName,
          ageYears: child.ageYears,
          neurotype: child.neurotype,
          interests: child.interests,
          learningContext: (child.learningContext as any) ?? "homeschool",
          state: child.state,
        }
      });
      console.log(`✅ Successfully generated AI plan for ${child.firstName}`);
    } catch (aiError: any) {
      console.log(`⚠️ AI generation failed, using fallback mock data:`, aiError?.message || aiError);
      
      // Fallback to mock plan data
      const mockPlan = {
        themeTitle: `Creative Learning Adventures for ${child.firstName}`,
        overview: `A personalized week of learning activities designed around ${child.firstName}'s interests and learning style.`,
        days: [
          {
            dayIndex: 0,
            dayName: "Monday",
            activities: [
              {
                title: "Morning Exploration",
                objective: "Engage curiosity and set learning intentions",
                curriculumCodes: ["ACELY1650", "ACMNA052"],
                materials: ["Notebook", "Colored pencils", "Interest-based materials"],
                instructions: "Start with a discussion about interests and create a learning map",
                declarativeLanguage: "Today we're going to explore amazing things together!",
                modifications: "Provide visual supports and movement breaks as needed",
                estimatedDuration: "45 minutes"
              }
            ]
          }
        ]
      };
      
      ai = { 
        content: JSON.stringify(mockPlan, null, 2), 
        planData: mockPlan 
      };
    }

    // Use structured data if available, otherwise fallback to raw content
    const themeTitle = ai.planData?.themeTitle ?? `Weekly Plan for ${child.firstName}`;
    const overview = ai.planData?.overview ?? "AI-generated learning plan";
    const planJson = ai.planData ? { structured: ai.planData, raw: ai.content } : { raw: ai.content };

    // Try to save to database, but fallback to in-memory if it fails
    let plan;
    try {
      [plan] = await db.insert(learningPlans).values({
        childId: child.id,
        weekOf: new Date().toISOString().split('T')[0],
        themeTitle,
        overview,
        planJson,
        tags: null,
      }).returning();
      console.log(`✅ Plan saved to database with ID: ${plan.id}`);
    } catch (dbErr) {
      console.log(`⚠️ Database save failed, returning plan without persistence:`, dbErr);
      // Generate a proper UUID for the mock plan
      const { randomUUID } = await import('crypto');
      plan = {
        id: randomUUID(),
        childId: child.id,
        weekOf: new Date().toISOString().split('T')[0],
        themeTitle,
        overview,
        planJson,
        tags: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store in memory for later retrieval
      mockPlansStorage.push(plan);
    }

    res.status(201).json(plan);
  } catch (err) {
    console.error("Plan generation error:", err);
    next(err);
  }
});

// List plans for a child
devPlansRouter.get("/child/:childId", devRequireAuth(), async (req: AuthedRequest, res) => {
  try {
    const { childId } = req.params;
    let plans: any[] = [];
    
    // Try to get from database first
    try {
      plans = await db.select().from(learningPlans).where(eq(learningPlans.childId, childId));
    } catch (dbErr) {
      console.log("Database query failed, checking in-memory storage:", dbErr);
      plans = [];
    }
    
    // Add any in-memory plans for this child
    const memoryPlans = mockPlansStorage.filter(plan => plan.childId === childId);
    plans = [...plans, ...memoryPlans];
    
    res.json(plans);
  } catch (err) {
    console.log("Failed to fetch plans:", err);
    res.json([]);
  }
});

// Get plan by id
devPlansRouter.get("/:id", devRequireAuth(), async (req: AuthedRequest, res) => {
  try {
    const { id } = req.params;
    let plan = null;
    
    // Try to get from database first
    try {
      [plan] = await db.select().from(learningPlans).where(eq(learningPlans.id, id));
    } catch (dbErr) {
      console.log("Database query failed, checking in-memory storage:", dbErr);
    }
    
    // If not found in database, check in-memory storage
    if (!plan) {
      plan = mockPlansStorage.find(p => p.id === id);
    }
    
    if (!plan) return res.status(404).json({ error: "Not found" });
    res.json(plan);
  } catch (err) {
    console.log("Failed to fetch plan:", err);
    res.status(404).json({ error: "Not found" });
  }
});

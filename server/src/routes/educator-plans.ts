import express from "express";
import { generateClassroomPlan, GenerateClassroomPlanInput, ClassroomPlan } from "../services/educatorAI";

const router = express.Router();

// In-memory storage for development (replace with database in production)
const classroomPlans: Map<string, ClassroomPlan> = new Map();

// Generate a new classroom plan
router.post("/generate", async (req, res) => {
  try {
    const input: GenerateClassroomPlanInput = req.body;
    
    // Validate required fields
    if (!input.classroomName || !input.educatorName || !input.yearLevel || !input.subject) {
      return res.status(400).json({ 
        error: "Missing required fields: classroomName, educatorName, yearLevel, subject" 
      });
    }

    if (!input.students || input.students.length === 0) {
      return res.status(400).json({ 
        error: "At least one student profile is required" 
      });
    }

    if (!input.learningObjectives || input.learningObjectives.length === 0) {
      return res.status(400).json({ 
        error: "At least one learning objective is required" 
      });
    }

    console.log(`🏫 Generating classroom plan for ${input.classroomName} with ${input.students.length} students`);
    
    const plan = await generateClassroomPlan(input);
    
    // Store the plan
    classroomPlans.set(plan.id, plan);
    
    console.log(`✅ Generated classroom plan ${plan.id}`);
    
    res.json({
      success: true,
      plan: plan
    });

  } catch (error) {
    console.error("Error generating classroom plan:", error);
    res.status(500).json({ 
      error: "Failed to generate classroom plan",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get all classroom plans for an educator
router.get("/educator/:educatorName", (req, res) => {
  try {
    const { educatorName } = req.params;
    
    const educatorPlans = Array.from(classroomPlans.values())
      .filter(plan => plan.educatorName.toLowerCase() === educatorName.toLowerCase())
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
    
    res.json({
      success: true,
      plans: educatorPlans,
      count: educatorPlans.length
    });

  } catch (error) {
    console.error("Error fetching educator plans:", error);
    res.status(500).json({ 
      error: "Failed to fetch educator plans" 
    });
  }
});

// Get a specific classroom plan
router.get("/:planId", (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = classroomPlans.get(planId);
    
    if (!plan) {
      return res.status(404).json({ 
        error: "Classroom plan not found" 
      });
    }
    
    res.json({
      success: true,
      plan: plan
    });

  } catch (error) {
    console.error("Error fetching classroom plan:", error);
    res.status(500).json({ 
      error: "Failed to fetch classroom plan" 
    });
  }
});

// Update a classroom plan
router.put("/:planId", (req, res) => {
  try {
    const { planId } = req.params;
    const updates = req.body;
    
    const existingPlan = classroomPlans.get(planId);
    
    if (!existingPlan) {
      return res.status(404).json({ 
        error: "Classroom plan not found" 
      });
    }
    
    const updatedPlan: ClassroomPlan = {
      ...existingPlan,
      ...updates,
      id: planId, // Ensure ID doesn't change
      generatedAt: existingPlan.generatedAt // Preserve original generation time
    };
    
    classroomPlans.set(planId, updatedPlan);
    
    res.json({
      success: true,
      plan: updatedPlan
    });

  } catch (error) {
    console.error("Error updating classroom plan:", error);
    res.status(500).json({ 
      error: "Failed to update classroom plan" 
    });
  }
});

// Delete a classroom plan
router.delete("/:planId", (req, res) => {
  try {
    const { planId } = req.params;
    
    const deleted = classroomPlans.delete(planId);
    
    if (!deleted) {
      return res.status(404).json({ 
        error: "Classroom plan not found" 
      });
    }
    
    res.json({
      success: true,
      message: "Classroom plan deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting classroom plan:", error);
    res.status(500).json({ 
      error: "Failed to delete classroom plan" 
    });
  }
});

// Get classroom plan statistics
router.get("/stats/overview", (req, res) => {
  try {
    const allPlans = Array.from(classroomPlans.values());
    
    const stats = {
      totalPlans: allPlans.length,
      totalEducators: new Set(allPlans.map(p => p.educatorName)).size,
      totalClassrooms: new Set(allPlans.map(p => p.classroomName)).size,
      subjectBreakdown: allPlans.reduce((acc, plan) => {
        acc[plan.subject] = (acc[plan.subject] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      yearLevelBreakdown: allPlans.reduce((acc, plan) => {
        acc[plan.yearLevel] = (acc[plan.yearLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageActivitiesPerPlan: allPlans.length > 0 
        ? Math.round(allPlans.reduce((sum, plan) => sum + plan.activities.length, 0) / allPlans.length)
        : 0,
      recentActivity: allPlans
        .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
        .slice(0, 5)
        .map(plan => ({
          id: plan.id,
          classroomName: plan.classroomName,
          educatorName: plan.educatorName,
          subject: plan.subject,
          yearLevel: plan.yearLevel,
          generatedAt: plan.generatedAt
        }))
    };
    
    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error("Error fetching classroom plan stats:", error);
    res.status(500).json({ 
      error: "Failed to fetch classroom plan statistics" 
    });
  }
});

export { router as educatorPlansRouter };

import express from "express";
import { generateClassroomPlan, GenerateClassroomPlanInput, ClassroomPlan } from "../services/educatorAI";
import { env } from "../config/env";

const router = express.Router();

// In-memory storage for development (replace with database in production)
const classroomPlans: Map<string, ClassroomPlan> = new Map();
const classroomConfigurations: Map<string, any> = new Map();

// Debug route to check environment configuration
router.get("/debug/env", (req, res) => {
  res.json({
    anthropicConfigured: !!env.ANTHROPIC_API_KEY,
    anthropicKeyLength: env.ANTHROPIC_API_KEY?.length || 0,
    nodeEnv: env.NODE_ENV,
    port: env.PORT
  });
});

// Debug route to check stored configurations
router.get("/debug/storage", (req, res) => {
  const configs = Array.from(classroomConfigurations.values());
  const plans = Array.from(classroomPlans.values());
  
  res.json({
    configurationsCount: configs.length,
    configurations: configs.map(c => ({
      id: c.configId,
      name: c.classroomName,
      educator: c.educatorName,
      students: c.students?.length || 0,
      createdAt: c.createdAt
    })),
    plansCount: plans.length,
    plans: plans.map(p => ({
      id: p.id,
      classroom: p.classroomName,
      educator: p.educatorName
    }))
  });
});

// Save classroom configuration
router.post("/configurations", async (req, res) => {
  try {
    const {
      classroomName,
      educatorName,
      yearLevel,
      state,
      students,
      classroomLayout,
      totalStudents
    } = req.body;

    // Validate required fields
    if (!classroomName || !educatorName || !yearLevel || !state) {
      return res.status(400).json({
        error: "Missing required fields: classroomName, educatorName, yearLevel, state"
      });
    }

    // Generate unique config ID
    const configId = `classroom-config-${Date.now()}`;
    
    // Create classroom configuration object
    const classroomConfig = {
      id: configId,
      configId,
      classroomName,
      educatorName,
      yearLevel,
      state,
      students: students || [],
      classroomLayout: classroomLayout || '',
      totalStudents: totalStudents || students?.length || 0,
      availableResources: ['Books', 'Whiteboard', 'Tablets'], // Default resources
      specialConsiderations: '',
      lastUsed: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      planCount: 0,
      createdAt: new Date().toISOString()
    };

    // Store in memory (TODO: Replace with database when Prisma is set up)
    classroomConfigurations.set(configId, classroomConfig);
    
    console.log(`✅ Saved classroom configuration: ${classroomName} (${configId})`);
    console.log(`📊 Students: ${students?.length || 0}, Layout: ${classroomLayout}`);

    res.json({
      success: true,
      configId,
      message: "Classroom configuration saved successfully",
      classroom: classroomConfig
    });

  } catch (error) {
    console.error("Error saving classroom configuration:", error);
    res.status(500).json({
      error: "Failed to save classroom configuration",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Database storage interface (for when Prisma is set up)
interface DatabaseClassroomPlan {
  id: string;
  classroomName: string;
  educatorName: string;
  yearLevel: string;
  state: string;
  subject: string;
  markdownContent: string;
  metadata: any; // JSON containing structured data
  studentIds: string[];
  lessonDuration: number;
  totalDuration?: number;
  classTheme?: any;
  learningObjectives: string[];
  availableResources: string[];
  classroomLayout?: string;
  specialConsiderations?: string;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Generate a new classroom plan
router.post("/generate", async (req, res) => {
  try {
    console.log('🎯🎯🎯 EDUCATOR PLAN GENERATION REQUEST RECEIVED 🎯🎯🎯');
    console.log('📥 Request body keys:', Object.keys(req.body));
    console.log('📥 Full request body:', JSON.stringify(req.body, null, 2));
    
    const input: GenerateClassroomPlanInput = req.body;
    
    // Validate required fields
    if (!input.classroomName || !input.educatorName || !input.yearLevel || !input.subject) {
      console.error('❌ Missing required fields');
      console.error('  classroomName:', input.classroomName);
      console.error('  educatorName:', input.educatorName);
      console.error('  yearLevel:', input.yearLevel);
      console.error('  subject:', input.subject);
      return res.status(400).json({ 
        error: "Missing required fields: classroomName, educatorName, yearLevel, subject" 
      });
    }

    // Generate representative students if none provided
    if (!input.students || input.students.length === 0) {
      console.log('No detailed student profiles provided, generating representative students');
      // Create representative students based on common classroom demographics
      input.students = [
        {
          id: 'rep-1',
          firstName: 'Student A',
          ageYears: 8,
          neurotype: 'Neurotypical',
          strengths: ['Reading', 'Following instructions'],
          challenges: ['Math concepts'],
          interests: ['Animals', 'Stories'],
          sensoryNeeds: ['Standard classroom environment'],
          communicationStyle: 'Verbal',
          learningPreferences: ['Visual', 'Auditory'],
          accommodations: ['Clear instructions']
        },
        {
          id: 'rep-2',
          firstName: 'Student B',
          ageYears: 8,
          neurotype: 'ADHD',
          strengths: ['Creative thinking', 'Hands-on activities'],
          challenges: ['Sustained attention', 'Organization'],
          interests: ['Building', 'Movement'],
          sensoryNeeds: ['Movement breaks', 'Fidget tools'],
          communicationStyle: 'Verbal with visual supports',
          learningPreferences: ['Kinesthetic', 'Visual'],
          accommodations: ['Movement breaks', 'Clear structure']
        },
        {
          id: 'rep-3',
          firstName: 'Student C',
          ageYears: 8,
          neurotype: 'Autism',
          strengths: ['Detail-oriented', 'Pattern recognition'],
          challenges: ['Social interaction', 'Transitions'],
          interests: ['Patterns', 'Specific topics'],
          sensoryNeeds: ['Quiet spaces', 'Predictable routine'],
          communicationStyle: 'Visual supports preferred',
          learningPreferences: ['Visual', 'Structured'],
          accommodations: ['Visual schedule', 'Quiet space access']
        }
      ];
    }

    if (!input.learningObjectives || input.learningObjectives.length === 0) {
      return res.status(400).json({ 
        error: "At least one learning objective is required" 
      });
    }

    console.log(`🏫 Generating classroom plan for ${input.classroomName} with ${input.students.length} students`);
    console.log('📋 Input data:', JSON.stringify(input, null, 2));
    
    let result;
    try {
      result = await generateClassroomPlan(input);
    } catch (error) {
      console.error('❌ Error in generateClassroomPlan:', error);
      return res.status(500).json({
        error: "Failed to generate classroom plan",
        details: error instanceof Error ? error.message : 'Unknown error in plan generation'
      });
    }
    
    if (!result.success) {
      console.error('❌ Plan generation failed:', result.error);
      return res.status(500).json({
        error: "Failed to generate classroom plan",
        details: result.error
      });
    }
    
    const plan = result.plan;
    
    // Store the plan (in-memory for now, database later)
    classroomPlans.set(plan.id, plan);
    
    // Prepare structured data for database storage
    const databasePlan: Partial<DatabaseClassroomPlan> = {
      id: plan.id,
      classroomName: input.classroomName,
      educatorName: input.educatorName,
      yearLevel: input.yearLevel,
      state: input.state || 'NSW',
      subject: input.subject,
      markdownContent: plan.markdownContent || '',
      metadata: {
        days: plan.days,
        weekOverview: plan.weekOverview,
        classTheme: plan.classTheme,
        themeTitle: plan.themeTitle,
        overview: plan.overview
      },
      studentIds: input.students?.map((s: any) => s.id) || [],
      lessonDuration: input.lessonDuration,
      totalDuration: plan.totalDuration,
      classTheme: plan.classTheme,
      learningObjectives: input.learningObjectives || [],
      availableResources: input.availableResources || [],
      classroomLayout: input.classroomLayout,
      specialConsiderations: input.specialConsiderations,
      generatedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // TODO: When Prisma is set up, replace with:
    // await prisma.classroomPlan.create({ data: databasePlan });
    console.log('📊 Database plan structure prepared:', {
      id: databasePlan.id,
      markdownSize: databasePlan.markdownContent?.length,
      daysCount: databasePlan.metadata?.days?.length,
      studentsCount: databasePlan.studentIds?.length
    });
    
    // Store the classroom configuration for future use
    const classroomConfigId = `${input.educatorName}-${input.classroomName}`.toLowerCase().replace(/\s+/g, '-');
    const classroomConfig = {
      id: classroomConfigId,
      configId: classroomConfigId,
      classroomName: input.classroomName,
      educatorName: input.educatorName,
      yearLevel: input.yearLevel,
      state: input.state || 'NSW',
      students: input.students || [],
      availableResources: input.availableResources || [],
      classroomLayout: input.classroomLayout || '',
      specialConsiderations: input.specialConsiderations || '',
      lastUsed: new Date(),
      planCount: 1,
      lastUpdated: new Date().toISOString()
    };
    classroomConfigurations.set(classroomConfigId, classroomConfig);
    
    // TODO: When Prisma is set up, replace with:
    // await prisma.classroomConfiguration.upsert({
    //   where: { configId: classroomConfigId },
    //   update: { lastUsed: new Date(), planCount: { increment: 1 } },
    //   create: classroomConfig
    // });
    
    console.log(`✅ Generated classroom plan ${plan.id} and saved configuration ${classroomConfigId}`);
    
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

// Get all classroom configurations for the current user (MUST come before /:planId)
router.get("/configurations", async (req, res) => {
  try {
    // TODO: Filter by authenticated user ID when auth is implemented
    // For now, return all configurations
    const configs = Array.from(classroomConfigurations.values())
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    
    console.log(`📋 Found ${configs.length} classroom configurations`);
    console.log('📊 All configurations:', configs.map(c => ({ 
      id: c.configId, 
      name: c.classroomName, 
      educator: c.educatorName,
      students: c.students?.length || 0
    })));
    
    res.json({
      success: true,
      configurations: configs
    });
  } catch (error) {
    console.error("Error fetching classroom configurations:", error);
    res.status(500).json({ 
      error: "Failed to fetch classroom configurations" 
    });
  }
});

// Get all classroom configurations for an educator (legacy endpoint)
router.get("/configurations/:educatorName", async (req, res) => {
  try {
    const { educatorName } = req.params;
    
    const configs = Array.from(classroomConfigurations.values())
      .filter(config => config.educatorName === educatorName)
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    
    console.log(`📋 Found ${configs.length} classroom configurations for ${educatorName}`);
    
    res.json({
      success: true,
      configurations: configs
    });
  } catch (error) {
    console.error("Error fetching classroom configurations:", error);
    res.status(500).json({ 
      error: "Failed to fetch classroom configurations" 
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

// Get a specific classroom plan (MUST come after specific routes)
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


// Get all classroom plans for an educator
router.get("/educator/:educatorName", (req, res) => {
  try {
    const { educatorName } = req.params;
    
    const plans = Array.from(classroomPlans.values())
      .filter(plan => plan.educatorName === educatorName)
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
    
    console.log(`Found ${plans.length} classroom plans for ${educatorName}`);
    
    res.json({
      success: true,
      plans: plans
    });
  } catch (error) {
    console.error("Error fetching classroom plans:", error);
    res.status(500).json({ 
      error: "Failed to fetch classroom plans" 
    });
  }
});

// Get a specific classroom plan (must come after specific routes)
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
    console.error("Error fetching classroom configuration:", error);
    res.status(500).json({ 
      error: "Failed to fetch classroom configuration" 
    });
  }
});

// Update a classroom configuration
router.put("/classroom/:configId", (req, res) => {
  try {
    const { configId } = req.params;
    const updatedConfig = req.body;
    
    if (!classroomConfigurations.has(configId)) {
      return res.status(404).json({
        error: "Classroom configuration not found"
      });
    }

    // Update the configuration
    const config = {
      ...updatedConfig,
      id: configId,
      lastUpdated: new Date().toISOString()
    };
    
    classroomConfigurations.set(configId, config);
    
    console.log(`✅ Updated classroom configuration ${configId}`);
    
    res.json({
      success: true,
      classroom: config
    });

  } catch (error) {
    console.error("Error updating classroom configuration:", error);
    res.status(500).json({ 
      error: "Failed to update classroom configuration" 
    });
  }
});

// Delete a classroom configuration
router.delete("/classroom/:configId", (req, res) => {
  try {
    const { configId } = req.params;
    
    if (!classroomConfigurations.has(configId)) {
      return res.status(404).json({
        error: "Classroom configuration not found"
      });
    }

    classroomConfigurations.delete(configId);
    
    console.log(`✅ Deleted classroom configuration ${configId}`);
    
    res.json({
      success: true,
      message: "Classroom configuration deleted"
    });

  } catch (error) {
    console.error("Error deleting classroom configuration:", error);
    res.status(500).json({ 
      error: "Failed to delete classroom configuration" 
    });
  }
});

export { router as educatorPlansRouter };

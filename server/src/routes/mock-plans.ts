import { Router } from "express";
import { devRequireAuth, AuthedRequest, getUserId } from "../middleware/dev-auth";
import { generateWeeklyPlan } from "../services/ai";

export const mockPlansRouter = Router();

// Mock plans storage
const mockPlans: any[] = [];

// Generate a plan for a child
mockPlansRouter.post("/generate/:childId", devRequireAuth(), async (req: AuthedRequest, res, next) => {
  try {
    const userId = getUserId(req);
    const { childId } = req.params;

    // Mock child data for the specified childId
    const mockChild = {
      id: childId,
      firstName: childId === "child-1" ? "Emma" : "Alex",
      ageYears: childId === "child-1" ? 8 : 10,
      neurotype: childId === "child-1" ? "ADHD" : "Autistic",
      interests: childId === "child-1" ? "dinosaurs, art, music" : "space, robots, coding",
      learningContext: "homeschool" as const,
      state: childId === "child-1" ? "NSW" : "VIC"
    };

    let ai;
    let themeTitle;
    let overview;
    let planJson;

    try {
      // Try to generate plan using AI service
      console.log(`🤖 Attempting to generate AI plan for ${mockChild.firstName}...`);
      ai = await generateWeeklyPlan({ 
        child: mockChild
      });

      // Use structured data if available, otherwise fallback to raw content
      themeTitle = ai.planData?.themeTitle ?? `Weekly Plan for ${mockChild.firstName}`;
      overview = ai.planData?.overview ?? "AI-generated learning plan";
      planJson = ai.planData ? { structured: ai.planData, raw: ai.content } : { raw: ai.content };
      
      console.log(`✅ Successfully generated AI plan: "${themeTitle}"`);
    } catch (aiError: any) {
      console.log(`⚠️ AI generation failed, using fallback mock data:`, aiError?.message || aiError);
      
      // Fallback to comprehensive mock plan data
      const mockPlanTemplates = {
        "child-1": {
          themeTitle: "Outback Content Creator's Kitchen: Cooking Up Stories from the Red Centre",
          overview: "What an incredible combination of creative talents Emma has! Their love for cooking, crafting, TikTok, and all things Australian Outback creates the perfect recipe for a week of storytelling through food and digital creativity.",
          days: [
            {
              dayIndex: 0,
              dayName: "Monday",
              activities: [
                {
                  title: "Damper Bread Discovery",
                  objective: "Learn about Australian bush tucker and basic cooking measurements",
                  curriculumCodes: ["AC9MFN03", "AC9HSFK01"],
                  materials: ["Self-raising flour", "Salt", "Water", "Mixing bowl", "Camera/phone"],
                  instructions: "1. Research damper bread history\n2. Measure ingredients using fractions\n3. Mix and knead dough\n4. Film the process for TikTok\n5. Bake and taste test",
                  declarativeLanguage: "I notice you're really focused on getting the measurements just right - that attention to detail will make amazing content!",
                  modifications: "Allow flexible timing, provide visual measurement guides, offer sensory breaks",
                  estimatedDuration: "45-60 minutes"
                }
              ]
            },
            {
              dayIndex: 1,
              dayName: "Tuesday", 
              activities: [
                {
                  title: "Outback Storytelling Through Art",
                  objective: "Create visual narratives about Australian history and geography",
                  curriculumCodes: ["AC9HSFK02", "AC9AVAFE01"],
                  materials: ["Art supplies", "Maps of Australia", "Reference images"],
                  instructions: "1. Choose an Outback location\n2. Research its history and significance\n3. Create artwork depicting the landscape\n4. Write a short story or caption\n5. Plan how to share this story",
                  declarativeLanguage: "Your creative mind is making such interesting connections between places and stories!",
                  modifications: "Offer choice of art mediums, allow movement breaks, provide quiet workspace",
                  estimatedDuration: "60-75 minutes"
                }
              ]
            }
          ]
        },
        "child-2": {
          themeTitle: "Space Station Engineering: Building Tomorrow's Technology",
          overview: "Alex's fascination with space, robots, and coding comes together in this exciting week of engineering challenges and digital creation.",
          days: [
            {
              dayIndex: 0,
              dayName: "Monday",
              activities: [
                {
                  title: "Robot Design Challenge",
                  objective: "Apply engineering principles to design a space exploration robot",
                  curriculumCodes: ["AC9TDE2K01", "AC9MFN05"],
                  materials: ["Building blocks/LEGO", "Paper", "Pencils", "Measuring tools"],
                  instructions: "1. Research current Mars rovers\n2. Design your own space robot\n3. Build a prototype\n4. Test and modify design\n5. Document the engineering process",
                  declarativeLanguage: "I can see you're thinking deeply about how each part of your robot will work - that's exactly what engineers do!",
                  modifications: "Provide structured planning sheets, allow for hyperfocus time, offer fidget tools",
                  estimatedDuration: "90-120 minutes"
                }
              ]
            }
          ]
        }
      };
      
      const childKey = childId as keyof typeof mockPlanTemplates;
      const mockPlan = mockPlanTemplates[childKey] || mockPlanTemplates["child-1"];
      
      themeTitle = mockPlan.themeTitle;
      overview = mockPlan.overview;
      planJson = { structured: mockPlan, raw: JSON.stringify(mockPlan, null, 2) };
    }

    const plan = {
      id: `plan-${Date.now()}`,
      childId: mockChild.id,
      weekOf: new Date().toISOString().split('T')[0],
      themeTitle,
      overview,
      planJson,
      tags: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockPlans.push(plan);
    res.status(201).json(plan);
  } catch (err) {
    console.error("Plan generation error:", err);
    // Return a comprehensive mock plan if AI generation fails
    const mockPlanTemplates = {
      "child-1": {
        themeTitle: "Outback Content Creator's Kitchen: Cooking Up Stories from the Red Centre",
        overview: "What an incredible combination of creative talents Ariah has! Their love for cooking, crafting, TikTok, and all things Australian Outback creates the perfect recipe for a week of storytelling through food and digital creativity.",
        subjects: ["Math", "Arts", "History"],
        duration: "5 days",
        location: "Australian Outback",
        pathways: [
          {
            id: "low-demand",
            title: "Low Demand Path",
            subtitle: "PDA-friendly, high autonomy",
            color: "green",
            stepCount: 4,
            setupRequired: {
              duration: "10 mins",
              description: "Arrange ingredients on counter, child chooses filming spot, no pressure to follow recipe exactly."
            },
            steps: [
              {
                id: "step1",
                title: "'I'm curious what you think damper needs' - let them explore ingredients",
                description: "Allow natural exploration without pressure"
              },
              {
                id: "step2", 
                title: "Film whatever feels natural - even just mixing",
                description: "No structured filming requirements"
              },
              {
                id: "step3",
                title: "Shape dough however they like", 
                description: "Complete autonomy over the process"
              },
              {
                id: "step4",
                title: "Chat about what Outback travelers might have felt",
                description: "Natural conversation without formal questions"
              }
            ],
            wrapUp: {
              title: "Wrap-Up",
              description: "Leave dough to rest while they decide next steps"
            }
          },
          {
            id: "moderate-structure",
            title: "Moderate Structure Path", 
            subtitle: "Shared control, balanced approach",
            color: "yellow",
            stepCount: 5,
            setupRequired: {
              duration: "15 mins",
              description: "Set up 'camp kitchen' together, discuss what makes good cooking content."
            },
            steps: [
              {
                id: "step1",
                title: "Measure ingredients together, talking through fractions",
                description: "Collaborative measuring with math concepts"
              },
              {
                id: "step2",
                title: "Create simple TikTok-style intro about bush tucker",
                description: "Structured but creative content creation"
              },
              {
                id: "step3",
                title: "Mix dough while sharing Outback facts",
                description: "Combine physical activity with learning"
              },
              {
                id: "step4",
                title: "Shape into traditional round loaf",
                description: "Follow traditional methods"
              },
              {
                id: "step5",
                title: "Film taste-test reaction",
                description: "Structured content creation"
              }
            ],
            wrapUp: {
              title: "Wrap-Up", 
              description: "Plan tomorrow's content while damper bakes"
            }
          },
          {
            id: "high-engagement",
            title: "High Engagement Path",
            subtitle: "Child-directed, open exploration", 
            color: "blue",
            stepCount: 5,
            setupRequired: {
              duration: "20 mins",
              description: "Full 'Outback cooking show' setup with multiple camera angles."
            },
            steps: [
              {
                id: "step1",
                title: "Research bush tucker ingredients and create ingredient introduction",
                description: "Deep dive into Australian food history"
              },
              {
                id: "step2",
                title: "Film step-by-step tutorial with commentary", 
                description: "Create comprehensive cooking content"
              },
              {
                id: "step3",
                title: "Demonstrate fraction concepts while measuring",
                description: "Integrate mathematical learning"
              },
              {
                id: "step4",
                title: "Create multiple content pieces - recipe, history, taste test",
                description: "Multi-format content creation"
              },
              {
                id: "step5",
                title: "Edit simple video compilation",
                description: "Post-production skills"
              }
            ],
            wrapUp: {
              title: "Wrap-Up",
              description: "Share with family 'audience' and gather feedback"
            }
          }
        ]
      },
      "child-2": {
        themeTitle: "Transforming Dino Island: A Lego-Transformer-Wheels Adventure with Squishy Surprises", 
        overview: "What an incredible combination of interests Ted has! This plan celebrates how his brilliant autistic mind connects with building, transforming, racing, and sensory exploration.",
        subjects: ["Math", "Science", "English/Literacy"],
        duration: "5 days",
        location: "K-Pop Demon Hunter Realms",
        pathways: []
      }
    };
    
    const childKey = req.params.childId as keyof typeof mockPlanTemplates;
    const planTemplate = mockPlanTemplates[childKey] || mockPlanTemplates["child-1"];
    
    const mockPlan = {
      id: `plan-${Date.now()}`,
      childId: req.params.childId,
      weekOf: new Date().toISOString().split('T')[0],
      themeTitle: planTemplate.themeTitle,
      overview: planTemplate.overview,
      planJson: {
        structured: {
          themeTitle: planTemplate.themeTitle,
          overview: planTemplate.overview,
          subjects: planTemplate.subjects,
          duration: planTemplate.duration,
          location: planTemplate.location,
          pathways: planTemplate.pathways || [],
          days: [
            {
              dayIndex: 0,
              dayName: "Monday", 
              activities: [
                {
                  title: "Setting Up the Adventure",
                  objective: "Establish the learning environment and introduce key concepts",
                  curriculumCodes: ["AC9HSFK01", "AC9EFLA01"],
                  materials: ["Building blocks", "Art supplies", "Sensory materials"],
                  instructions: "Create the base environment using favorite materials. Discuss the adventure theme and let interests guide the setup.",
                  declarativeLanguage: "You are the architect of this amazing world! Your ideas and creativity are what make this special.",
                  modifications: "Provide visual schedules, allow movement breaks, offer choice in materials and pacing",
                  estimatedDuration: "45 minutes"
                }
              ]
            }
          ]
        },
        raw: "Mock plan content for testing purposes"
      },
      tags: planTemplate.subjects?.join(", ") || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockPlans.push(mockPlan);
    res.status(201).json(mockPlan);
  }
});

// List plans for a child
mockPlansRouter.get("/child/:childId", devRequireAuth(), async (req: AuthedRequest, res) => {
  const { childId } = req.params;
  const childPlans = mockPlans.filter(plan => plan.childId === childId);
  res.json(childPlans);
});

// Get plan by id
mockPlansRouter.get("/:id", devRequireAuth(), async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const plan = mockPlans.find(plan => plan.id === id);
  if (!plan) return res.status(404).json({ error: "Not found" });
  res.json(plan);
});

import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env";

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export interface GeneratePlanInput {
  child: {
    firstName: string;
    ageYears?: number | null;
    neurotype?: string | null;
    interests?: string | null;
    learningContext?: "homeschool" | "classroom" | null;
    state?: string | null;
  };
}

export interface WeeklyPlanStructure {
  themeTitle: string;
  overview: string;
  days: Array<{
    dayIndex: number;
    dayName: string;
    activities: Array<{
      title: string;
      objective: string;
      curriculumCodes: string[];
      materials: string[];
      instructions: string;
      declarativeLanguage?: string;
      modifications?: string;
      estimatedDuration: string;
    }>;
  }>;
}

export async function generateWeeklyPlan(input: GeneratePlanInput) {
  const { child } = input;
  const system = `You are Wundara — a deeply empathetic educational companion who creates personalised learning plans for neurodivergent children. 

You must respond with ONLY a valid JSON object that follows this exact structure:
{
  "themeTitle": "A creative, engaging theme that incorporates the child's interests",
  "overview": "A brief overview of the week's learning journey",
  "days": [
    {
      "dayIndex": 0,
      "dayName": "Monday",
      "activities": [
        {
          "title": "Activity name",
          "objective": "Clear learning objective",
          "curriculumCodes": ["AC9 format curriculum codes (e.g., AC9EFLA01, AC9MFN03)"],
          "materials": ["List of materials needed"],
          "instructions": "Step-by-step instructions",
          "declarativeLanguage": "Neurodiversity-affirming language suggestions",
          "modifications": "Adaptations for different learning needs",
          "estimatedDuration": "30-45 minutes"
        }
      ]
    }
  ]
}

Guidelines:
- Create 5 days (Monday-Friday) with 2-3 activities per day
- Align with Australian Curriculum (ACARA codes)
- Incorporate the child's interests naturally
- Use neurodiversity-affirming approaches
- Provide clear, step-by-step instructions
- Include sensory considerations and modifications
- Ensure activities are age-appropriate and engaging`;

  const userPrompt = `Create a 5-day learning plan for:
Child: ${child.firstName}, age ${child.ageYears ?? "n/a"}
Neurotype: ${child.neurotype ?? "n/a"}
Interests: ${child.interests ?? "n/a"}
Context: ${child.learningContext ?? "homeschool"}
State: ${child.state ?? "NSW"}

Focus on creating an engaging, inclusive learning experience that celebrates neurodiversity.`;

  const resp = await anthropic.messages.create({
    model: env.ANTHROPIC_MODEL,
    system,
    max_tokens: 4000,
    temperature: 0.7,
    messages: [
      { role: "user", content: userPrompt }
    ],
  });

  // Extract text output
  const content = resp.content?.map((c: any) => (c.type === "text" ? c.text : "")).join("\n") ?? "";
  
  try {
    // Try to parse as JSON
    const planData = JSON.parse(content) as WeeklyPlanStructure;
    return { content, planData };
  } catch (error) {
    // Fallback to text content
    return { content, planData: null };
  }
}

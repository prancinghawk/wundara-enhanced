import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env";

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export interface PlanContext {
  learningTheme?: string;
  focusAreas: string[];
  materialAccess: string[];
  learningStyles: string[];
  energyLevel: string;
  specialNotes?: string;
}

export interface GeneratePlanInput {
  child: {
    firstName: string;
    ageYears?: number;
    neurotype?: string;
    interests?: string;
    learningContext?: "homeschool" | "classroom" | null;
    state?: string | null;
  };
  context?: PlanContext;
}

export interface WeeklyPlanStructure {
  themeTitle: string;
  overview: string;
  days: Array<{
    dayIndex: number;
    activities: Array<{
      title: string;
      objective: string;
      curriculumCodes: string[];
      materials: string[];
      instructions: string;
      adultSupport?: {
        emotionalPreparation: string;
        coRegulationStrategy: string;
        troubleshooting: string;
        successReframing: string;
      };
      declarativeLanguage?: string;
      modifications?: string;
      estimatedDuration: string;
    }>;
  }>;
}

export async function generateWeeklyPlan(input: GeneratePlanInput) {
  const { child, context } = input;
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
          "declarativeLanguage": "Specific declarative language phrases for this activity (noticing, wondering, offering information - avoid commands)",
          "modifications": "Adaptations for different learning needs",
          "estimatedDuration": "30-45 minutes"
        }
      ]
    }
  ]
}

Guidelines:
- Create 5 days (Monday-Friday) with 1-2 activities per day (keep concise)
- Align with Australian Curriculum (ACARA codes)
- Incorporate the child's interests naturally
- Use neurodiversity-affirming approaches
- Keep instructions brief but clear
- Include sensory considerations and modifications
- Ensure activities are age-appropriate and engaging

Declarative Language Requirements:
- Use "I notice..." "I wonder..." "I see..." statements
- Offer information rather than commands ("There are different ways to...")
- Validate the child's process ("You're taking time to think")
- Avoid imperatives like "Do this" or "You should"
- Support self-regulation through connection, not control
- Acknowledge neurodivergent strengths and differences positively`;

  // Build contextual prompt based on user inputs
  let contextualPrompt = `Create a 5-day learning plan for:
Child: ${child.firstName}, age ${child.ageYears ?? "n/a"}
Neurotype: ${child.neurotype ?? "n/a"}
Interests: ${child.interests ?? "n/a"}
Context: ${child.learningContext ?? "homeschool"}
State: ${child.state ?? "NSW"}`;

  if (context) {
    contextualPrompt += `

PLAN CUSTOMIZATION:
- Theme: ${context.learningTheme || 'Based on child\'s interests'}
- Focus Areas: ${context.focusAreas.join(', ') || 'Balanced curriculum'}
- Material Access: ${context.materialAccess.join(', ')}
- Learning Styles: ${context.learningStyles.join(', ') || 'Multi-modal'}
- Energy Level: ${context.energyLevel}
- Special Notes: ${context.specialNotes || 'None'}`;
  }

  const userPrompt = contextualPrompt + `

Focus on creating an engaging, inclusive learning experience that celebrates neurodiversity.

CRITICAL REQUIREMENTS:
- Generate instructions tailored to the specified energy level (${context?.energyLevel || 'moderate'})
- EVERY activity MUST include "adultSupport" with all 4 fields
- Align with specified focus areas and material access
- Incorporate specified learning styles
- Adult Support: specific to activity and child's neurotype
- Keep all text concise but meaningful
- Generate complete valid JSON only`;

  console.log('🔍 Using enhanced AI prompt with pathway-specific instructions...');
  console.log('📝 System prompt length:', system.length);
  
  const resp = await anthropic.messages.create({
    model: env.ANTHROPIC_MODEL,
    system,
    max_tokens: 4096,
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
    console.log('✅ Successfully parsed AI response as structured data');
    console.log('📊 Plan has', planData.days?.length || 0, 'days');
    console.log('🧑‍🏫 First activity has adult support:', !!planData.days?.[0]?.activities?.[0]?.adultSupport);
    return { content, planData };
  } catch (error) {
    console.log('⚠️ Failed to parse AI response as JSON:', error);
    console.log('📄 Raw content length:', content.length);
    console.log('🔍 Last 500 chars of AI response:');
    console.log(content.slice(-500));
    // Fallback to text content
    return { content, planData: null };
  }
}

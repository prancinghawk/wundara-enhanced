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
  const system = `You are Wundara — a deeply empathetic educational companion who creates personalised learning plans for neurodivergent children. Your primary mission is to support overwhelmed families by transforming each child's unique interests into joyful, accessible learning experiences.

## Core Identity
You are speaking to parents, carers, tutors, and therapists supporting children with Autism, ADHD, PDA, dyslexia, dyspraxia, anxiety, and other neurodiverse profiles across Australia. These families often feel exhausted and anxious, seeking validation that they're doing enough for their child. Many neurodivergent children have experienced educational trauma or failure.

## Communication Style
Your voice is warm, encouraging, and genuinely enthusiastic - like talking to a trusted friend who truly "gets it." You lead with emotional attunement by:
- Acknowledging what you hear: the love, concern, and hope behind requests
- Validating children's interests, no matter how intense or unusual
- Normalizing challenges families face
- Speaking with practical hope that acknowledges difficulties while offering concrete solutions

You avoid clinical language, deficit-focused descriptions, or overwhelming families with too many options. Instead, you use connecting phrases like:
- "I can hear how much you care about making learning work for them"
- "What a clever mind to be so fascinated by [interest]"
- "That's a lot to navigate, and you're clearly doing your best"

## Educational Philosophy
Your approach is strength-based, trauma-informed, and neurodiversity-affirming, drawing from:
- Ross Greene's collaborative problem-solving
- Casey Ehrlich's PDA-informed approaches
- Declarative Language principles (commenting vs. demanding)
- Interest-led and play-based learning
- Emotional safety as the foundation for all learning

## Core Principles
- Every child's passions are the gateway to growth
- Different brains are valuable, not broken
- Learning happens when children feel safe and valued
- Parents need empowerment, not judgment
- Demand-awareness is crucial, especially for PDA profiles
- Relationship matters more than curriculum completion

## JSON OUTPUT REQUIREMENTS
You must respond with ONLY a valid JSON object that follows this exact structure:
{
  "themeTitle": "Creative title directly inspired by child's interests with engaging subtitle",
  "overview": "Empathetic overview acknowledging child's strengths and family context",
  "days": [
    {
      "dayIndex": 0,
      "dayName": "Monday",
      "activities": [
        {
          "title": "Activity name that honors child's interests",
          "objective": "Learning objective with Australian Curriculum code",
          "curriculumCodes": ["AC9 format codes (e.g., AC9EFLA01, AC9MFN03)"],
          "materials": ["Realistic materials with sensory considerations"],
          "instructions": "Clear, numbered steps honoring child's autonomy and interests",
          "adultSupport": {
            "emotionalPreparation": "What to expect and why behaviors are normal for this neurotype",
            "coRegulationStrategy": "How adults can stay regulated and supportive",
            "troubleshooting": "Alternative approaches when plans aren't working",
            "successReframing": "What progress looks like for this child's neurotype"
          },
          "declarativeLanguage": "7+ supportive phrases using 'I notice/wonder/see' language",
          "modifications": "Neurotype-specific adaptations and demand reduction strategies",
          "estimatedDuration": "Flexible time range (e.g., 15-45 minutes)"
        }
      ]
    }
  ]
}

## CRITICAL FIELD REQUIREMENTS

### INSTRUCTIONS Field:
- Clear, numbered steps that honor child's autonomy
- Specific to child's interests and neurotype
- Include concrete, achievable actions
- Offer choices and flexibility within structure
- Example: "1. Choose your favorite [interest] materials, 2. Arrange them in a way that feels right to you, 3. Explore connections between..."

### ADULT SUPPORT Field (REQUIRED):
- **emotionalPreparation**: Normalize expected behaviors for this neurotype
- **coRegulationStrategy**: How adults can stay calm and supportive
- **troubleshooting**: What to do when things don't go as planned
- **successReframing**: Redefine success for neurodivergent learners

### DECLARATIVE LANGUAGE Field:
- 7+ supportive phrases using observational language
- "I notice...", "I wonder...", "I see...", "Your mind is..."
- Avoid commands, focus on connection over compliance
- Validate the child's unique way of thinking and being

### MODIFICATIONS Field:
- Specific supports for mentioned neurotype (Autism/ADHD/PDA/etc.)
- Sensory accommodations and environmental considerations
- Demand reduction strategies, especially for PDA profiles
- Multiple pathways for different energy levels

## Quality Assurance
Ensure every plan:
- Honors child's dignity and unique way of being
- Reduces rather than increases family stress
- Provides sufficient flexibility for real-life implementation
- Focuses on strengths rather than deficits
- Helps parents feel more confident and hopeful
- Creates opportunities for connection and joy

## Neurotype-Specific Considerations
- **AUTISM/PDA**: Demand reduction, autonomy builders, sensory accommodations, predictability with flexibility
- **ADHD**: Movement integration, attention regulation, executive function scaffolds, novelty balance
- **AUDHD**: Balance routine with novelty, manage conflicting sensory needs
- **DYSLEXIA**: Multi-sensory approaches, text alternatives, confidence builders
- **DYSPRAXIA**: Motor alternatives, sequencing supports, spatial awareness
- **ANXIETY**: Predictability, choice/control, gradual exposure, calm strategies

Remember: Relationship and emotional safety always come before academic outcomes.`;

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

  console.log('🔍 Using comprehensive empathetic AI prompt...');
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

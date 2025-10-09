import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { curriculumContextService } from './curriculumContext';
import { parseMarkdownPlan } from './markdownParser';

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export interface ClassroomStudent {
  id: string;
  firstName: string;
  ageYears: number;
  neurotype: string;
  strengths: string[];
  challenges: string[];
  interests: string[];
  sensoryNeeds: string[];
  communicationStyle: string;
  learningPreferences: string[];
  accommodations: string[];
}

export interface ClassroomPlanRequest {
  classroomName: string;
  educatorName: string;
  yearLevel: string;
  state: string;
  subject: string;
  lessonDuration: number;
  students: ClassroomStudent[];
  learningObjectives: string[];
  availableResources: string[];
  classroomLayout: string;
  specialConsiderations: string;
}

// Type aliases for route compatibility
export type GenerateClassroomPlanInput = ClassroomPlanRequest;
export interface ClassroomPlan {
  id: string;
  classroomName: string;
  educatorName: string;
  yearLevel: string;
  state: string;
  subject: string;
  [key: string]: any;
}


// Helper function to find common interests and create a unifying theme
function generateClassTheme(students: ClassroomStudent[]): { theme: string; rationale: string; connections: string[] } {
  // Collect all interests
  const allInterests = students.flatMap(student => student.interests);
  const interestCounts = allInterests.reduce((acc, interest) => {
    acc[interest.toLowerCase()] = (acc[interest.toLowerCase()] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Find most common interests
  const sortedInterests = Object.entries(interestCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Create thematic connections
  const topInterests = sortedInterests.map(([interest]) => interest);
  
  // Generate a unifying theme based on common interests
  let theme = "Exploring Our World";
  let rationale = "A broad theme that can incorporate diverse interests";
  let connections: string[] = [];

  if (topInterests.some(interest => ['animals', 'dinosaurs', 'pets', 'wildlife'].includes(interest))) {
    theme = "Amazing Animals and Creatures";
    rationale = "Many students show interest in animals, dinosaurs, and living creatures";
    connections = students.map(student => {
      const animalInterests = student.interests.filter(interest => 
        ['animals', 'dinosaurs', 'pets', 'wildlife', 'insects', 'birds'].some(animal => 
          interest.toLowerCase().includes(animal)
        )
      );
      if (animalInterests.length > 0) {
        return `${student.firstName} loves ${animalInterests.join(', ')}`;
      }
      return `${student.firstName} can explore animals through ${student.interests[0] || 'creative activities'}`;
    });
  } else if (topInterests.some(interest => ['art', 'drawing', 'crafts', 'building', 'creating'].includes(interest))) {
    theme = "Creative Builders and Artists";
    rationale = "Multiple students enjoy creative and constructive activities";
    connections = students.map(student => {
      const creativeInterests = student.interests.filter(interest => 
        ['art', 'drawing', 'crafts', 'building', 'creating', 'painting', 'making'].some(creative => 
          interest.toLowerCase().includes(creative)
        )
      );
      if (creativeInterests.length > 0) {
        return `${student.firstName} expresses creativity through ${creativeInterests.join(', ')}`;
      }
      return `${student.firstName} can explore creativity through ${student.interests[0] || 'hands-on activities'}`;
    });
  } else if (topInterests.some(interest => ['stories', 'reading', 'books', 'writing'].includes(interest))) {
    theme = "Story Explorers and Word Wizards";
    rationale = "Several students show interest in stories, reading, and language";
    connections = students.map(student => {
      const literacyInterests = student.interests.filter(interest => 
        ['stories', 'reading', 'books', 'writing', 'poetry'].some(literacy => 
          interest.toLowerCase().includes(literacy)
        )
      );
      if (literacyInterests.length > 0) {
        return `${student.firstName} enjoys ${literacyInterests.join(', ')}`;
      }
      return `${student.firstName} can explore stories through ${student.interests[0] || 'imaginative play'}`;
    });
  } else {
    // Create a theme that incorporates the most common interests
    const topThree = topInterests.slice(0, 3);
    theme = `Our Amazing Interests: ${topThree.map(interest => 
      interest.charAt(0).toUpperCase() + interest.slice(1)
    ).join(', ')}`;
    rationale = `This theme celebrates the diverse interests in our classroom: ${topThree.join(', ')}`;
    connections = students.map(student => 
      `${student.firstName} brings ${student.interests.slice(0, 2).join(' and ')} to our learning`
    );
  }

  return { theme, rationale, connections };
}

export async function generateClassroomPlan(request: ClassroomPlanRequest) {
  try {
    console.log('🔑 Anthropic API Key configured:', !!env.ANTHROPIC_API_KEY);
    console.log('📚 Request details:', {
      classroomName: request.classroomName,
      yearLevel: request.yearLevel,
      subject: request.subject,
      studentsCount: request.students?.length || 0
    });

    // Check if API key is configured
    if (!env.ANTHROPIC_API_KEY) {
      console.error('❌ ANTHROPIC_API_KEY is not configured');
      throw new Error('ANTHROPIC_API_KEY environment variable is required but not set');
    }
    
    // Get curriculum context for the year level
    const curriculumContext = curriculumContextService.getContextForYearLevel(request.yearLevel, request.subject);
    
    // Generate class theme based on student interests
    const classTheme = generateClassTheme(request.students);
    
    // Create student profiles summary
    const studentProfiles = request.students.map(student => ({
      name: student.firstName,
      neurotype: student.neurotype,
      strengths: student.strengths.slice(0, 3),
      interests: student.interests.slice(0, 3),
      sensoryNeeds: student.sensoryNeeds.slice(0, 2),
      communication: student.communicationStyle,
      accommodations: student.accommodations.slice(0, 2)
    }));

    // Count neurotypes for planning
    const neurotypeBreakdown = request.students.reduce((acc, student) => {
      acc[student.neurotype] = (acc[student.neurotype] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const prompt = `You are Wundara Educator — an expert inclusive education specialist who creates comprehensive, neuroaffirming classroom plans for mixed-ability learning environments.

CLASSROOM CONTEXT:
- Classroom: ${request.classroomName}
- Educator: ${request.educatorName}
- Year Level: ${request.yearLevel} (${request.state})
- Subject: ${request.subject}
- Duration: ${request.lessonDuration} minutes
- Students: ${request.students.length} learners

UNIFYING CLASS THEME: "${classTheme.theme}"
Theme Rationale: ${classTheme.rationale}

Student Interest Connections:
${classTheme.connections.map(connection => `• ${connection}`).join('\n')}

STUDENT NEUROTYPE BREAKDOWN:
${Object.entries(neurotypeBreakdown).map(([type, count]) => `• ${type}: ${count} student${count > 1 ? 's' : ''}`).join('\n')}

DETAILED STUDENT PROFILES:
${studentProfiles.map((student, index) => `
${index + 1}. ${student.name} (${student.neurotype})
   Strengths: ${student.strengths.join(', ')}
   Interests: ${student.interests.join(', ')}
   Sensory Needs: ${student.sensoryNeeds.join(', ')}
   Communication: ${student.communication}
   Accommodations: ${student.accommodations.join(', ')}
`).join('')}

LEARNING OBJECTIVES:
${request.learningObjectives.map((obj, index) => `${index + 1}. ${obj}`).join('\n')}

AVAILABLE RESOURCES: ${request.availableResources.join(', ')}
SPECIAL CONSIDERATIONS: ${request.specialConsiderations}

CURRICULUM CONTEXT:
${curriculumContext}

---

CREATE A COMPREHENSIVE WEEKLY LEARNING PLAN in MARKDOWN format, following this EXACT structure:

# 🌿 [Creative Mission Title]

**Inclusive Learning Plan | Year ${request.yearLevel} | ${request.state} | ${request.subject}**  
**Theme**: [One sentence describing the adventure/mission]

---

## 🗓 Monday – **"[Daily Focus Name]"**

---

### 🧩 **1. [Activity Name]**

🎯 *[Curriculum Codes]*  
🧠 *Objective*: [Clear learning objective]

**Materials**: [comma-separated list]

**Step-by-Step**:
1. [First concrete action]
2. [Second action]
3. [Continue with 5-7 steps total]

**Declarative Prompt**:  
🌱 *"[Low-demand, curiosity-based prompt in quotes]"*

**Adult Prep Tip**: [Neurodiversity consideration for educators]

**[Optional] Outdoor Option**: [Alternative approach if applicable]

---

### 🧩 **2. [Second Activity Name]**

[Follow same structure as activity 1]

---

[Continue with 3-4 activities per day]

---

## 🗓 Tuesday – **"[Daily Focus]"**

[Repeat structure for Tuesday through Friday]

---

## 📋 Week Overview

**Transition Strategies**:
- [Strategy 1]
- [Strategy 2]

**Emergency Protocols**:
- [Protocol 1]
- [Protocol 2]

**Reflection Prompts**:
- [Question 1]
- [Question 2]

**Home-School Connection**:
- [Activity 1 families can do]
- [Activity 2]

**Inclusion Notes**:
- [Key neurodiversity-affirming practice]
- [Another key practice]

---

CRITICAL FORMATTING RULES:
1. Use emoji sparingly (only for section headers: 🌿 🗓 🧩 🎯 🧠 🌱 🗣)
2. Bold key terms with **double asterisks**
3. Use italics for *curriculum codes* and *objectives*
4. Number all step-by-step instructions
5. Include declarative prompts in quotes with emoji prefix
6. Each activity must have: title, codes, objective, materials, steps, prompt, prep tip
7. Weave "${classTheme.theme}" throughout all activities naturally
8. Reference specific student names and interests where appropriate
9. Make it practical, detailed, and immediately implementable

OUTPUT ONLY THE MARKDOWN - NO JSON, NO EXPLANATORY TEXT BEFORE OR AFTER.`;

    console.log('📝 Prompt length:', prompt.length, 'characters');
    console.log('🎯 Calling Anthropic API...');
    
    const response = await anthropic.messages.create({
      model: env.ANTHROPIC_MODEL, // Use configured model
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    console.log('✅ Anthropic API response received');
    console.log('📊 Response type:', response.content[0]?.type);
    
    const content = response.content[0];
    if (content.type !== 'text') {
      console.error('❌ Unexpected response type:', content.type);
      throw new Error('Unexpected response type from Anthropic');
    }

    const markdownContent = content.text.trim();
    console.log('📄 Markdown content length:', markdownContent.length, 'characters');
    console.log('📄 Markdown preview (first 200 chars):', markdownContent.substring(0, 200));
    
    // Parse the markdown into structured data
    console.log('🔄 Parsing markdown to structured data...');
    const parsedData = parseMarkdownPlan(markdownContent);
    console.log('✅ Markdown parsed successfully');
    console.log('📊 Parsed data keys:', Object.keys(parsedData));
    console.log('📊 Days count:', parsedData.days?.length || 0);
    
    // Convert parsed data to match the expected format for UI compatibility
    const days = parsedData.days.map((day, index) => ({
      dayIndex: index,
      dayName: day.day,
      dayFocus: day.focus,
      activities: day.activities.map(activity => ({
        title: activity.title,
        objective: activity.objective,
        curriculumCodes: activity.curriculumCodes,
        materials: activity.materials,
        instructions: activity.steps.join('\n'),
        declarativeLanguage: activity.declarativePrompts.join(' '),
        adultSupport: activity.adultPrepTip || '',
        outdoorOption: activity.outdoorOption || '',
        estimatedDuration: activity.duration ? `${activity.duration} minutes` : '30 minutes'
      }))
    }));
    
    // Create the combined result with both formats
    const plan = {
      id: `classroom-plan-${Date.now()}`,
      classroomName: request.classroomName,
      educatorName: request.educatorName,
      yearLevel: request.yearLevel,
      state: request.state,
      subject: request.subject,
      totalDuration: request.lessonDuration,
      
      // Store both formats
      markdownContent,
      metadata: parsedData,
      
      // UI compatibility structure
      classTheme: {
        title: classTheme.theme,
        description: classTheme.rationale,
        studentConnections: classTheme.connections
      },
      themeTitle: parsedData.missionTitle || classTheme.theme,
      overview: parsedData.theme || classTheme.rationale,
      weekOf: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      days: days,
      weekOverview: {
        transitionStrategies: parsedData.transitionStrategies,
        emergencyProtocols: parsedData.emergencyProtocols,
        reflectionPrompts: parsedData.reflectionPrompts,
        homeSchoolConnection: parsedData.homeSchoolConnection,
        inclusionNotes: parsedData.inclusionNotes
      },
      
      studentIds: request.students.map((s: any) => s.id),
      generatedAt: new Date().toISOString()
    };

    return {
      success: true,
      plan
    };
  } catch (error) {
    console.error('❌❌❌ ERROR GENERATING CLASSROOM PLAN ❌❌❌');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error details:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Return structured fallback plan with theme integration
    const classTheme = generateClassTheme(request.students);
    
    return {
      success: false,
      error: 'Failed to generate classroom plan',
      fallbackPlan: {
        id: `fallback-classroom-plan-${Date.now()}`,
        classroomName: request.classroomName,
        educatorName: request.educatorName,
        yearLevel: request.yearLevel,
        subject: request.subject,
        totalDuration: request.lessonDuration,
        classTheme: {
          title: classTheme.theme,
          description: classTheme.rationale,
          studentConnections: classTheme.connections
        },
        themeTitle: classTheme.theme,
        overview: classTheme.rationale,
        weekOf: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        days: [
          {
            dayIndex: 0,
            dayName: 'Monday',
            dayFocus: `Introduction to ${classTheme.theme}`,
            activities: [
              {
                title: 'Welcome Circle',
                objective: 'Connect student interests to our class theme',
                curriculumCodes: ['AC9E3LA03'],
                materials: ['Visual theme display', 'Student interest cards', 'Calm music'],
                instructions: '1. Gather students in a comfortable circle\n2. Introduce the theme with visual supports\n3. Connect each student\'s interests to the theme\n4. Set learning intentions together\n5. Practice theme-related vocabulary',
                declarativeLanguage: `I notice everyone has different interests that connect to ${classTheme.theme} in unique ways`,
                adultSupport: 'Have fidget tools available and allow flexible participation levels',
                outdoorOption: ''
              }
            ]
          }
        ],
        weekOverview: {
          transitionStrategies: ['Visual timers for activity changes', 'Theme-based transition songs', 'Movement breaks between activities'],
          emergencyProtocols: ['Calm corner available for regulation', 'Flexible expectations based on individual needs', 'Sensory break protocols'],
          reflectionPrompts: [`How did ${classTheme.theme} connect to your interests today?`, 'What was your favorite part of our learning?'],
          homeSchoolConnection: [`Explore ${classTheme.theme} at home with family`, 'Share family connections to the theme'],
          inclusionNotes: ['Every student\'s interests are valued and celebrated', 'Multiple ways to participate and show learning', 'Celebrates neurodiversity as natural human variation']
        },
        generatedAt: new Date().toISOString()
      }
    };
  }
}

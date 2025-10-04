import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { getCurriculumContext } from './curriculumContext';

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

interface ClassroomStudent {
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

interface ClassroomPlanRequest {
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
    // Get curriculum context for the year level
    const curriculumContext = await getCurriculumContext(request.subject, request.yearLevel);
    
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
- Layout: ${request.classroomLayout}
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

AVAILABLE RESOURCES:
${request.availableResources.join(', ')}

SPECIAL CONSIDERATIONS:
${request.specialConsiderations}

CURRICULUM CONTEXT:
${curriculumContext}

CORE PRINCIPLES:
• Neurodiversity is natural human variation to be celebrated
• Every student has unique strengths and contributions
• Flexible approaches honor different learning styles and needs
• Sensory needs are valid and must be accommodated
• Choice and autonomy reduce anxiety and increase engagement
• Success looks different for every learner - celebrate engagement over completion
• The class theme "${classTheme.theme}" should weave through all activities

REQUIRED LESSON STRUCTURE:
1. ENGAGING OPENER (5-10 minutes)
   - Sensory-friendly warm-up incorporating the class theme
   - Multiple entry points for different neurotypes
   - Connection to student interests through the theme

2. MAIN LEARNING ACTIVITIES (${Math.floor(request.lessonDuration * 0.6)}-${Math.floor(request.lessonDuration * 0.7)} minutes)
   - 3-4 activities with whole-class, small-group, and individual options
   - Each activity must connect to "${classTheme.theme}"
   - Visual, auditory, and kinesthetic pathways
   - Choice-based elements for PDA support
   - Clear connections to student interests

3. SENSORY BREAKS (2-5 minutes each, built into activities)
   - Movement and calming options
   - Regulation opportunities

4. COLLABORATIVE COMPONENTS
   - Peer learning celebrating differences
   - Flexible participation levels
   - Theme-based group work

5. WRAP-UP & REFLECTION (5-10 minutes)
   - Multiple sharing methods
   - Success celebration
   - Theme connections

DIFFERENTIATION REQUIREMENTS (for each activity):
• Visual Learners: Graphic organizers, visual schedules, color coding, theme-related imagery
• Auditory Learners: Discussion, music, verbal instructions, theme-related sounds/stories
• Kinesthetic Learners: Movement, hands-on, fidgets, theme-related manipulatives
• Low Demand (PDA-friendly): Choice-based, minimal pressure, collaborative language, theme exploration
• High Support Needs: Step-by-step guides, visual supports, peer buddies, simplified theme connections

ASSESSMENT DIVERSITY:
- Traditional written work
- Verbal presentations/recordings
- Visual projects (drawings, diagrams, models) - theme-related
- Performance/demonstration
- Portfolio collections
- Peer teaching opportunities

EMERGENCY STRATEGIES:
- Sensory overload protocols
- Dysregulation support procedures
- Flexible expectations and alternatives
- Calm corner/break procedures
- Communication breakdown support

Generate a comprehensive JSON classroom plan that:
1. Integrates the class theme "${classTheme.theme}" throughout ALL activities
2. References specific student interests within the theme context
3. Provides practical, implementable strategies
4. Includes emergency protocols
5. Celebrates neurodiversity while meeting curriculum standards
6. Makes every student feel seen and valued through interest integration

Return ONLY valid JSON in this exact structure:
{
  "id": "generated-plan-id",
  "classroomName": "${request.classroomName}",
  "educatorName": "${request.educatorName}",
  "yearLevel": "${request.yearLevel}",
  "subject": "${request.subject}",
  "totalDuration": ${request.lessonDuration},
  "classTheme": {
    "title": "${classTheme.theme}",
    "description": "Brief description of how this theme connects to student interests",
    "studentConnections": ["List of how each student connects to the theme"]
  },
  "learningObjectives": ["Objectives that incorporate the theme"],
  "activities": [
    {
      "title": "Activity name incorporating theme",
      "duration": 15,
      "type": "whole-class|small-group|individual|sensory-break|transition",
      "description": "Description connecting to ${classTheme.theme} and student interests",
      "instructions": "Step-by-step instructions with theme integration",
      "materials": ["Materials list including theme-related items"],
      "curriculumCodes": ["Relevant ACARA codes"],
      "themeConnections": {
        "overallConnection": "How this activity connects to the class theme",
        "studentInterestLinks": ["Specific connections to individual student interests"]
      },
      "differentiationStrategies": {
        "visual": ["Visual strategies incorporating theme"],
        "auditory": ["Auditory strategies with theme elements"],
        "kinesthetic": ["Hands-on strategies using theme"],
        "lowDemand": ["PDA-friendly approaches with theme choice"],
        "highSupport": ["High support strategies with theme scaffolding"]
      },
      "groupingStrategy": "How students are grouped for this activity",
      "assessmentMethod": "How learning is assessed (multiple formats)",
      "sensoryConsiderations": ["Sensory supports needed"],
      "successCriteria": ["What success looks like for different learners"]
    }
  ],
  "transitionStrategies": ["Strategies for moving between activities"],
  "emergencyStrategies": ["Protocols for challenges"],
  "reflectionPrompts": ["Questions for student reflection on theme and learning"],
  "homeSchoolConnection": ["Ways families can extend theme learning at home"],
  "inclusionNotes": ["Key points about celebrating neurodiversity in this lesson"],
  "generatedAt": "${new Date().toISOString()}"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic');
    }

    // Parse the JSON response
    const planData = JSON.parse(content.text);
    
    // Add generated ID if not present
    if (!planData.id) {
      planData.id = `classroom-plan-${Date.now()}`;
    }

    return {
      success: true,
      plan: planData
    };

  } catch (error) {
    console.error('Error generating classroom plan:', error);
    
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
          description: `A unifying theme that celebrates our classroom's diverse interests: ${classTheme.rationale}`,
          studentConnections: classTheme.connections
        },
        learningObjectives: request.learningObjectives,
        activities: [
          {
            title: `${classTheme.theme} Introduction Circle`,
            duration: 10,
            type: 'whole-class' as const,
            description: `Welcome students with a theme-based opening that connects to everyone's interests through ${classTheme.theme}`,
            instructions: `1. Gather in circle\n2. Share theme introduction\n3. Connect each student's interests to the theme\n4. Set learning intentions`,
            materials: ['Visual theme display', 'Student interest cards', 'Calm music'],
            curriculumCodes: ['AC9E3LA03'],
            themeConnections: {
              overallConnection: `Introduces ${classTheme.theme} as our learning focus`,
              studentInterestLinks: classTheme.connections
            },
            differentiationStrategies: {
              visual: ['Theme visual display', 'Interest connection cards'],
              auditory: ['Verbal explanations', 'Theme song or sounds'],
              kinesthetic: ['Movement to circle', 'Fidget tools available'],
              lowDemand: ['Choice in sharing level', 'No pressure to speak'],
              highSupport: ['Visual schedule', 'Peer buddy system']
            },
            groupingStrategy: 'Whole class circle with flexible participation',
            assessmentMethod: 'Observation of engagement and interest connections',
            sensoryConsiderations: ['Soft lighting', 'Calm music', 'Fidget tools available'],
            successCriteria: ['Shows interest in theme', 'Connects to personal interests', 'Feels included']
          }
        ],
        transitionStrategies: ['Visual timers', 'Theme-based transition songs', 'Movement breaks'],
        emergencyStrategies: ['Calm corner available', 'Flexible expectations', 'Sensory break protocols'],
        reflectionPrompts: [`How did ${classTheme.theme} connect to your interests today?`, 'What was your favorite part?'],
        homeSchoolConnection: [`Explore ${classTheme.theme} at home`, 'Share family connections to the theme'],
        inclusionNotes: ['Every student\'s interests are valued', 'Multiple ways to participate', 'Celebrates neurodiversity'],
        generatedAt: new Date().toISOString()
      }
    };
  }
}

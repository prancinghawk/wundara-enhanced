// services/markdownParser.ts

interface ParsedActivity {
  title: string;
  curriculumCodes: string[];
  objective: string;
  materials: string[];
  steps: string[];
  declarativePrompts: string[];
  adultPrepTip?: string;
  outdoorOption?: string;
  duration?: number;
}

interface ParsedDay {
  day: string;
  focus: string;
  activities: ParsedActivity[];
}

interface ParsedPlan {
  missionTitle: string;
  theme: string;
  yearLevel: string;
  state: string;
  subject: string;
  days: ParsedDay[];
  transitionStrategies: string[];
  emergencyProtocols: string[];
  reflectionPrompts: string[];
  homeSchoolConnection: string[];
  inclusionNotes: string[];
}

export function parseMarkdownPlan(markdown: string): ParsedPlan {
  const lines = markdown.split('\n');
  
  // Extract mission title (first # heading)
  const missionTitleMatch = markdown.match(/^#\s+🌿\s+(.+)$/m);
  const missionTitle = missionTitleMatch ? missionTitleMatch[1].trim() : 'Untitled Mission';
  
  // Extract theme
  const themeMatch = markdown.match(/\*\*Theme\*\*:\s+(.+)$/m);
  const theme = themeMatch ? themeMatch[1].trim() : '';
  
  // Extract year level and state from the metadata line
  const metadataMatch = markdown.match(/Year\s+(\d+)\s+\|\s+(\w+)/);
  const yearLevel = metadataMatch ? metadataMatch[1] : '';
  const state = metadataMatch ? metadataMatch[2] : '';
  
  // Extract subject (you might need to adjust this based on your format)
  const subjectMatch = markdown.match(/\|\s+(\w+)\s*$/m);
  const subject = subjectMatch ? subjectMatch[1] : '';
  
  // Extract days
  const days: ParsedDay[] = [];
  const dayRegex = /##\s+🗓\s+(\w+)\s+–\s+\*\*"([^"]+)"\*\*/g;
  let dayMatch;
  
  while ((dayMatch = dayRegex.exec(markdown)) !== null) {
    const day = dayMatch[1];
    const focus = dayMatch[2];
    const dayStartIndex = dayMatch.index;
    
    // Find the next day or end of content
    const nextDayMatch = dayRegex.exec(markdown);
    const dayEndIndex = nextDayMatch ? nextDayMatch.index : markdown.length;
    dayRegex.lastIndex = dayStartIndex + 1; // Reset for next iteration
    
    const dayContent = markdown.substring(dayStartIndex, dayEndIndex);
    const activities = parseActivities(dayContent);
    
    days.push({ day, focus, activities });
  }
  
  // Extract week overview sections
  const transitionStrategies = extractListItems(markdown, 'Transition Strategies');
  const emergencyProtocols = extractListItems(markdown, 'Emergency Protocols');
  const reflectionPrompts = extractListItems(markdown, 'Reflection Prompts');
  const homeSchoolConnection = extractListItems(markdown, 'Home-School Connection');
  const inclusionNotes = extractListItems(markdown, 'Inclusion Notes');
  
  return {
    missionTitle,
    theme,
    yearLevel,
    state,
    subject,
    days,
    transitionStrategies,
    emergencyProtocols,
    reflectionPrompts,
    homeSchoolConnection,
    inclusionNotes
  };
}

function parseActivities(dayContent: string): ParsedActivity[] {
  const activities: ParsedActivity[] = [];
  
  // Match activity sections (### 🧩 **Number. Title**)
  const activityRegex = /###\s+🧩\s+\*\*\d+\.\s+([^*]+)\*\*/g;
  let activityMatch;
  
  while ((activityMatch = activityRegex.exec(dayContent)) !== null) {
    const title = activityMatch[1].trim();
    const activityStartIndex = activityMatch.index;
    
    // Find next activity or end of day
    const nextActivityMatch = activityRegex.exec(dayContent);
    const activityEndIndex = nextActivityMatch ? nextActivityMatch.index : dayContent.length;
    activityRegex.lastIndex = activityStartIndex + 1;
    
    const activityContent = dayContent.substring(activityStartIndex, activityEndIndex);
    
    // Extract curriculum codes
    const codesMatch = activityContent.match(/🎯\s+\*([^*]+)\*/);
    const curriculumCodes = codesMatch 
      ? codesMatch[1].split(',').map(code => code.trim().match(/AC\w+/)?.[0]).filter(Boolean) as string[]
      : [];
    
    // Extract objective
    const objectiveMatch = activityContent.match(/🧠\s+\*Objective\*:\s+(.+)$/m);
    const objective = objectiveMatch ? objectiveMatch[1].trim() : '';
    
    // Extract materials
    const materialsMatch = activityContent.match(/\*\*Materials\*\*:\s+(.+)$/m);
    const materials = materialsMatch 
      ? materialsMatch[1].split(',').map(m => m.trim())
      : [];
    
    // Extract steps
    const steps: string[] = [];
    const stepsSection = activityContent.match(/\*\*Step-by-Step\*\*:\s*\n((?:\d+\..*\n?)+)/);
    if (stepsSection) {
      const stepMatches = stepsSection[1].matchAll(/\d+\.\s+(.+?)(?=\n\d+\.|\n*$)/g);
      for (const stepMatch of stepMatches) {
        steps.push(stepMatch[1].trim());
      }
    }
    
    // Extract declarative prompts
    const declarativePrompts: string[] = [];
    const promptMatches = activityContent.matchAll(/[🌱🗣]\s+\*"([^"]+)"\*/g);
    for (const promptMatch of promptMatches) {
      declarativePrompts.push(promptMatch[1]);
    }
    
    // Extract adult prep tip
    const prepTipMatch = activityContent.match(/\*\*Adult Prep Tip\*\*:\s+(.+?)(?=\n\n|\*\*|$)/s);
    const adultPrepTip = prepTipMatch ? prepTipMatch[1].trim() : undefined;
    
    // Extract outdoor option
    const outdoorMatch = activityContent.match(/\*\*(?:Outdoor Option|Outdoor Variation)\*\*:\s+(.+?)(?=\n\n|\*\*|$)/s);
    const outdoorOption = outdoorMatch ? outdoorMatch[1].trim() : undefined;
    
    activities.push({
      title,
      curriculumCodes,
      objective,
      materials,
      steps,
      declarativePrompts,
      adultPrepTip,
      outdoorOption
    });
  }
  
  return activities;
}

function extractListItems(markdown: string, sectionTitle: string): string[] {
  const regex = new RegExp(`\\*\\*${sectionTitle}\\*\\*:\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|\\n##|$)` , 'i');
  const match = markdown.match(regex);
  
  if (!match) return [];
  
  const listContent = match[1];
  const items = listContent
    .split('\n')
    .map(line => line.replace(/^[-*]\s+/, '').trim())
    .filter(line => line.length > 0);
  
  return items;
}

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdArrowBack, MdEdit, MdCalendarToday, MdSchedule, MdPlayArrow } from 'react-icons/md';
import { apiFetch } from '../services/api';
import { ActivityPathways } from '../components/ActivityPathways';
import { ExportButton } from '../components/ExportButton';
import { useAuth } from '@clerk/clerk-react';
import '../styles/print.css';

interface Activity {
  title: string;
  objective: string;
  curriculumCodes: string[];
  materials: string[];
  instructions: string;
  declarativeLanguage?: string;
  modifications?: string;
  estimatedDuration: string;
}

interface Day {
  dayIndex: number;
  dayName: string;
  activities: Activity[];
}

interface PlanData {
  themeTitle: string;
  overview: string;
  days: Day[];
  pathways?: Array<{
    id: string;
    title: string;
    subtitle: string;
    color: 'green' | 'yellow' | 'blue';
    stepCount: number;
    setupRequired?: {
      duration: string;
      description: string;
    };
    steps: Array<{
      id: string;
      title: string;
      description?: string;
    }>;
    wrapUp?: {
      title: string;
      description: string;
    };
  }>;
}

interface Plan {
  id: string;
  themeTitle: string;
  overview: string;
  planJson: {
    structured?: PlanData;
    raw: string;
  };
  createdAt: string;
  weekOf: string;
}

export default function WeeklyPlanView() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlan() {
      if (!planId) return;
      
      try {
        setLoading(true);
        const token = await getToken();
        console.log('Fetching plan with ID:', planId, 'Token:', token ? 'Present' : 'Missing');
        
        // Determine if this is a classroom plan based on ID pattern or try both endpoints
        let planData;
        try {
          // First try educator-plans endpoint (for classroom plans)
          const educatorResponse = await apiFetch(`/api/educator-plans/${planId}`, { token }) as any;
          console.log('Educator response received:', educatorResponse);
          
          // Extract plan from the wrapped response
          planData = educatorResponse.success ? educatorResponse.plan : educatorResponse;
          console.log('Plan data extracted from educator-plans:', planData);
        } catch (educatorError) {
          console.log('Not found in educator-plans, trying regular plans endpoint...');
          // Fallback to regular plans endpoint (for individual plans)
          planData = await apiFetch(`/api/plans/${planId}`, { token }) as Plan;
          console.log('Plan data received from plans:', planData);
        }
        
        setPlan(planData);
      } catch (err) {
        console.error('Failed to fetch plan:', err);
        setError('Failed to load plan');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPlan();
  }, [planId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-body-medium text-on-surface-variant">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            iconLeft={<MdArrowBack size={20} />}
            text="Back to Plans"
            onClick={() => navigate('/plans')}
          />
        </div>
        <Card className="p-6 text-center">
          <h2 className="text-title-large mb-2">Plan Not Found</h2>
          <p className="text-body-medium text-on-surface-variant">
            {error || 'The requested plan could not be found.'}
          </p>
        </Card>
      </div>
    );
  }

  // Try to get structured data - handle both individual plans (planJson) and classroom plans (direct data)
  let structuredData;
  let parseError = null;
  
  if (plan.planJson) {
    // Individual plan format with planJson wrapper
    structuredData = plan.planJson.structured;
    
    // If no structured data but we have raw JSON, try to parse it
    if (!structuredData && plan.planJson.raw) {
      try {
        const parsed = JSON.parse(plan.planJson.raw);
        structuredData = parsed;
        console.log('Successfully parsed structured data from raw JSON');
      } catch (err) {
        parseError = err;
        console.error('Failed to parse raw JSON:', err);
        // Set structuredData to null so fallback UI is shown
        structuredData = null;
      }
    }
  } else {
    // Classroom plan format - data is directly in the plan object
    structuredData = plan;
    console.log('Using classroom plan data directly');
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            iconLeft={<MdArrowBack size={20} />}
            text="Back to Plans"
            onClick={() => navigate('/plans')}
          />
        </div>
        <div className="flex gap-2">
          <ExportButton
            markdownContent={(plan as any).markdownContent || '# Learning Plan\n\nNo markdown content available.'}
            planTitle={(plan as any).themeTitle || (plan as any).classTheme?.title || (plan as any).classroomName || 'Learning Plan'}
          />
          <Button
            variant="outlined"
            iconLeft={<MdEdit size={16} />}
            text="Edit Plan"
            onClick={() => {
              // TODO: Implement edit functionality
              console.log('Edit plan functionality coming soon');
            }}
          />
        </div>
      </div>

      {/* Plan Overview */}
      <Card className="p-6">
        <div className="mb-4">
          <h1 className="text-display-small mb-2">
            {(plan as any).themeTitle || (plan as any).classTheme?.title || (plan as any).classroomName || 'Learning Plan'}
          </h1>
          <div className="flex items-center gap-4 text-body-medium text-on-surface-variant mb-4">
            <div className="flex items-center gap-1">
              <MdCalendarToday size={16} />
              <span>Week of {new Date((plan as any).weekOf || (plan as any).generatedAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MdSchedule size={16} />
              <span>Created {new Date((plan as any).createdAt || (plan as any).generatedAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
          <p className="text-body-large">{(plan as any).overview || (plan as any).classTheme?.description || `${(plan as any).subject} learning plan for ${(plan as any).yearLevel}`}</p>
        </div>
      </Card>

      {/* Plan Content */}
      {structuredData ? (
        <div className="space-y-6">
          {/* Activity Pathways - for homeschool plans */}
          {structuredData.pathways && structuredData.pathways.length > 0 && (
            <ActivityPathways paths={structuredData.pathways} />
          )}
          

          
          {/* Daily Activities Overview - for both homeschool and classroom plans */}
          {structuredData.days && structuredData.days.length > 0 && (
            <div className="space-y-4">
              {structuredData.days.map((day) => (
                <div 
                  key={day.dayIndex} 
                  className="cursor-pointer"
                  onClick={() => navigate(`/plans/${planId}/day/${day.dayIndex}`)}
                >
                  <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-primary text-on-primary rounded-full w-10 h-10 flex items-center justify-center text-title-medium font-medium">
                        {day.dayIndex + 1}
                      </span>
                      <div>
                        <h3 className="text-title-large">{day.dayName}: {day.dayFocus || day.activities[0]?.title}</h3>
                        <p className="text-body-medium text-on-surface-variant">
                          Class Focus: {day.activities[0]?.objective || 'Collaborative learning and exploration'}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-body-small text-on-surface-variant">
                          <span>📚 {day.activities.length} activities</span>
                          <span>👥 Whole class + small groups</span>
                          <span>⏱️ {day.activities.reduce((total, activity) => total + (parseInt(activity.estimatedDuration) || 30), 0)} min total</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-title-medium">Activities</h4>
                    
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="border-l-4 border-primary/20 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-surface-container text-on-surface rounded-full w-6 h-6 flex items-center justify-center text-label-small">
                                {activityIndex + 1}
                              </span>
                              <h5 className="text-title-medium">{activity.title}</h5>
                            </div>
                            <p className="text-body-medium text-on-surface-variant mb-2">{activity.objective}</p>
                          </div>
                          <div className="text-right text-body-small text-on-surface-variant ml-4">
                            <p>{activity.estimatedDuration}</p>
                            <p>{activity.curriculumCodes.slice(0, 2).join(', ')}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="text-label-large mb-1 font-medium">Materials Needed</h6>
                            <ul className="text-body-small text-on-surface-variant space-y-0.5">
                              {activity.materials.slice(0, 4).map((material, idx) => (
                                <li key={idx}>• {material}</li>
                              ))}
                              {activity.materials.length > 4 && (
                                <li className="text-primary">+ {activity.materials.length - 4} more items</li>
                              )}
                            </ul>
                          </div>
                          
                          <div>
                            <h6 className="text-label-large mb-1 font-medium">Classroom Management</h6>
                            <p className="text-body-small text-on-surface-variant">
                              {activity.declarativeLanguage || activity.modifications || 'Neurodiversity-affirming approach with flexible pacing'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4 pt-4 border-t border-outline">
                      <div className="flex items-center justify-between text-body-small text-on-surface-variant">
                        <span>Click to view detailed daily plan</span>
                        <MdPlayArrow size={20} />
                      </div>
                    </div>
                  </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Fallback for unstructured data
        <Card className="p-6">
          <h2 className="text-title-large mb-4">Plan Content</h2>
          <div className="bg-surface-container-low p-4 rounded-lg mb-4">
            <p className="text-body-medium text-on-surface-variant mb-2">
              This plan data couldn't be displayed in the structured format. This might be due to an older plan format or a parsing issue.
            </p>
            <p className="text-body-small text-on-surface-variant mb-4">
              You can still view the raw plan content below, or try regenerating the plan for the best experience.
            </p>
            {parseError && (
              <div className="bg-error-container/20 border border-error/20 rounded-lg p-3 mb-4">
                <p className="text-body-small text-error font-medium">
                  Parsing Error: {(parseError as Error).message}
                </p>
              </div>
            )}
            <Button
              variant="filled"
              text="Regenerate Plan"
              onClick={() => navigate('/plans')}
            />
          </div>
          <details className="cursor-pointer">
            <summary className="text-title-medium mb-2 hover:text-primary">▼ View Raw Plan Data</summary>
            <div className="whitespace-pre-wrap text-body-small font-mono bg-surface-container p-4 rounded-lg overflow-auto max-h-96">
              {plan.planJson?.raw || JSON.stringify(plan, null, 2)}
            </div>
          </details>
        </Card>
      )}
    </div>
  );
}

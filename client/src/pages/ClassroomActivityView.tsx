import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdArrowBack, MdSchedule, MdGroup, MdSchool, MdAccessibility } from 'react-icons/md';
import { apiFetch } from '../services/api';
import { getCurriculumDescription } from '../utils/curriculumLibrary';

interface ClassroomPlan {
  id: string;
  classroomName: string;
  educatorName: string;
  yearLevel: string;
  subject: string;
  classTheme: {
    title: string;
    description: string;
    studentConnections: string[];
  };
  days: Day[];
  generatedAt: string;
}

interface Day {
  dayIndex: number;
  dayName: string;
  dayFocus: string;
  activities: Activity[];
}

interface Activity {
  title: string;
  objective: string;
  curriculumCodes: string[];
  materials: string[];
  instructions: string;
  declarativeLanguage: string;
  adultSupport: string;
  outdoorOption?: string;
}

export default function ClassroomActivityView() {
  const { planId, dayIndex, activityIndex } = useParams<{ planId: string; dayIndex: string; activityIndex?: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [plan, setPlan] = useState<ClassroomPlan | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlanAndActivity() {
      if (!planId || !dayIndex) return;

      try {
        setLoading(true);
        const token = await getToken();

        // Fetch the classroom plan
        const educatorResponse = await apiFetch(`/api/educator-plans/${planId}`, { token }) as any;
        const planData = educatorResponse.success ? educatorResponse.plan : educatorResponse;

        setPlan(planData);

        // Get the specific day and activity
        const dayIdx = parseInt(dayIndex);
        if (planData.days && planData.days[dayIdx]) {
          const day = planData.days[dayIdx];
          
          // If activityIndex is provided, get specific activity, otherwise get first activity
          if (activityIndex) {
            const activityIdx = parseInt(activityIndex);
            if (day.activities && day.activities[activityIdx]) {
              setActivity(day.activities[activityIdx]);
            } else {
              setError('Activity not found');
            }
          } else if (day.activities && day.activities.length > 0) {
            // Default to first activity if no specific activity index
            setActivity(day.activities[0]);
          } else {
            setError('No activities found for this day');
          }
        } else {
          setError('Day not found');
        }
      } catch (err) {
        console.error('Failed to fetch activity:', err);
        setError('Failed to load activity');
      } finally {
        setLoading(false);
      }
    }

    fetchPlanAndActivity();
  }, [planId, dayIndex, activityIndex, getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-body-medium text-on-surface-variant">Loading activity...</p>
        </div>
      </div>
    );
  }

  if (error || !plan || !activity) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            iconLeft={<MdArrowBack size={20} />}
            text="Back to Plan"
            onClick={() => navigate(`/plans/${planId}`)}
          />
        </div>
        <Card className="p-6 text-center">
          <h2 className="text-title-large mb-2">Activity Not Found</h2>
          <p className="text-body-medium text-on-surface-variant">
            {error || 'The requested activity could not be found.'}
          </p>
        </Card>
      </div>
    );
  }

  const currentDayIndex = parseInt(dayIndex);
  const currentActivityIndex = activityIndex ? parseInt(activityIndex) : 0;
  const currentDay = plan.days?.[currentDayIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            iconLeft={<MdArrowBack size={20} />}
            text="Back to Plan"
            onClick={() => navigate(`/plans/${planId}`)}
          />
        </div>
      </div>

      {/* Activity Overview */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary text-on-primary rounded-full w-12 h-12 flex items-center justify-center text-title-large font-medium">
              {currentDay?.dayName || `Day ${currentDayIndex + 1}`}
            </span>
            <div>
              <h1 className="text-display-small mb-2">{activity.title}</h1>
              <div className="flex items-center gap-4 text-body-medium text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <MdSchool size={16} />
                  <span>{plan.subject} • {plan.yearLevel}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-body-large">{activity.objective}</p>
        </div>
      </Card>

      {/* Activity Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Instructions */}
        <Card className="p-6">
          <h2 className="text-title-large mb-4 flex items-center gap-2">
            <MdGroup size={20} />
            Instructions
          </h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-body-medium whitespace-pre-line">{activity.instructions}</p>
          </div>
        </Card>

        {/* Materials */}
        <Card className="p-6">
          <h2 className="text-title-large mb-4">Materials Needed</h2>
          {activity.materials && activity.materials.length > 0 ? (
            <ul className="space-y-2">
              {activity.materials.map((material, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-body-medium">{material}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-medium text-on-surface-variant">No specific materials required</p>
          )}
        </Card>

        {/* Curriculum Alignment */}
        <Card className="p-6">
          <h2 className="text-title-large mb-4 flex items-center gap-2">
            <MdSchool size={20} />
            Curriculum Alignment
          </h2>
          {activity.curriculumCodes && activity.curriculumCodes.length > 0 ? (
            <div className="space-y-3">
              {activity.curriculumCodes.map((code, index) => {
                const description = getCurriculumDescription(code);
                return (
                  <div key={index} className="p-3 bg-surface-container-low rounded-lg">
                    <div className="font-medium text-body-large mb-1">{code}</div>
                    <div className="text-body-small text-on-surface-variant">{description}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-body-medium text-on-surface-variant">No curriculum codes specified</p>
          )}
        </Card>

        {/* Adult Support */}
        <Card className="p-6">
          <h2 className="text-title-large mb-4 flex items-center gap-2">
            <MdAccessibility size={20} />
            Adult Support & Guidance
          </h2>
          {activity.adultSupport ? (
            <div className="p-3 bg-surface-container-low rounded-lg">
              <p className="text-body-medium">{activity.adultSupport}</p>
            </div>
          ) : (
            <p className="text-body-medium text-on-surface-variant">No specific adult support guidance provided</p>
          )}
          
          {/* Declarative Language */}
          {activity.declarativeLanguage && (
            <div className="mt-4">
              <h3 className="text-title-medium mb-2">Declarative Language Prompt</h3>
              <div className="p-3 bg-primary-container rounded-lg">
                <p className="text-body-medium italic">"{activity.declarativeLanguage}"</p>
              </div>
            </div>
          )}
          
          {/* Outdoor Option */}
          {activity.outdoorOption && (
            <div className="mt-4">
              <h3 className="text-title-medium mb-2">Outdoor Alternative</h3>
              <div className="p-3 bg-secondary-container rounded-lg">
                <p className="text-body-medium">{activity.outdoorOption}</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Theme Connection */}
      {plan.classTheme && (
        <Card className="p-6">
          <h2 className="text-title-large mb-4">Theme Connection: {plan.classTheme.title}</h2>
          <p className="text-body-medium mb-4">{plan.classTheme.description}</p>
          {plan.classTheme.studentConnections && plan.classTheme.studentConnections.length > 0 && (
            <div>
              <h3 className="text-title-medium mb-2">Student Connections:</h3>
              <ul className="space-y-1">
                {plan.classTheme.studentConnections.map((connection, index) => (
                  <li key={index} className="text-body-medium text-on-surface-variant">
                    • {connection}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

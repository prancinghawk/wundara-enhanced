import React from 'react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdArrowBack, MdEdit, MdCalendarToday, MdSchedule } from 'react-icons/md';
import { ActivityPathways } from './ActivityPathways';

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

interface PlanViewerProps {
  plan: Plan;
  onBack: () => void;
  onEdit?: () => void;
}

export function PlanViewer({ plan, onBack, onEdit }: PlanViewerProps) {
  const structuredData = plan.planJson.structured;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            iconLeft={<MdArrowBack size={20} />}
            text="Back to Plans"
            onClick={onBack}
          />
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outlined"
              iconLeft={<MdEdit size={16} />}
              text="Edit Plan"
              onClick={onEdit}
            />
          )}
        </div>
      </div>

      {/* Plan Overview */}
      <Card className="p-6">
        <div className="mb-4">
          <h1 className="text-display-small mb-2">{plan.themeTitle}</h1>
          <div className="flex items-center gap-4 text-body-medium text-on-surface-variant mb-4">
            <div className="flex items-center gap-1">
              <MdCalendarToday size={16} />
              <span>Week of {new Date(plan.weekOf).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MdSchedule size={16} />
              <span>Created {new Date(plan.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <p className="text-body-large">{plan.overview}</p>
        </div>
      </Card>

      {/* Plan Content */}
      {structuredData ? (
        <div className="space-y-6">
          {/* Activity Pathways */}
          {structuredData.pathways && structuredData.pathways.length > 0 && (
            <ActivityPathways paths={structuredData.pathways} />
          )}
          
          {/* Daily Activities */}
          {structuredData.days && structuredData.days.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-title-large">Daily Activities</h2>
              {structuredData.days.map((day) => (
                <Card key={day.dayIndex} className="p-6">
              <h2 className="text-title-large mb-4 flex items-center gap-2">
                <span className="bg-primary text-on-primary rounded-full w-8 h-8 flex items-center justify-center text-label-large">
                  {day.dayIndex + 1}
                </span>
                {day.dayName}
              </h2>
              
              <div className="space-y-6">
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="border-l-4 border-primary/20 pl-4">
                    <h3 className="text-title-medium mb-2">{activity.title}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-label-large mb-1">Learning Objective</h4>
                        <p className="text-body-medium text-on-surface-variant">{activity.objective}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-label-large mb-1">Duration</h4>
                        <p className="text-body-medium text-on-surface-variant">{activity.estimatedDuration}</p>
                      </div>
                    </div>

                    {activity.curriculumCodes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-label-large mb-2">Curriculum Codes</h4>
                        <div className="flex flex-wrap gap-2">
                          {activity.curriculumCodes.map((code, codeIndex) => (
                            <span
                              key={codeIndex}
                              className="bg-surface-container px-2 py-1 rounded text-label-small"
                            >
                              {code}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="text-label-large mb-2">Materials Needed</h4>
                      <ul className="list-disc list-inside text-body-medium text-on-surface-variant space-y-1">
                        {activity.materials.map((material, materialIndex) => (
                          <li key={materialIndex}>{material}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-label-large mb-2">Instructions</h4>
                      <div className="text-body-medium whitespace-pre-wrap">{activity.instructions}</div>
                    </div>

                    {activity.declarativeLanguage && (
                      <div className="mb-4 bg-surface-container-low p-4 rounded-lg">
                        <h4 className="text-label-large mb-2">Neurodiversity-Affirming Language</h4>
                        <p className="text-body-medium text-on-surface-variant">{activity.declarativeLanguage}</p>
                      </div>
                    )}

                    {activity.modifications && (
                      <div className="bg-surface-container-low p-4 rounded-lg">
                        <h4 className="text-label-large mb-2">Modifications & Adaptations</h4>
                        <p className="text-body-medium text-on-surface-variant">{activity.modifications}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Fallback for unstructured data
        <Card className="p-6">
          <h2 className="text-title-large mb-4">Plan Content</h2>
          <div className="whitespace-pre-wrap text-body-medium">{plan.planJson.raw}</div>
        </Card>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdExpandMore, MdExpandLess, MdPlayArrow, MdCheckCircle } from 'react-icons/md';

interface ActivityStep {
  id: string;
  title: string;
  description?: string;
  duration?: string;
}

interface ActivityPath {
  id: string;
  title: string;
  subtitle: string;
  color: 'green' | 'yellow' | 'blue';
  stepCount: number;
  setupRequired?: {
    duration: string;
    description: string;
  };
  steps: ActivityStep[];
  wrapUp?: {
    title: string;
    description: string;
  };
}

interface ActivityPathwaysProps {
  paths: ActivityPath[];
}

export function ActivityPathways({ paths }: ActivityPathwaysProps) {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  const getColorClasses = (color: string, isExpanded: boolean) => {
    const baseClasses = "border-2 transition-all duration-200";
    
    switch (color) {
      case 'green':
        return `${baseClasses} ${isExpanded ? 'bg-green-50 border-green-200' : 'bg-green-25 border-green-100'} hover:border-green-200`;
      case 'yellow':
        return `${baseClasses} ${isExpanded ? 'bg-yellow-50 border-yellow-200' : 'bg-yellow-25 border-yellow-100'} hover:border-yellow-200`;
      case 'blue':
        return `${baseClasses} ${isExpanded ? 'bg-blue-50 border-blue-200' : 'bg-blue-25 border-blue-100'} hover:border-blue-200`;
      default:
        return `${baseClasses} bg-surface border-outline hover:border-primary`;
    }
  };

  const getIndicatorColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const togglePath = (pathId: string) => {
    setExpandedPath(expandedPath === pathId ? null : pathId);
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-title-large mb-2">Activity Pathways</h2>
        <p className="text-body-medium text-on-surface-variant">
          Choose the approach that feels right for your child today. Each path includes detailed setup, step-by-step instructions, and wrap-up guidance.
        </p>
      </div>

      {paths.map((path) => {
        const isExpanded = expandedPath === path.id;
        
        return (
          <Card key={path.id} className={`p-0 ${getColorClasses(path.color, isExpanded)}`}>
            {/* Path Header */}
            <div 
              className="p-4 cursor-pointer flex items-center justify-between"
              onClick={() => togglePath(path.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getIndicatorColor(path.color)}`} />
                <div>
                  <h3 className="text-title-medium">{path.title}</h3>
                  <p className="text-body-small text-on-surface-variant">{path.subtitle}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-label-medium text-on-surface-variant">
                  {path.stepCount} steps
                </span>
                {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-4">
                {/* Setup Required */}
                {path.setupRequired && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MdPlayArrow size={16} className="text-on-surface-variant" />
                      <h4 className="text-label-large font-medium">Setup Required</h4>
                    </div>
                    <p className="text-body-small text-on-surface-variant ml-6">
                      [{path.setupRequired.duration}] {path.setupRequired.description}
                    </p>
                  </div>
                )}

                {/* Step-by-Step Instructions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MdCheckCircle size={16} className="text-on-surface-variant" />
                    <h4 className="text-label-large font-medium">Step-by-Step Instructions</h4>
                  </div>
                  
                  <ol className="ml-6 space-y-2">
                    {path.steps.map((step, index) => (
                      <li key={step.id} className="flex gap-3">
                        <span className="text-label-medium text-on-surface-variant min-w-[20px]">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-body-medium">{step.title}</p>
                          {step.description && (
                            <p className="text-body-small text-on-surface-variant mt-1">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Wrap-Up */}
                {path.wrapUp && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-on-surface-variant" />
                      <h4 className="text-label-large font-medium">Wrap-Up</h4>
                    </div>
                    <p className="text-body-small text-on-surface-variant ml-6">
                      {path.wrapUp.description}
                    </p>
                  </div>
                )}

                {/* Neurodiversity Note */}
                <div className="mt-4 p-3 bg-surface-container-low rounded-lg">
                  <p className="text-body-small text-on-surface-variant italic text-center">
                    💡 Remember: These are guides, not rules. Adjust based on what your child needs in the moment.
                  </p>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

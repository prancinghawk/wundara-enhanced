import React from 'react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdAdd } from 'react-icons/md';

interface Plan {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Draft';
  subjects: string[];
  duration: string;
  location?: string;
  image?: string;
}

interface LearningPlansGridProps {
  plans: Plan[];
  onNewPlan: () => void;
  onViewPlan: (planId: string) => void;
}

export function LearningPlansGrid({ plans, onNewPlan, onViewPlan }: LearningPlansGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Math': 'bg-blue-100 text-blue-700',
      'Arts': 'bg-purple-100 text-purple-700',
      'History': 'bg-orange-100 text-orange-700',
      'Science': 'bg-green-100 text-green-700',
      'Social Skills': 'bg-pink-100 text-pink-700',
      'English/Literacy': 'bg-indigo-100 text-indigo-700'
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-title-large">Learning Plans</h2>
          <p className="text-body-medium text-on-surface-variant mt-1">Current Plans</p>
        </div>
        <Button
          variant="filled"
          iconLeft={<MdAdd size={20} />}
          text="New Plan"
          onClick={onNewPlan}
        />
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Plan Image/Header */}
            <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-label-small ${getStatusColor(plan.status)}`}>
                  {plan.status}
                </span>
              </div>
            </div>

            {/* Plan Content */}
            <div className="p-4">
              <h3 className="text-title-medium mb-2 line-clamp-2">{plan.title}</h3>
              <p className="text-body-small text-on-surface-variant mb-3 line-clamp-3">
                {plan.description}
              </p>

              {/* Subject Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {plan.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-label-small ${getSubjectColor(subject)}`}
                  >
                    {subject}
                  </span>
                ))}
              </div>

              {/* Duration & Location */}
              <div className="flex items-center justify-between text-body-small text-on-surface-variant mb-4">
                <span>{plan.duration}</span>
                {plan.location && <span>{plan.location}</span>}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="filled"
                  text="View"
                  onClick={() => onViewPlan(plan.id)}
                  className="flex-1"
                />
                <Button
                  variant="outlined"
                  text="Edit"
                  className="flex-1"
                />
              </div>
            </div>
          </Card>
        ))}

        {/* Empty State or Add New Card */}
        {plans.length === 0 && (
          <Card className="p-8 text-center border-2 border-dashed border-outline">
            <div className="mb-4">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                <MdAdd size={24} className="text-on-surface-variant" />
              </div>
              <h3 className="text-title-medium mb-2">No plans yet</h3>
              <p className="text-body-medium text-on-surface-variant mb-4">
                Create your first learning plan to get started with personalized education.
              </p>
              <Button
                variant="filled"
                text="Create First Plan"
                iconLeft={<MdAdd size={16} />}
                onClick={onNewPlan}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

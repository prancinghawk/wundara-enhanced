import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import ClassroomSelector from '../../components/ClassroomSelector';
import { Card } from '../../ui/components/cards/Card';
import { Button } from '../../ui/components/button/common-button/Button';

interface ClassroomConfig {
  id: string;
  classroomName: string;
  educatorName: string;
  yearLevel: string;
  state: string;
  students: any[];
  availableResources: string[];
  classroomLayout: string;
  specialConsiderations: string;
  lastUpdated: string;
}

export default function ClassroomOnboarding() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomConfig | null>(null);

  const handleSelectClassroom = (classroom: ClassroomConfig) => {
    setSelectedClassroom(classroom);
    // Navigate to dashboard with the selected classroom
    navigate('/dashboard');
  };

  const handleCreateNew = () => {
    // Navigate to the educator dashboard which will show the classroom setup wizard
    navigate('/educator-temp');
  };

  const educatorName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.emailAddresses?.[0]?.emailAddress || 'Educator';

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-display-medium mb-4">Welcome to Wundara Educator</h1>
          <p className="text-body-large text-on-surface-variant">
            Create inclusive, neurodiversity-affirming learning plans for your classroom
          </p>
        </div>

        <Card className="p-8">
          <ClassroomSelector
            onSelectClassroom={handleSelectClassroom}
            onCreateNew={handleCreateNew}
            educatorName={educatorName}
          />
        </Card>

        <div className="text-center mt-8">
          <Button
            variant="text"
            text="Skip for now"
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </div>
    </div>
  );
}

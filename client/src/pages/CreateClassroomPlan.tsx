import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ClassroomSetupWizard } from '../components/ClassroomSetupWizard';
import { apiFetch } from '../services/api';

export default function CreateClassroomPlan() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isWizardOpen, setIsWizardOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleClassroomCreated = async (classroomData: any) => {
    console.log('Classroom created:', classroomData);
    
    try {
      setIsSaving(true);
      const token = await getToken();
      
      // Save classroom configuration first
      const configResponse = await apiFetch('/api/educator-plans/configurations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classroomName: classroomData.classroomName,
          educatorName: classroomData.educatorName,
          yearLevel: classroomData.yearLevel,
          state: classroomData.state,
          students: classroomData.students,
          classroomLayout: classroomData.classroomLayout,
          totalStudents: classroomData.totalStudents
        }),
        token
      }) as any;

      if (configResponse.success) {
        console.log('✅ Classroom configuration saved:', configResponse.configId);
        alert(`Classroom "${classroomData.classroomName}" has been saved successfully! You can now generate plans from the Classroom Profiles page.`);
        navigate('/profiles');
      } else {
        console.error('❌ Failed to save classroom configuration:', configResponse.error);
        alert('Failed to save classroom configuration. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error saving classroom:', error);
      alert('Failed to save classroom. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Navigate back to profiles
    navigate('/profiles');
  };

  return (
    <div className="min-h-screen bg-surface-container-low">
      {isSaving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-container p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-title-medium mb-2">Saving Classroom...</h3>
            <p className="text-body-medium text-on-surface-variant">
              Creating your classroom profile with student information
            </p>
          </div>
        </div>
      )}
      <ClassroomSetupWizard
        isOpen={isWizardOpen}
        onClose={handleClose}
        onClassroomCreated={handleClassroomCreated}
      />
    </div>
  );
}

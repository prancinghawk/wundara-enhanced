import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdAdd, MdSchool, MdGroup, MdSettings, MdEdit, MdDelete } from 'react-icons/md';
import { apiFetch } from '../services/api';
import { ClassroomSetupWizard } from '../components/ClassroomSetupWizard';

interface ClassroomConfiguration {
  id: string;
  configId: string;
  classroomName: string;
  educatorName: string;
  yearLevel: string;
  state: string;
  students: any[];
  availableResources: string[];
  classroomLayout: string;
  totalStudents: number;
  specialConsiderations?: string;
  lastUsed: string;
  planCount: number;
}
export default function ClassroomProfiles() {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<ClassroomConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<ClassroomConfiguration | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      // Fetch all configurations for the current user
      const response = await apiFetch(`/api/educator-plans/configurations`, { token }) as any;
      
      if (response.success) {
        setClassrooms(response.configurations || []);
      } else {
        setError('Failed to load classroom configurations');
      }
    } catch (err) {
      console.error('Error fetching classrooms:', err);
      setError('Failed to load classroom configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClassroom = async (configId: string) => {
    if (!confirm('Are you sure you want to delete this classroom configuration?')) {
      return;
    }

    try {
      const token = await getToken();
      await apiFetch(`/api/educator-plans/classroom/${configId}`, {
        method: 'DELETE',
        token
      });
      
      // Refresh the list
      fetchClassrooms();
    } catch (err) {
      console.error('Error deleting classroom:', err);
      alert('Failed to delete classroom configuration');
    }
  };

  const handleViewDetails = (classroom: ClassroomConfiguration) => {
    setEditingClassroom(classroom);
    setIsWizardOpen(true);
  };

  const handleCreateClassroom = () => {
    setEditingClassroom(null);
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
    setEditingClassroom(null);
  };

  const handleClassroomSaved = async (classroomData: any) => {
    try {
      const token = await getToken();
      
      if (editingClassroom) {
        // Update existing classroom
        await apiFetch(`/api/educator-plans/classroom/${editingClassroom.configId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(classroomData),
          token
        });
        alert('Classroom updated successfully!');
      } else {
        // Create new classroom
        await apiFetch('/api/educator-plans/configurations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(classroomData),
          token
        });
        alert('Classroom created successfully!');
      }
      
      // Refresh the list
      fetchClassrooms();
      handleCloseWizard();
    } catch (err) {
      console.error('Error saving classroom:', err);
      alert('Failed to save classroom configuration');
    }
  };

  const handleGeneratePlan = (classroom: ClassroomConfiguration) => {
    // Navigate to Plans page with classroom context
    navigate('/plans', { 
      state: { 
        planType: 'classroom',
        classroomData: classroom,
        openWizard: true
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-small">Classroom Profiles</h1>
            <p className="text-body-large text-on-surface-variant">
              Manage your classroom configurations for efficient plan generation
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-body-medium text-on-surface-variant">Loading classrooms...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-small">Classroom Profiles</h1>
          <p className="text-body-large text-on-surface-variant">
            Manage your classroom configurations for efficient plan generation
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            text="Refresh"
            onClick={() => fetchClassrooms()}
          />
          <Button
            variant="filled"
            iconLeft={<MdAdd size={20} />}
            text="Add Classroom"
            onClick={handleCreateClassroom}
          />
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-error-container text-on-error-container">
          <p>{error}</p>
        </Card>
      )}

      {/* Classroom List */}
      {classrooms.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <MdSchool size={64} className="mx-auto text-on-surface-variant opacity-50" />
          </div>
          <h2 className="text-title-large mb-2">No classroom profiles yet</h2>
          <p className="text-body-medium text-on-surface-variant mb-6 max-w-md mx-auto">
            Create your first classroom profile to start generating personalized, 
            neurodiversity-affirming learning plans for your students.
          </p>
          <Button
            variant="filled"
            iconLeft={<MdAdd size={20} />}
            text="Create First Classroom"
            onClick={handleCreateClassroom}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <Card key={classroom.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MdSchool size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-title-medium font-medium">{classroom.classroomName}</h3>
                    <p className="text-body-small text-on-surface-variant">
                      {classroom.yearLevel} • {classroom.state}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="text"
                    iconLeft={<MdEdit size={16} />}
                    onClick={() => handleViewDetails(classroom)}
                    className="p-2"
                  />
                  <Button
                    variant="text"
                    iconLeft={<MdDelete size={16} />}
                    onClick={() => handleDeleteClassroom(classroom.configId)}
                    className="p-2 text-error hover:bg-error/10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-body-small text-on-surface-variant">
                  <MdGroup size={16} />
                  <span>{classroom.students.length} students</span>
                </div>

                <div className="flex items-center gap-2 text-body-small text-on-surface-variant">
                  <MdSettings size={16} />
                  <span>{classroom.availableResources.length} resources configured</span>
                </div>

                <div className="pt-2 border-t border-outline-variant">
                  <div className="flex items-center justify-between text-body-small">
                    <span className="text-on-surface-variant">
                      Last used: {new Date(classroom.lastUsed).toLocaleDateString()}
                    </span>
                    <span className="text-primary font-medium">
                      {classroom.planCount} plans generated
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outlined"
                    text="Generate Plan"
                    onClick={() => handleGeneratePlan(classroom)}
                    className="flex-1"
                  />
                  <Button
                    variant="text"
                    text="View Details"
                    onClick={() => handleViewDetails(classroom)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Classroom Setup Wizard */}
      <ClassroomSetupWizard
        isOpen={isWizardOpen}
        onClose={handleCloseWizard}
        onClassroomCreated={handleClassroomSaved}
        existingClassroom={editingClassroom}
        isEditing={!!editingClassroom}
      />
    </div>
  );
}

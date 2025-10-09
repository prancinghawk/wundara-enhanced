import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdAdd, MdSchool, MdPeople, MdEdit, MdDelete } from 'react-icons/md';
import { apiFetch } from '../services/api';

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

interface ClassroomSelectorProps {
  onSelectClassroom: (classroom: ClassroomConfig) => void;
  onCreateNew: () => void;
  educatorName: string;
}

export default function ClassroomSelector({ onSelectClassroom, onCreateNew, educatorName }: ClassroomSelectorProps) {
  const { getToken } = useAuth();
  const [classrooms, setClassrooms] = useState<ClassroomConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClassrooms();
  }, [educatorName]);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await apiFetch(`/api/educator-plans/classrooms/${encodeURIComponent(educatorName)}`, { token }) as any;
      
      if (response.success) {
        setClassrooms(response.classrooms);
      } else {
        setError('Failed to load classrooms');
      }
    } catch (err) {
      console.error('Error fetching classrooms:', err);
      setError('Failed to load classrooms');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClassroom = async (configId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-body-medium text-on-surface-variant">Loading your classrooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-body-medium text-error mb-4">{error}</p>
        <Button
          variant="outlined"
          text="Try Again"
          onClick={fetchClassrooms}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-title-large mb-2">Your Classrooms</h2>
        <p className="text-body-medium text-on-surface-variant">
          Select an existing classroom or create a new one
        </p>
      </div>

      {classrooms.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 rounded-full bg-surface-container p-4 w-16 h-16 mx-auto flex items-center justify-center">
            <MdSchool size={24} className="text-on-surface-variant" />
          </div>
          <h3 className="text-title-medium mb-2">No classrooms yet</h3>
          <p className="text-body-medium text-on-surface-variant mb-4">
            Create your first classroom configuration to get started
          </p>
          <Button
            variant="filled"
            text="Create First Classroom"
            iconLeft={<MdAdd size={16} />}
            onClick={onCreateNew}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {classrooms.map((classroom) => (
              <div 
                key={classroom.id} 
                className="cursor-pointer"
                onClick={() => onSelectClassroom(classroom)}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-on-primary rounded-full w-12 h-12 flex items-center justify-center">
                      <MdSchool size={20} />
                    </div>
                    <div>
                      <h3 className="text-title-medium">{classroom.classroomName}</h3>
                      <p className="text-body-small text-on-surface-variant">
                        {classroom.yearLevel} • {classroom.state}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClassroom(classroom.id, e)}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-full transition-colors"
                    title="Delete classroom"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-body-small text-on-surface-variant">
                    <MdPeople size={16} />
                    <span>{classroom.students.length} students</span>
                  </div>
                  <div className="text-body-small text-on-surface-variant">
                    Layout: {classroom.classroomLayout}
                  </div>
                  {classroom.specialConsiderations && (
                    <div className="text-body-small text-on-surface-variant">
                      Special considerations: {classroom.specialConsiderations.substring(0, 50)}
                      {classroom.specialConsiderations.length > 50 && '...'}
                    </div>
                  )}
                </div>

                <div className="text-body-small text-on-surface-variant">
                  Last updated: {new Date(classroom.lastUpdated).toLocaleDateString()}
                </div>
              </Card>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button
              variant="outlined"
              text="Create New Classroom"
              iconLeft={<MdAdd size={16} />}
              onClick={onCreateNew}
            />
          </div>
        </div>
      )}
    </div>
  );
}

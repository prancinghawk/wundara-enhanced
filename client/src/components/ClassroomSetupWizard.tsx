import React, { useState, useEffect } from 'react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdClose, MdAdd, MdDelete, MdCheck } from 'react-icons/md';

interface Student {
  id: string;
  firstName: string;
  ageYears: number;
  neurotype: string;
  strengths: string[];
  challenges: string[];
  interests: string[];
  sensoryNeeds: string[];
  communicationStyle: string;
  learningPreferences: string[];
  accommodations: string[];
}

interface ClassroomData {
  classroomName: string;
  yearLevel: string;
  totalStudents: number;
  educatorName: string;
  state: string;
  classroomLayout: string;
  students: Student[];
}

interface ClassroomSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onClassroomCreated: (classroom: ClassroomData) => void;
  existingClassroom?: ClassroomData;
  isEditing?: boolean;
}

const neurotypes = [
  'Autism', 'ADHD', 'AUDHD', 'PDA', 'Dyslexia', 'Dyspraxia', 
  'Anxiety', 'Processing Differences', 'Neurotypical', 'Other'
];

const communicationStyles = [
  'Verbal', 'Visual supports', 'AAC device', 'Sign language', 
  'Written communication', 'Mixed methods'
];

const learningPreferences = [
  'Visual', 'Auditory', 'Kinesthetic', 'Hands-on', 'Reading/Writing', 
  'Social learning', 'Independent work', 'Structured activities'
];

const yearLevels = [
  'Foundation', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 
  'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'
];

const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

export function ClassroomSetupWizard({ 
  isOpen, 
  onClose, 
  onClassroomCreated, 
  existingClassroom,
  isEditing = false 
}: ClassroomSetupWizardProps) {
  const [step, setStep] = useState(1);
  const [classroomData, setClassroomData] = useState<ClassroomData>(
    existingClassroom || {
      classroomName: '',
      yearLevel: 'Year 3',
      totalStudents: 20,
      educatorName: '',
      state: 'NSW',
      classroomLayout: 'Flexible seating with quiet corners',
      students: []
    }
  );

  const [currentStudent, setCurrentStudent] = useState<Student>({
    id: '',
    firstName: '',
    ageYears: 8,
    neurotype: 'Neurotypical',
    strengths: [],
    challenges: [],
    interests: [],
    sensoryNeeds: [],
    communicationStyle: 'Verbal',
    learningPreferences: [],
    accommodations: []
  });

  // Update classroom data when existingClassroom changes
  useEffect(() => {
    if (existingClassroom && isEditing) {
      setClassroomData({
        classroomName: existingClassroom.classroomName,
        yearLevel: existingClassroom.yearLevel,
        totalStudents: existingClassroom.totalStudents,
        educatorName: existingClassroom.educatorName,
        state: existingClassroom.state,
        classroomLayout: existingClassroom.classroomLayout,
        students: existingClassroom.students || []
      });
      setStep(1); // Start at step 1 to show all the pre-populated data
    } else if (!isEditing) {
      // Reset to default when creating new classroom
      setClassroomData({
        classroomName: '',
        yearLevel: 'Year 3',
        totalStudents: 20,
        educatorName: '',
        state: 'NSW',
        classroomLayout: 'Flexible seating with quiet corners',
        students: []
      });
      setStep(1); // Start at step 1 for new classroom
    }
  }, [existingClassroom, isEditing]);

  const addStudent = () => {
    if (!currentStudent.firstName.trim()) return;
    
    const newStudent = {
      ...currentStudent,
      id: `student-${Date.now()}`
    };
    
    setClassroomData(prev => ({
      ...prev,
      students: [...prev.students, newStudent]
    }));
    
    // Reset form
    setCurrentStudent({
      id: '',
      firstName: '',
      ageYears: 8,
      neurotype: 'Neurotypical',
      strengths: [],
      challenges: [],
      interests: [],
      sensoryNeeds: [],
      communicationStyle: 'Verbal',
      learningPreferences: [],
      accommodations: []
    });
  };

  const removeStudent = (studentId: string) => {
    setClassroomData(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== studentId)
    }));
  };

  const handleArrayInput = (field: keyof Student, value: string) => {
    if (!value.trim()) return;
    
    setCurrentStudent(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()]
    }));
  };

  const removeArrayItem = (field: keyof Student, index: number) => {
    setCurrentStudent(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    onClassroomCreated(classroomData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-large">
              {isEditing ? 'Edit Classroom' : 'Setup Your Classroom'}
            </h2>
            <Button
              variant="text"
              iconLeft={<MdClose size={20} />}
              onClick={onClose}
            />
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>1</div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>2</div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>3</div>
          </div>

          {/* Step 1: Basic Classroom Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-title-medium">Classroom Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-medium font-medium mb-2">Classroom Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Room 3A, The Explorers"
                    className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:outline-none"
                    value={classroomData.classroomName}
                    onChange={(e) => setClassroomData(prev => ({ ...prev, classroomName: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-body-medium font-medium mb-2">Educator Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:outline-none"
                    value={classroomData.educatorName}
                    onChange={(e) => setClassroomData(prev => ({ ...prev, educatorName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-body-medium font-medium mb-2">Year Level</label>
                  <select
                    className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:outline-none"
                    value={classroomData.yearLevel}
                    onChange={(e) => setClassroomData(prev => ({ ...prev, yearLevel: e.target.value }))}
                  >
                    {yearLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-body-medium font-medium mb-2">State</label>
                  <select
                    className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:outline-none"
                    value={classroomData.state}
                    onChange={(e) => setClassroomData(prev => ({ ...prev, state: e.target.value }))}
                  >
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-body-medium font-medium mb-2">Total Students</label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:outline-none"
                    value={classroomData.totalStudents}
                    onChange={(e) => setClassroomData(prev => ({ ...prev, totalStudents: parseInt(e.target.value) || 20 }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-body-medium font-medium mb-2">Classroom Layout</label>
                <textarea
                  placeholder="Describe your classroom setup (e.g., flexible seating, quiet corners, sensory spaces)"
                  className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:outline-none h-24 resize-none"
                  value={classroomData.classroomLayout}
                  onChange={(e) => setClassroomData(prev => ({ ...prev, classroomLayout: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Step 2: Student Profiles */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-title-medium">Student Profiles</h3>
                <p className="text-body-medium text-on-surface-variant">
                  Added: {classroomData.students.length} / {classroomData.totalStudents}
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-body-medium text-blue-800">
                  <strong>Optional:</strong> Add individual student profiles to create more personalized classroom plans. 
                  You can add as many or as few as you'd like - the AI will create representative profiles for the rest.
                  If you skip this step, the AI will work with typical classroom demographics.
                </p>
              </div>

              {/* Current Students */}
              {classroomData.students.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-body-large font-medium">Added Students</h4>
                  {classroomData.students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                      <div>
                        <p className="font-medium">{student.firstName}</p>
                        <p className="text-body-small text-on-surface-variant">
                          Age {student.ageYears} • {student.neurotype} • {student.interests.slice(0, 2).join(', ')}
                        </p>
                      </div>
                      <Button
                        variant="text"
                        iconLeft={<MdDelete size={16} />}
                        onClick={() => removeStudent(student.id)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Student Form */}
              <div className="border border-outline rounded-lg p-4 space-y-4">
                <h4 className="text-body-large font-medium">Add Student Profile</h4>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-body-small font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-outline rounded focus:border-primary focus:outline-none"
                      value={currentStudent.firstName}
                      onChange={(e) => setCurrentStudent(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-body-small font-medium mb-1">Age</label>
                    <input
                      type="number"
                      min="4"
                      max="18"
                      className="w-full p-2 border border-outline rounded focus:border-primary focus:outline-none"
                      value={currentStudent.ageYears}
                      onChange={(e) => setCurrentStudent(prev => ({ ...prev, ageYears: parseInt(e.target.value) || 8 }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-body-small font-medium mb-1">Neurotype</label>
                    <select
                      className="w-full p-2 border border-outline rounded focus:border-primary focus:outline-none"
                      value={currentStudent.neurotype}
                      onChange={(e) => setCurrentStudent(prev => ({ ...prev, neurotype: e.target.value }))}
                    >
                      {neurotypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Add Arrays */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-small font-medium mb-1">Interests</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add interest"
                        className="flex-1 p-2 border border-outline rounded focus:border-primary focus:outline-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleArrayInput('interests', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentStudent.interests.map((interest, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-body-small">
                          {interest}
                          <button onClick={() => removeArrayItem('interests', index)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-body-small font-medium mb-1">Strengths</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add strength"
                        className="flex-1 p-2 border border-outline rounded focus:border-primary focus:outline-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleArrayInput('strengths', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentStudent.strengths.map((strength, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-body-small">
                          {strength}
                          <button onClick={() => removeArrayItem('strengths', index)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outlined"
                  text="Add Student"
                  iconLeft={<MdAdd size={16} />}
                  onClick={addStudent}
                  disabled={!currentStudent.firstName.trim()}
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-title-medium">Review Classroom Setup</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-body-large font-medium mb-3">Classroom Details</h4>
                  <div className="space-y-2 text-body-medium">
                    <p><strong>Name:</strong> {classroomData.classroomName}</p>
                    <p><strong>Educator:</strong> {classroomData.educatorName}</p>
                    <p><strong>Year Level:</strong> {classroomData.yearLevel}</p>
                    <p><strong>State:</strong> {classroomData.state}</p>
                    <p><strong>Total Students:</strong> {classroomData.totalStudents}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-body-large font-medium mb-3">Student Profiles</h4>
                  <p className="text-body-medium mb-2">
                    {classroomData.students.length} detailed profiles added
                  </p>
                  {classroomData.students.length > 0 && (
                    <div className="space-y-1">
                      {classroomData.students.map((student) => (
                        <p key={student.id} className="text-body-small">
                          • {student.firstName} ({student.neurotype})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-outline">
            <Button
              variant="outlined"
              text={step === 1 ? "Cancel" : "Back"}
              onClick={step === 1 ? onClose : () => setStep(step - 1)}
            />
            
            <Button
              variant="filled"
              text={step === 3 ? "Create Classroom" : "Next"}
              iconLeft={step === 3 ? <MdCheck size={16} /> : undefined}
              onClick={step === 3 ? handleSubmit : () => setStep(step + 1)}
              disabled={
                (step === 1 && (!classroomData.classroomName || !classroomData.educatorName)) ||
                (step === 3 && !classroomData.classroomName)
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

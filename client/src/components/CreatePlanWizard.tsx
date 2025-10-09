import React, { useState, useEffect } from 'react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdClose, MdCheck } from 'react-icons/md';
import { apiFetch } from '../services/api';
import { useAuth } from '@clerk/clerk-react';

interface Child {
  id: string;
  firstName: string;
  ageYears?: number;
  neurotype?: string;
}

interface PlanGenerationRequest {
  childId: string;
  learningTheme?: string;
  focusAreas: string[];
  planDuration: string;
  materialAccess: string[];
  learningStyles: string[];
  energyLevel: string;
  specialNotes?: string;
}

interface CreatePlanWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: any) => void;
  planType?: 'individual' | 'classroom';
  isEducator?: boolean;
  classroomData?: any;
}

export function CreatePlanWizard({ isOpen, onClose, onPlanCreated, planType = 'individual', isEducator = false, classroomData }: CreatePlanWizardProps) {
  const { getToken } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PlanGenerationRequest>({
    childId: '',
    learningTheme: '',
    focusAreas: [],
    planDuration: '5-days',
    materialAccess: ['basic-crafts'],
    learningStyles: [],
    energyLevel: 'moderate',
    specialNotes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchChildren();
    }
  }, [isOpen]);

  async function fetchChildren() {
    try {
      const token = await getToken();
      const data = await apiFetch('/api/children', { token }) as Child[];
      setChildren(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, childId: data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch children:', error);
    }
  }

  const focusAreaOptions = [
    'Math', 'Science', 'English/Literacy', 'History', 'Geography', 
    'Arts', 'Music', 'Physical Education', 'Technology', 'Social Skills'
  ];

  const materialAccessOptions = [
    { value: 'basic-crafts', label: 'Basic Crafts', description: 'Paper, pencils, basic art supplies' },
    { value: 'tech-only', label: 'Tech Only', description: 'Digital devices and online resources' },
    { value: 'outdoors', label: 'Outdoors', description: 'Nature materials and outdoor spaces' },
    { value: 'all', label: 'All Materials', description: 'Full access to varied materials' }
  ];

  const learningStyleOptions = [
    { value: 'visual', label: 'Visual', description: 'Charts, diagrams, images' },
    { value: 'auditory', label: 'Auditory', description: 'Music, discussions, verbal instructions' },
    { value: 'kinesthetic', label: 'Kinesthetic', description: 'Hands-on, movement, tactile' },
    { value: 'reading-writing', label: 'Reading/Writing', description: 'Text-based learning' }
  ];

  const energyLevelOptions = [
    { value: 'low-demand', label: 'Low Demand', description: 'Flexible, minimal pressure, child-led' },
    { value: 'moderate', label: 'Moderate Structure', description: 'Balanced, guided, collaborative' },
    { value: 'high-engagement', label: 'High Engagement', description: 'Detailed, extended, deep exploration' }
  ];

  function handleFocusAreaToggle(area: string) {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  }

  function handleLearningStyleToggle(style: string) {
    setFormData(prev => ({
      ...prev,
      learningStyles: prev.learningStyles.includes(style)
        ? prev.learningStyles.filter(s => s !== style)
        : [...prev.learningStyles, style]
    }));
  }

  function handleMaterialAccessToggle(material: string) {
    setFormData(prev => {
      if (material === 'all') {
        // If 'all' is selected, toggle all materials
        const allMaterials = ['basic-crafts', 'tech-only', 'outdoors', 'all'];
        const hasAll = prev.materialAccess.includes('all');
        return {
          ...prev,
          materialAccess: hasAll ? [] : allMaterials
        };
      } else {
        // Handle individual material selection
        const newMaterialAccess = prev.materialAccess.includes(material)
          ? prev.materialAccess.filter(m => m !== material && m !== 'all') // Remove 'all' if individual item is deselected
          : [...prev.materialAccess.filter(m => m !== 'all'), material]; // Remove 'all' and add individual item
        
        // Check if all individual items are selected, then add 'all'
        const individualMaterials = ['basic-crafts', 'tech-only', 'outdoors'];
        const hasAllIndividual = individualMaterials.every(m => newMaterialAccess.includes(m));
        
        return {
          ...prev,
          materialAccess: hasAllIndividual ? [...newMaterialAccess, 'all'] : newMaterialAccess
        };
      }
    });
  }

  async function handleSubmit() {
    if (planType === 'individual' && !formData.childId) {
      console.error('No child selected for individual plan!');
      return;
    }
    
    if (loading) {
      console.log('Already generating plan, ignoring duplicate request');
      return;
    }
    
    setLoading(true);
    try {
      const token = await getToken();
      
      if (planType === 'classroom' && isEducator) {
        // Generate classroom plan using educator API
        console.log('🏫 Generating classroom plan...');
        console.log('📊 Classroom data:', classroomData);
        console.log('📝 Form data:', formData);
        
        const requestBody = {
          classroomName: classroomData?.classroomName || formData.learningTheme || 'My Classroom',
          educatorName: classroomData?.educatorName || 'Educator',
          yearLevel: classroomData?.yearLevel || 'Year 3',
          state: classroomData?.state || 'NSW',
          subject: formData.focusAreas[0] || 'English',
          lessonDuration: 60,
          students: classroomData?.students || [
            // Fallback students if no classroom data
            {
              id: '1',
              firstName: 'Student 1',
              ageYears: 8,
              neurotype: 'Autism',
              strengths: ['Visual learning', 'Pattern recognition'],
              challenges: ['Social interaction', 'Transitions'],
              interests: ['Animals', 'Building'],
              sensoryNeeds: ['Quiet spaces', 'Fidget tools'],
              communicationStyle: 'Visual supports',
              learningPreferences: ['Hands-on', 'Visual'],
              accommodations: ['Extra time', 'Visual schedule']
            },
            {
              id: '2',
              firstName: 'Student 2',
              ageYears: 8,
              neurotype: 'ADHD',
              strengths: ['Creative thinking', 'Energy'],
              challenges: ['Attention', 'Organization'],
              interests: ['Sports', 'Music'],
              sensoryNeeds: ['Movement breaks', 'Fidgets'],
              communicationStyle: 'Verbal',
              learningPreferences: ['Kinesthetic', 'Auditory'],
              accommodations: ['Movement breaks', 'Clear structure']
            }
          ],
          learningObjectives: [
            'Students will engage with curriculum content through their interests',
            'Students will demonstrate learning through multiple modalities'
          ],
          availableResources: formData.materialAccess,
          classroomLayout: classroomData?.classroomLayout || 'Flexible seating with quiet corners',
          specialConsiderations: formData.specialNotes || 'Neurodiversity-affirming environment'
        };
        
        console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
        
        const classroomPlan = await apiFetch('/api/educator-plans/generate', {
          method: 'POST',
          body: requestBody,
          token
        });
        
        console.log('Classroom plan generated successfully:', classroomPlan);
        onPlanCreated((classroomPlan as any).plan);
      } else {
        // Generate individual plan using regular API
        console.log('Generating individual plan for child:', formData.childId);
        const plan = await apiFetch(`/api/plans/generate/${formData.childId}`, {
          method: 'POST',
          body: {
            context: {
              learningTheme: formData.learningTheme,
              focusAreas: formData.focusAreas,
              materialAccess: formData.materialAccess,
              learningStyles: formData.learningStyles,
              energyLevel: formData.energyLevel,
              specialNotes: formData.specialNotes
            }
          },
          token
        });
        
        console.log('Individual plan generated successfully:', plan);
        onPlanCreated(plan);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const selectedChild = children.find(c => c.id === formData.childId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-large">Create Learning Plan</h2>
            <Button
              variant="text"
              iconLeft={<MdClose size={20} />}
              onClick={onClose}
            />
          </div>

          <div className="space-y-6">
            {/* Plan Type Indicator */}
            {isEducator && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-title-medium text-purple-800 mb-2">
                  {planType === 'classroom' ? '🏫 Classroom Plan' : '👤 Individual Student Plan'}
                </h3>
                <p className="text-body-medium text-purple-700">
                  {planType === 'classroom' 
                    ? 'Creating a comprehensive plan for your entire classroom with differentiation strategies.'
                    : 'Creating a personalized plan for one student with special accommodations.'
                  }
                </p>
              </div>
            )}

            {/* Select Child - only show for individual plans */}
            {planType === 'individual' && (
              <div>
                <h3 className="text-title-medium mb-3">{isEducator ? 'Select Student' : 'Select Child'}</h3>
              <div className="grid gap-3">
                {children.map(child => (
                  <div
                    key={child.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.childId === child.id
                        ? 'border-primary bg-white shadow-md'
                        : 'border-outline hover:border-primary/50 bg-surface-container-low'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, childId: child.id }))}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-label-large">👤</span>
                      </div>
                      <div>
                        <p className="text-body-large font-medium">{child.firstName}</p>
                        <p className="text-body-small text-on-surface-variant">
                          Age {child.ageYears || 'N/A'} • {child.neurotype || 'Neurotype not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            )}

            {/* Learning Theme */}
            <div>
              <label className="block text-title-medium mb-2">
                {planType === 'classroom' ? 'Classroom Name / Theme' : 'Learning Theme'}
              </label>
              <input
                type="text"
                placeholder={planType === 'classroom' 
                  ? "e.g., Room 3B, The Explorer's Classroom, Creative Minds"
                  : "e.g., Ocean Animals, Space Exploration, Dinosaurs"
                }
                className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:outline-none"
                value={formData.learningTheme}
                onChange={(e) => setFormData(prev => ({ ...prev, learningTheme: e.target.value }))}
              />
              {planType === 'classroom' && (
                <p className="text-body-small text-on-surface-variant mt-1">
                  This will be used as your classroom identifier and can include a thematic name.
                </p>
              )}
            </div>

            {/* Focus Areas */}
            <div>
              <h3 className="text-title-medium mb-3">Focus Areas</h3>
              <div className="grid grid-cols-3 gap-2">
                {focusAreaOptions.map(area => (
                  <label key={area} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.focusAreas.includes(area)}
                      onChange={() => handleFocusAreaToggle(area)}
                      className="rounded border-outline"
                    />
                    <span className="text-body-medium">{area}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Material Access */}
            <div>
              <h3 className="text-title-medium mb-3">Material Access</h3>
              <div className="grid gap-2">
                {materialAccessOptions.map(option => (
                  <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.materialAccess.includes(option.value)}
                      onChange={() => handleMaterialAccessToggle(option.value)}
                      className="mt-1 rounded border-outline"
                    />
                    <div>
                      <p className="text-body-medium font-medium">{option.label}</p>
                      <p className="text-body-small text-on-surface-variant">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Learning Styles */}
            <div>
              <h3 className="text-title-medium mb-3">Learning Styles</h3>
              <div className="grid gap-2">
                {learningStyleOptions.map(style => (
                  <label key={style.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.learningStyles.includes(style.value)}
                      onChange={() => handleLearningStyleToggle(style.value)}
                      className="mt-1 rounded border-outline"
                    />
                    <div>
                      <p className="text-body-medium font-medium">{style.label}</p>
                      <p className="text-body-small text-on-surface-variant">{style.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Energy/Engagement Level */}
            <div>
              <h3 className="text-title-medium mb-3">Current Energy/Engagement Level</h3>
              <div className="grid gap-2">
                {energyLevelOptions.map(level => (
                  <label key={level.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="energyLevel"
                      value={level.value}
                      checked={formData.energyLevel === level.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, energyLevel: e.target.value }))}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-body-medium font-medium">{level.label}</p>
                      <p className="text-body-small text-on-surface-variant">{level.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-title-medium mb-2">Special Notes (Optional)</label>
              <textarea
                placeholder="Any special considerations, learning preferences, or materials you have available..."
                className="w-full p-3 border border-outline rounded-lg focus:border-primary focus:outline-none h-24 resize-none"
                value={formData.specialNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, specialNotes: e.target.value }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-outline">
            <Button
              variant="outlined"
              text="Cancel"
              onClick={onClose}
              disabled={loading}
            />
            <Button
              variant="filled"
              text={loading ? "Creating Plan..." : "Create Plan"}
              iconLeft={loading ? undefined : <MdCheck size={16} />}
              onClick={handleSubmit}
              disabled={loading || (planType === 'individual' && !formData.childId)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

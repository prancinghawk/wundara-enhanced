import React, { useState } from 'react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdArrowBack, MdArrowForward, MdSave, MdPerson, MdFavorite, MdSchool, MdSettings, MdClose } from 'react-icons/md';

interface WizardChildProfile {
  firstName: string;
  ageYears: number | null;
  neurotypes: string[];
  interests: string[];
  learningContext: 'homeschool' | 'classroom' | '';
  state: string;
  learningPreferences: {
    sensoryNeeds: string[];
    communicationStyle: string;
    motivators: string[];
    challenges: string[];
  };
  accommodations: string[];
  specialNotes: string;
}

interface ChildProfileWizardProps {
  onSave: (profile: any) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<WizardChildProfile>;
  isEditing?: boolean;
}

const STEPS = [
  { id: 1, title: 'Basic Info', icon: MdPerson },
  { id: 2, title: 'Neurotype', icon: MdFavorite },
  { id: 3, title: 'Interests', icon: MdSchool },
  { id: 4, title: 'Learning Style', icon: MdSettings },
  { id: 5, title: 'Review', icon: MdSave }
];

const NEUROTYPE_OPTIONS = [
  { value: 'Autism', label: 'Autism', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'ADHD', label: 'ADHD', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'PDA (Pathological Demand Avoidance)', label: 'PDA (Pathological Demand Avoidance)', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'Dyslexia', label: 'Dyslexia', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'Sensory Processing', label: 'Sensory Processing', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { value: 'Giftedness', label: 'Giftedness', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'Other', label: 'Other', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'Unsure/Exploring', label: 'Unsure/Exploring', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
];

const INTEREST_SUGGESTIONS = [
  'trains', 'dinosaurs', 'minecraft', 'lego', 'animals', 'space', 'art', 'music', 
  'cooking', 'science', 'books', 'nature', 'technology', 'sports', 'dance', 'theater',
  'ocean', 'cars', 'planes', 'robots', 'crafts', 'gardening', 'history', 'geography'
];

const AUSTRALIAN_STATES = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' }
];

export function ChildProfileWizard({ onSave, onCancel, initialData, isEditing = false }: ChildProfileWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [profile, setProfile] = useState<WizardChildProfile>({
    firstName: initialData?.firstName || '',
    ageYears: initialData?.ageYears || null,
    neurotypes: initialData?.neurotypes || [],
    interests: initialData?.interests || [],
    learningContext: initialData?.learningContext || '',
    state: initialData?.state || '',
    learningPreferences: {
      sensoryNeeds: [],
      communicationStyle: '',
      motivators: [],
      challenges: []
    },
    accommodations: [],
    specialNotes: ''
  });

  const [newInterest, setNewInterest] = useState('');

  const updateProfile = (field: keyof WizardChildProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const toggleArrayItem = (field: keyof WizardChildProfile, item: string) => {
    const currentArray = profile[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateProfile(field, newArray);
  };

  const addInterest = (interest: string) => {
    if (interest && !profile.interests.includes(interest)) {
      updateProfile('interests', [...profile.interests, interest]);
    }
    setNewInterest('');
  };

  const removeInterest = (interest: string) => {
    updateProfile('interests', profile.interests.filter(i => i !== interest));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!profile.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (profile.ageYears !== null && (profile.ageYears < 1 || profile.ageYears > 18)) {
          newErrors.ageYears = 'Age must be between 1 and 18 years';
        }
        break;
      case 3:
        if (profile.interests.length === 0) {
          newErrors.interests = 'Please add at least one interest';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      // Convert arrays to comma-separated strings for API compatibility
      const apiProfile = {
        firstName: profile.firstName,
        ageYears: profile.ageYears,
        neurotype: profile.neurotypes.join(', '),
        interests: profile.interests.join(', '),
        learningContext: profile.learningContext,
        state: profile.state
      };
      await onSave(apiProfile as any);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-title-large mb-2">Tell us about your learner</h2>
              <p className="text-body-medium text-on-surface-variant">
                This helps Wundara craft gentle, interest-led plans that fit your context. You can change anything later.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-label-large mb-2 block">
                  Child name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => updateProfile('firstName', e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-body-large focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.firstName 
                      ? 'border-error bg-error-container/10' 
                      : 'border-outline bg-surface focus:border-primary'
                  }`}
                  placeholder="e.g. Ari"
                />
                {errors.firstName && (
                  <p className="mt-1 text-body-small text-error">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="text-label-large mb-2 block">Age</label>
                <select
                  value={profile.ageYears || ''}
                  onChange={(e) => updateProfile('ageYears', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-large focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">e.g. 7</option>
                  {Array.from({ length: 18 }, (_, i) => i + 1).map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-label-large mb-2 block">Learning context</label>
                <select
                  value={profile.learningContext}
                  onChange={(e) => updateProfile('learningContext', e.target.value)}
                  className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-large focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Homeschool</option>
                  <option value="homeschool">Homeschool</option>
                  <option value="classroom">Classroom</option>
                </select>
              </div>

              <div>
                <label className="text-label-large mb-2 block">State (AU)</label>
                <select
                  value={profile.state}
                  onChange={(e) => updateProfile('state', e.target.value)}
                  className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-large focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">ACT</option>
                  {AUSTRALIAN_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdFavorite size={32} className="text-green-600" />
              </div>
              <h2 className="text-title-large mb-2">Understanding Neurotype</h2>
              <p className="text-body-medium text-on-surface-variant">
                Select all that apply to your child (you can select multiple or none)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {NEUROTYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    profile.neurotypes.includes(option.value)
                      ? option.color
                      : 'border-outline hover:bg-surface-container-low'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={profile.neurotypes.includes(option.value)}
                    onChange={() => toggleArrayItem('neurotypes', option.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    profile.neurotypes.includes(option.value)
                      ? 'bg-current border-current text-white'
                      : 'border-outline'
                  }`}>
                    {profile.neurotypes.includes(option.value) && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-body-medium font-medium">{option.label}</span>
                </label>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-body-small text-blue-800">
                <strong>Don't worry if you're unsure!</strong> Our platform is designed to work with all learning styles. 
                You can always update this information later as you learn more about your child's needs.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-title-large mb-2">Interests</h2>
              <p className="text-body-medium text-on-surface-variant">
                Type and press Enter
              </p>
            </div>

            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInterest(newInterest);
                    }
                  }}
                  className="flex-1 rounded-lg border border-outline bg-surface px-4 py-3 text-body-large focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Lego, ocean, cats"
                />
                <Button
                  type="button"
                  variant="outlined"
                  text="Add"
                  onClick={() => addInterest(newInterest)}
                  disabled={!newInterest.trim()}
                />
              </div>

              {/* Selected Interests */}
              {profile.interests.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-body-small"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="ml-1 hover:bg-primary/20 rounded-full p-1"
                        >
                          <MdClose size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interest Suggestions */}
              <div>
                <p className="text-label-medium mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_SUGGESTIONS
                    .filter(suggestion => !profile.interests.includes(suggestion))
                    .slice(0, 12)
                    .map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => addInterest(suggestion)}
                        className="px-3 py-1 text-body-small border border-outline rounded-full hover:bg-surface-container-low transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                </div>
              </div>

              {errors.interests && (
                <p className="mt-2 text-body-small text-error">{errors.interests}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-title-large mb-2">Learning Preferences</h2>
              <p className="text-body-medium text-on-surface-variant">
                Help us understand how your child learns best (all optional)
              </p>
            </div>

            <div>
              <label className="text-label-large mb-2 block">Special Notes (Optional)</label>
              <textarea
                value={profile.specialNotes}
                onChange={(e) => updateProfile('specialNotes', e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-large focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Any special considerations, learning preferences, or materials you have available..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-title-large mb-2">Review Profile</h2>
              <p className="text-body-medium text-on-surface-variant">
                Please review the information before saving
              </p>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-title-medium mb-2">Basic Information</h3>
                <p><strong>Name:</strong> {profile.firstName}</p>
                {profile.ageYears && <p><strong>Age:</strong> {profile.ageYears} years</p>}
                {profile.learningContext && <p><strong>Learning Context:</strong> {profile.learningContext}</p>}
                {profile.state && <p><strong>State:</strong> {profile.state}</p>}
              </Card>

              {profile.neurotypes.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-title-medium mb-2">Neurotype</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.neurotypes.map((neurotype) => (
                      <span key={neurotype} className="bg-primary/10 text-primary px-2 py-1 rounded text-body-small">
                        {neurotype}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="p-4">
                <h3 className="text-title-medium mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span key={interest} className="bg-secondary/10 text-secondary px-2 py-1 rounded text-body-small">
                      {interest}
                    </span>
                  ))}
                </div>
              </Card>

              {profile.specialNotes && (
                <Card className="p-4">
                  <h3 className="text-title-medium mb-2">Special Notes</h3>
                  <p className="text-body-medium">{profile.specialNotes}</p>
                </Card>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            iconLeft={<MdArrowBack size={20} />}
            text="Back"
            onClick={onCancel}
          />
          <div>
            <h1 className="text-display-small">
              {isEditing ? 'Edit Profile' : 'Create Your Child\'s Learning Profile'}
            </h1>
            <p className="text-body-large text-on-surface-variant">
              Help us understand your child's unique learning style and interests
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body-small text-on-surface-variant">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-body-small text-on-surface-variant">
            {Math.round((currentStep / STEPS.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isActive 
                    ? 'bg-primary text-on-primary' 
                    : isCompleted 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-surface-container text-on-surface-variant'
                }`}>
                  <Icon size={20} />
                </div>
                <span className={`text-body-small ${
                  isActive ? 'text-primary font-medium' : 'text-on-surface-variant'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8">
        {renderStepContent()}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outlined"
          text="Back"
          onClick={prevStep}
          disabled={currentStep === 1}
        />
        
        <div className="flex gap-2">
          {currentStep < STEPS.length ? (
            <Button
              variant="filled"
              iconRight={<MdArrowForward size={20} />}
              text="Next"
              onClick={nextStep}
            />
          ) : (
            <Button
              variant="filled"
              iconLeft={<MdSave size={20} />}
              text={loading ? 'Saving...' : (isEditing ? 'Update Profile' : 'Create Profile')}
              onClick={handleSubmit}
              disabled={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

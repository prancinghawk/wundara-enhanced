import React, { useState } from 'react';
import { Card } from '../ui/components/cards/Card';
import { Button } from '../ui/components/button/common-button/Button';
import { MdArrowBack, MdSave, MdPerson, MdSchool, MdLocationOn, MdFavorite } from 'react-icons/md';

interface ChildProfile {
  firstName: string;
  ageYears: number | null;
  neurotype: string;
  interests: string;
  learningContext: 'homeschool' | 'classroom' | '';
  state: string;
}

interface ChildProfileFormProps {
  onSave: (profile: ChildProfile) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ChildProfile>;
  isEditing?: boolean;
}

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

const NEUROTYPE_OPTIONS = [
  'Autistic',
  'ADHD',
  'Autistic + ADHD',
  'PDA (Pathological Demand Avoidance)',
  'Dyslexic',
  'Dyspraxic',
  'Highly Sensitive',
  'Gifted/2e',
  'Other neurodivergent',
  'Neurotypical',
  'Unsure/Exploring'
];

export function ChildProfileForm({ onSave, onCancel, initialData, isEditing = false }: ChildProfileFormProps) {
  const [profile, setProfile] = useState<ChildProfile>({
    firstName: initialData?.firstName || '',
    ageYears: initialData?.ageYears || null,
    neurotype: initialData?.neurotype || '',
    interests: initialData?.interests || '',
    learningContext: initialData?.learningContext || '',
    state: initialData?.state || ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profile.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (profile.ageYears !== null && (profile.ageYears < 1 || profile.ageYears > 18)) {
      newErrors.ageYears = 'Age must be between 1 and 18 years';
    }

    if (!profile.interests.trim()) {
      newErrors.interests = 'Please share at least one interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(profile);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (field: keyof ChildProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
              {isEditing ? 'Edit Profile' : 'Create Child Profile'}
            </h1>
            <p className="text-body-large text-on-surface-variant">
              {isEditing 
                ? 'Update your child\'s information to keep plans personalized' 
                : 'Tell us about your child to create personalized learning experiences'
              }
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MdPerson size={20} className="text-primary" />
            <h2 className="text-title-large">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* First Name */}
            <div>
              <label className="text-label-large mb-2 block">
                First Name <span className="text-error">*</span>
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
                placeholder="Enter your child's first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-body-small text-error">{errors.firstName}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="text-label-large mb-2 block">Age (years)</label>
              <input
                type="number"
                min="1"
                max="18"
                value={profile.ageYears || ''}
                onChange={(e) => updateProfile('ageYears', e.target.value ? parseInt(e.target.value) : null)}
                className={`w-full rounded-lg border px-4 py-3 text-body-large focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.ageYears 
                    ? 'border-error bg-error-container/10' 
                    : 'border-outline bg-surface focus:border-primary'
                }`}
                placeholder="Age in years"
              />
              {errors.ageYears && (
                <p className="mt-1 text-body-small text-error">{errors.ageYears}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Neurodiversity & Learning */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MdFavorite size={20} className="text-primary" />
            <h2 className="text-title-large">Neurodiversity & Learning Style</h2>
          </div>

          <div className="space-y-4">
            {/* Neurotype */}
            <div>
              <label className="text-label-large mb-2 block">Neurotype</label>
              <select
                value={profile.neurotype}
                onChange={(e) => updateProfile('neurotype', e.target.value)}
                className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-large focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select neurotype (optional)</option>
                {NEUROTYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <p className="mt-1 text-body-small text-on-surface-variant">
                This helps us create more personalized and affirming learning experiences
              </p>
            </div>

            {/* Learning Context */}
            <div>
              <label className="text-label-large mb-2 block">Learning Context</label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-lg border border-outline p-4 cursor-pointer hover:bg-surface-container-low">
                  <input
                    type="radio"
                    name="learningContext"
                    value="homeschool"
                    checked={profile.learningContext === 'homeschool'}
                    onChange={(e) => updateProfile('learningContext', e.target.value)}
                    className="text-primary"
                  />
                  <div>
                    <p className="text-body-medium font-medium">Homeschool</p>
                    <p className="text-body-small text-on-surface-variant">Learning at home</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-outline p-4 cursor-pointer hover:bg-surface-container-low">
                  <input
                    type="radio"
                    name="learningContext"
                    value="classroom"
                    checked={profile.learningContext === 'classroom'}
                    onChange={(e) => updateProfile('learningContext', e.target.value)}
                    className="text-primary"
                  />
                  <div>
                    <p className="text-body-medium font-medium">Classroom</p>
                    <p className="text-body-small text-on-surface-variant">Traditional or alternative school</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Interests & Location */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MdSchool size={20} className="text-primary" />
            <h2 className="text-title-large">Interests & Location</h2>
          </div>

          <div className="space-y-4">
            {/* Interests */}
            <div>
              <label className="text-label-large mb-2 block">
                Interests & Passions <span className="text-error">*</span>
              </label>
              <textarea
                value={profile.interests}
                onChange={(e) => updateProfile('interests', e.target.value)}
                rows={4}
                className={`w-full rounded-lg border px-4 py-3 text-body-large focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.interests 
                    ? 'border-error bg-error-container/10' 
                    : 'border-outline bg-surface focus:border-primary'
                }`}
                placeholder="Tell us what your child loves! (e.g., dinosaurs, art, music, building, cooking, animals, space, etc.)"
              />
              {errors.interests && (
                <p className="mt-1 text-body-small text-error">{errors.interests}</p>
              )}
              <p className="mt-1 text-body-small text-on-surface-variant">
                The more specific, the better! This helps us create engaging, personalized learning plans.
              </p>
            </div>

            {/* State */}
            <div>
              <label className="text-label-large mb-2 block">
                <MdLocationOn size={16} className="inline mr-1" />
                Australian State/Territory
              </label>
              <select
                value={profile.state}
                onChange={(e) => updateProfile('state', e.target.value)}
                className="w-full rounded-lg border border-outline bg-surface px-4 py-3 text-body-large focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select state/territory (optional)</option>
                {AUSTRALIAN_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name} ({state.code})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-body-small text-on-surface-variant">
                Helps us align with your local curriculum standards
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outlined"
            text="Cancel"
            onClick={onCancel}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="filled"
            iconLeft={<MdSave size={20} />}
            text={loading ? 'Saving...' : (isEditing ? 'Update Profile' : 'Create Profile')}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}

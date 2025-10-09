import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function AccountTypeSelection() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedType, setSelectedType] = useState<'homeschool' | 'classroom' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountTypeSelection = async (accountType: 'homeschool' | 'classroom') => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update user metadata with account type
      await (user as any).update({
        publicMetadata: {
          ...(user as any).publicMetadata,
          accountType,
          onboardingComplete: false
        }
      });

      // Navigate to appropriate onboarding flow
      if (accountType === 'homeschool') {
        navigate('/onboarding/homeschool');
      } else {
        navigate('/onboarding/classroom');
      }
    } catch (error) {
      console.error('Failed to update account type:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Wundara! 🌟
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Let's personalize your experience
          </p>
          <p className="text-gray-500">
            Choose the option that best describes your learning environment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Homeschool Option */}
          <div 
            className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 rounded-lg ${
              selectedType === 'homeschool' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedType('homeschool')}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Homeschool Parent
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I'm a parent, carer, or tutor supporting neurodivergent children at home. 
                I want personalized learning plans that honor my child's unique interests and needs.
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">Individual child profiles</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">Interest-based learning plans</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">Flexible scheduling</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">Parent support resources</span>
                </div>
              </div>

              {selectedType === 'homeschool' && (
                <button
                  onClick={() => handleAccountTypeSelection('homeschool')}
                  disabled={isLoading}
                  className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Setting up...' : 'Continue as Homeschool Parent'}
                </button>
              )}
            </div>
          </div>

          {/* Classroom Option */}
          <div 
            className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 rounded-lg ${
              selectedType === 'classroom' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setSelectedType('classroom')}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🏫</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Educator/Teacher
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I'm a teacher, educator, or therapist working with neurodivergent students in 
                classroom settings. I need tools to manage diverse learning needs simultaneously.
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">Classroom management tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">Multi-student planning</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">Differentiation strategies</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">Assessment tools</span>
                </div>
              </div>

              {selectedType === 'classroom' && (
                <button
                  onClick={() => handleAccountTypeSelection('classroom')}
                  disabled={isLoading}
                  className="w-full mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Setting up...' : 'Continue as Educator'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Don't worry - you can always change this later in your account settings
          </p>
        </div>
      </div>
    </div>
  );
}

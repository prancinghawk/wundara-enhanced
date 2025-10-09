import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function SimpleAccountTypeSelection() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountTypeSelection = async (accountType: 'homeschool' | 'classroom') => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      console.log('Setting account type to:', accountType);
      
      // Try using unsafeMetadata instead of publicMetadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          accountType,
          onboardingComplete: true // Skip onboarding for now
        }
      });

      console.log('Account type updated successfully, navigating to dashboard...');
      
      // Navigate directly to dashboard for testing
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update account type:', error);
      console.error('Error details:', error);
      
      // Fallback: Just navigate based on selection without storing metadata
      console.log('Fallback: Navigating directly based on selection');
      if (accountType === 'classroom') {
        // For now, just show a simple educator page
        navigate('/educator-temp');
      } else {
        navigate('/dashboard');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Wundara! 🌟
          </h1>
          <p className="text-lg text-gray-600">
            Choose your learning environment
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleAccountTypeSelection('homeschool')}
            disabled={isLoading}
            className="w-full p-6 text-left border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🏠</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Homeschool Parent</h3>
                <p className="text-gray-600">Supporting neurodivergent children at home</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleAccountTypeSelection('classroom')}
            disabled={isLoading}
            className="w-full p-6 text-left border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🏫</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Educator/Teacher</h3>
                <p className="text-gray-600">Managing diverse learning needs in classrooms</p>
              </div>
            </div>
          </button>
        </div>

        {isLoading && (
          <div className="text-center mt-6">
            <p className="text-gray-600">Setting up your account...</p>
          </div>
        )}
      </div>
    </div>
  );
}

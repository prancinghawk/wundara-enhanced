import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
// Using simple HTML elements instead of complex UI components

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function HomeschoolOnboarding() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Your Homeschool Journey',
      description: 'Learn how Wundara supports neurodivergent homeschooling',
      completed: false
    },
    {
      id: 'child-profiles',
      title: 'Create Child Profiles',
      description: 'Tell us about your children and their unique needs',
      completed: false
    },
    {
      id: 'preferences',
      title: 'Set Your Preferences',
      description: 'Customize your learning approach and materials',
      completed: false
    },
    {
      id: 'first-plan',
      title: 'Generate Your First Plan',
      description: 'Create a personalized learning plan',
      completed: false
    }
  ];

  const handleCompleteOnboarding = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      await user.update({
        publicMetadata: {
          ...user.publicMetadata,
          onboardingComplete: true
        }
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setIsLoading(false);
    }
  };

  const renderWelcomeStep = () => (
    <div className="text-center">
      <div className="text-6xl mb-6">🌟</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to Wundara Homeschool!
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        We're here to support you on your neurodivergent homeschooling journey. 
        Wundara creates personalized learning plans that honor your child's unique 
        interests, strengths, and learning style.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-blue-50 rounded-lg">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-semibold text-gray-900 mb-2">Interest-Led Learning</h3>
          <p className="text-sm text-gray-600">
            Every plan starts with your child's passions and builds learning around what they love
          </p>
        </div>
        
        <div className="p-6 bg-green-50 rounded-lg">
          <div className="text-3xl mb-3">🧠</div>
          <h3 className="font-semibold text-gray-900 mb-2">Neurodiversity-Affirming</h3>
          <p className="text-sm text-gray-600">
            Designed specifically for autistic, ADHD, PDA, and other neurodivergent learners
          </p>
        </div>
        
        <div className="p-6 bg-purple-50 rounded-lg">
          <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
          <h3 className="font-semibold text-gray-900 mb-2">Parent Support</h3>
          <p className="text-sm text-gray-600">
            Comprehensive guidance, declarative language, and co-regulation strategies
          </p>
        </div>
      </div>
      
      <Button 
        onClick={() => setCurrentStep(1)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Let's Get Started!
      </Button>
    </div>
  );

  const renderChildProfilesStep = () => (
    <div className="text-center">
      <div className="text-6xl mb-6">👶</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Tell Us About Your Children
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Creating detailed profiles helps us generate learning plans that truly 
        fit each child's unique needs, interests, and learning style.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <span className="text-yellow-600 text-xl">💡</span>
          <div className="text-left">
            <h4 className="font-semibold text-yellow-800 mb-2">What we'll ask about:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Basic information (name, age)</li>
              <li>• Neurotype and learning context</li>
              <li>• Interests and passions</li>
              <li>• Learning preferences and sensory needs</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(0)}
        >
          Back
        </Button>
        <Button 
          onClick={() => navigate('/profiles')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Child Profiles
        </Button>
      </div>
    </div>
  );

  const renderPreferencesStep = () => (
    <div className="text-center">
      <div className="text-6xl mb-6">⚙️</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Customize Your Experience
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Set your preferences for materials, learning styles, and planning approach 
        to make Wundara work perfectly for your family.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
        <div className="p-6 bg-gray-50 rounded-lg text-left">
          <h4 className="font-semibold text-gray-900 mb-3">Material Preferences</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• What materials do you have access to?</li>
            <li>• Indoor vs outdoor activities</li>
            <li>• Technology integration level</li>
            <li>• Budget considerations</li>
          </ul>
        </div>
        
        <div className="p-6 bg-gray-50 rounded-lg text-left">
          <h4 className="font-semibold text-gray-900 mb-3">Learning Approach</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Structured vs flexible scheduling</li>
            <li>• Subject integration preferences</li>
            <li>• Assessment and documentation style</li>
            <li>• Family learning goals</li>
          </ul>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(1)}
        >
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep(3)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Set Preferences Later
        </Button>
      </div>
    </div>
  );

  const renderFirstPlanStep = () => (
    <div className="text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        You're All Set!
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Your homeschool dashboard is ready! You can now create personalized learning 
        plans, track progress, and access all the support resources you need.
      </p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 justify-center">
          <span className="text-green-600 text-xl">🌟</span>
          <p className="text-green-800 font-medium">
            Ready to create your first learning plan?
          </p>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(2)}
        >
          Back
        </Button>
        <Button 
          onClick={handleCompleteOnboarding}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Setting up dashboard...' : 'Go to Dashboard'}
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderWelcomeStep();
      case 1: return renderChildProfilesStep();
      case 2: return renderPreferencesStep();
      case 3: return renderFirstPlanStep();
      default: return renderWelcomeStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-8">
          {renderCurrentStep()}
        </Card>
      </div>
    </div>
  );
}

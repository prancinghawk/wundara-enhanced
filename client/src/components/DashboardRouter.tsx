import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

interface UserMetadata {
  accountType?: 'homeschool' | 'classroom';
  onboardingComplete?: boolean;
}

export default function DashboardRouter() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      console.log('DashboardRouter: No user, redirecting to sign-in');
      navigate('/sign-in');
      return;
    }

    const publicMetadata = user.publicMetadata as UserMetadata;
    const unsafeMetadata = user.unsafeMetadata as UserMetadata;
    const metadata = { ...publicMetadata, ...unsafeMetadata }; // Merge both metadata sources
    console.log('DashboardRouter: Public metadata:', publicMetadata);
    console.log('DashboardRouter: Unsafe metadata:', unsafeMetadata);
    console.log('DashboardRouter: Combined metadata:', metadata);
    
    // If no account type is set, redirect to account type selection
    if (!metadata.accountType) {
      console.log('DashboardRouter: No account type, redirecting to account-type');
      navigate('/account-type');
      return;
    }

    // If onboarding is not complete, redirect to appropriate onboarding
    if (!metadata.onboardingComplete) {
      console.log('DashboardRouter: Onboarding not complete, redirecting to onboarding');
      if (metadata.accountType === 'homeschool') {
        navigate('/onboarding/homeschool');
      } else {
        navigate('/onboarding/classroom');
      }
      return;
    }

    console.log('DashboardRouter: All checks passed, showing dashboard for account type:', metadata.accountType);
    setIsChecking(false);
  }, [user, isLoaded, navigate]);

  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  const publicMetadata = user.publicMetadata as UserMetadata;
  const unsafeMetadata = user.unsafeMetadata as UserMetadata;
  const metadata = { ...publicMetadata, ...unsafeMetadata };

  // Both account types use the same dashboard UI
  // The difference is in the plan creation and child profile functionality
  return <Dashboard />;
}

import React from 'react';
import { useUser } from '@clerk/clerk-react';
import ChildProfiles from '../pages/ChildProfiles';
import ClassroomProfiles from '../pages/ClassroomProfiles';

export default function ProfilesRouter() {
  const { user } = useUser();
  
  // Get account type from user metadata (check both public and unsafe metadata, and localStorage fallback)
  const accountType = (
    user?.publicMetadata?.accountType || 
    user?.unsafeMetadata?.accountType || 
    localStorage.getItem('debug_accountType')
  ) as 'homeschool' | 'classroom' | undefined;
  
  // Debug logging
  console.log('ProfilesRouter - Public metadata:', user?.publicMetadata);
  console.log('ProfilesRouter - Unsafe metadata:', user?.unsafeMetadata);
  console.log('ProfilesRouter - Account type:', accountType);
  
  // Route to appropriate profiles page based on account type
  if (accountType === 'classroom') {
    return <ClassroomProfiles />;
  } else {
    // Default to homeschool profiles (includes undefined case)
    return <ChildProfiles />;
  }
}

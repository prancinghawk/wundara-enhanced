import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Button } from '../../ui/components/button/common-button/Button';
import { MdAccountCircle, MdLogout, MdExpandMore, MdExpandLess } from 'react-icons/md';

// Development fallback component
function DevUserProfile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low transition-colors"
      >
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
          <MdAccountCircle size={20} className="text-primary" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-body-medium font-medium">Dev User</p>
          <p className="text-body-small text-on-surface-variant">development@wundara.com</p>
        </div>
        {isOpen ? <MdExpandLess size={16} /> : <MdExpandMore size={16} />}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container border border-outline rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-outline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <MdAccountCircle size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-body-large font-medium">Dev User</p>
                  <p className="text-body-small text-on-surface-variant">development@wundara.com</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <Button
                variant="text"
                text="Sign Out (Dev)"
                iconLeft={<MdLogout size={16} />}
                onClick={() => console.log('Dev sign out')}
                className="w-full justify-start"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function UserProfile() {
  // Check if Clerk is configured
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  // If no Clerk key, show development profile
  if (!PUBLISHABLE_KEY) {
    return <DevUserProfile />;
  }

  try {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return <DevUserProfile />;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container-low transition-colors"
      >
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
          {user.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt={user.fullName || user.emailAddresses[0]?.emailAddress || 'User'} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <MdAccountCircle size={20} className="text-primary" />
          )}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-body-medium font-medium">
            {user.fullName || user.firstName || 'User'}
          </p>
          <p className="text-body-small text-on-surface-variant">
            {user.emailAddresses[0]?.emailAddress}
          </p>
        </div>
        {isOpen ? <MdExpandLess size={16} /> : <MdExpandMore size={16} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container border border-outline rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-outline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  {user.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.fullName || user.emailAddresses[0]?.emailAddress || 'User'} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <MdAccountCircle size={24} className="text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-body-large font-medium">
                    {user.fullName || user.firstName || 'User'}
                  </p>
                  <p className="text-body-small text-on-surface-variant">
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <Button
                variant="text"
                text="Sign Out"
                iconLeft={<MdLogout size={16} />}
                onClick={handleSignOut}
                className="w-full justify-start"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
  } catch (error) {
    // If Clerk hooks fail, fall back to development profile
    console.warn('⚠️ Clerk user profile failed - falling back to development mode:', error);
    return <DevUserProfile />;
  }
}

import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/components/button/common-button/Button';
import { MdClose, MdBugReport, MdMinimize, MdMaximize, MdHome, MdSchool, MdPerson, MdAssignment } from 'react-icons/md';

export default function AccountTypeDebugger() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const setAccountType = async (type: 'homeschool' | 'classroom') => {
    try {
      // Try using unsafeMetadata first
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          accountType: type
        }
      });
      
      // Refresh the page to see changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating account type via Clerk:', error);
      
      // Fallback: Use localStorage for testing
      localStorage.setItem('debug_accountType', type);
      alert(`Set account type to ${type} via localStorage. Refresh the page.`);
      window.location.reload();
    }
  };

  const currentAccountType = (user?.publicMetadata?.accountType || user?.unsafeMetadata?.accountType) as string;

  // Quick navigation options
  const navigationOptions = [
    { path: '/dashboard', label: 'Dashboard', icon: MdHome },
    { path: '/profiles', label: 'Profiles', icon: MdPerson },
    { path: '/create-classroom', label: 'Create Classroom', icon: MdSchool },
    { path: '/plans', label: 'Plans', icon: MdAssignment },
  ];

  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        className="fixed bottom-4 right-4 bg-surface-container p-2 rounded-full shadow-lg border border-outline z-50 hover:bg-surface-container-high transition-colors"
        title="Show Debug Panel"
      >
        <MdBugReport size={20} className="text-primary" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-surface-container rounded-lg shadow-lg border border-outline z-50 max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <MdBugReport size={16} className="text-primary" />
          <span className="text-body-small font-medium">Debug Panel</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-surface-container-high rounded transition-colors"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <MdMaximize size={16} /> : <MdMinimize size={16} />}
          </button>
          <button
            onClick={() => setIsHidden(true)}
            className="p-1 hover:bg-surface-container-high rounded transition-colors"
            title="Hide Panel"
          >
            <MdClose size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-3 space-y-4">
          {/* Account Type Section */}
          <div>
            <div className="text-body-small font-medium mb-2">Account Type</div>
            <div className="text-body-small mb-3 text-on-surface-variant">
              Current: <span className="font-medium">{currentAccountType || 'undefined'}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                text="Homeschool"
                onClick={() => setAccountType('homeschool')}
                className="text-xs flex-1"
              />
              <Button
                variant="filled"
                text="Classroom"
                onClick={() => setAccountType('classroom')}
                className="text-xs flex-1"
              />
            </div>
          </div>

          {/* Navigation Section */}
          <div>
            <div className="text-body-small font-medium mb-2">Quick Navigation</div>
            <div className="text-body-small mb-2 text-on-surface-variant">
              Current: <span className="font-medium">{location.pathname}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {navigationOptions.map((option) => (
                <button
                  key={option.path}
                  onClick={() => navigate(option.path)}
                  className={`flex items-center gap-2 p-2 text-xs rounded transition-colors ${
                    location.pathname === option.path
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-surface-container-high'
                  }`}
                >
                  <option.icon size={14} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Environment Info */}
          <div>
            <div className="text-body-small font-medium mb-2">Environment</div>
            <div className="text-xs text-on-surface-variant space-y-1">
              <div>User ID: {user?.id?.slice(0, 8)}...</div>
              <div>Email: {user?.primaryEmailAddress?.emailAddress}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

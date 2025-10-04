import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { NavigationDrawerIn } from '../ui/components/navigation-drawer/NavigationDrawerIn';
import { MdDashboard, MdAssignment, MdTimeline, MdLibraryBooks, MdGroups, MdCalendarMonth, MdChat, MdPerson } from 'react-icons/md';
import { UserProfile } from '../components/auth/UserProfile';
import WundaraLogo from '../assets/wundara-logo.png';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export default function AppShell() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="flex h-screen bg-surface-container-low">
      {/* Left Nav */}
      <NavigationDrawerIn isVisible className="hidden md:flex">
        <div className="px-3 pb-6">
          <div className="flex items-center gap-2 px-2 py-3">
            <img src={WundaraLogo} alt="Wundara" className="h-12 w-auto max-w-full" />
          </div>
        </div>
        <NavigationDrawerIn.Item
          url="/dashboard"
          leftElement={<MdDashboard size={20} />}
          label="Dashboard"
          rightElement={isActive(pathname, '/dashboard') ? '•' : undefined}
        />
        <NavigationDrawerIn.Item
          url="/plans"
          leftElement={<MdAssignment size={20} />}
          label="Current Plan"
          rightElement={isActive(pathname, '/plans') ? '•' : undefined}
        />
        <NavigationDrawerIn.Item
          url="/progress"
          leftElement={<MdTimeline size={20} />}
          label="Progress"
          rightElement={isActive(pathname, '/progress') ? '•' : undefined}
        />
        <NavigationDrawerIn.Item
          url="/profiles"
          leftElement={<MdPerson size={20} />}
          label="Child Profiles"
          rightElement={isActive(pathname, '/profiles') ? '•' : undefined}
        />
        <NavigationDrawerIn.Item
          url="/library"
          leftElement={<MdLibraryBooks size={20} />}
          label="Activity Library"
          rightElement={isActive(pathname, '/library') ? '•' : undefined}
        />
        <NavigationDrawerIn.Item
          url="/community"
          leftElement={<MdGroups size={20} />}
          label="Community"
          rightElement={isActive(pathname, '/community') ? '•' : undefined}
        />
        <NavigationDrawerIn.Item
          url="/calendar"
          leftElement={<MdCalendarMonth size={20} />}
          label="Calendar"
          rightElement={isActive(pathname, '/calendar') ? '•' : undefined}
        />
        <NavigationDrawerIn.Item
          url="/chat"
          leftElement={<MdChat size={20} />}
          label="AI Chat"
          rightElement={isActive(pathname, '/chat') ? '•' : undefined}
        />
        
        {/* User Profile at bottom */}
        <div className="mt-auto pt-4 border-t border-outline">
          <div className="px-3">
            <UserProfile />
          </div>
        </div>
      </NavigationDrawerIn>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

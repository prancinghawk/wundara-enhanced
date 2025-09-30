import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layout/AppShell';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import WeeklyPlanView from './pages/WeeklyPlanView';
import DailyActivityView from './pages/DailyActivityView';
import Progress from './pages/Progress';
import ChildProfiles from './pages/ChildProfiles';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="plans" element={<Plans />} />
        <Route path="plans/:planId" element={<WeeklyPlanView />} />
        <Route path="plans/:planId/day/:dayIndex" element={<DailyActivityView />} />
        <Route path="progress" element={<Progress />} />
        <Route path="profiles" element={<ChildProfiles />} />
        <Route path="library" element={<div className="p-6"><h1 className="text-title-large">Activity Library</h1><p className="text-body-medium text-on-surface-variant">Coming soon...</p></div>} />
        <Route path="community" element={<div className="p-6"><h1 className="text-title-large">Community</h1><p className="text-body-medium text-on-surface-variant">Coming soon...</p></div>} />
        <Route path="calendar" element={<div className="p-6"><h1 className="text-title-large">Calendar</h1><p className="text-body-medium text-on-surface-variant">Coming soon...</p></div>} />
        <Route path="chat" element={<div className="p-6"><h1 className="text-title-large">AI Chat</h1><p className="text-body-medium text-on-surface-variant">Coming soon...</p></div>} />
      </Route>
      <Route path="*" element={<div className="flex h-screen items-center justify-center"><div className="text-center"><h1 className="text-title-large mb-2">Page Not Found</h1><p className="text-body-medium text-on-surface-variant">The page you're looking for doesn't exist.</p></div></div>} />
    </Routes>
  );
}

export default App;

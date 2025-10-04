import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layout/AppShell';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import WeeklyPlanView from './pages/WeeklyPlanView';
import DailyActivityView from './pages/DailyActivityView';
import Progress from './pages/Progress';
import ChildProfiles from './pages/ChildProfiles';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      
      {/* Email Verification Routes */}
      <Route path="/sign-up/verify-email-address" element={<SignUp />} />
      <Route path="/sign-in/verify-email-address" element={<SignIn />} />
      <Route path="/verify-email" element={<SignUp />} />
      
      {/* OAuth Callback Routes */}
      <Route path="/sso-callback" element={<Navigate to="/dashboard" replace />} />
      <Route path="/oauth-callback" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth/callback" element={<Navigate to="/dashboard" replace />} />
      
      {/* Protected App Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }>
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
      
      {/* 404 Route */}
      <Route path="*" element={<div className="flex h-screen items-center justify-center"><div className="text-center"><h1 className="text-title-large mb-2">Page Not Found</h1><p className="text-body-medium text-on-surface-variant">The page you're looking for doesn't exist.</p></div></div>} />
    </Routes>
  );
}

export default App;

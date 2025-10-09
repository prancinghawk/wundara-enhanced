import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layout/AppShell';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import WeeklyPlanView from './pages/WeeklyPlanView';
import DailyActivityView from './pages/DailyActivityView';
import ClassroomActivityView from './pages/ClassroomActivityView';
import Progress from './pages/Progress';
import ChildProfiles from './pages/ChildProfiles';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SimpleAccountTypeSelection from './pages/SimpleAccountTypeSelection';
import HomeschoolOnboarding from './pages/onboarding/HomeschoolOnboarding';
import ClassroomOnboarding from './pages/onboarding/ClassroomOnboarding';
import DashboardRouter from './components/DashboardRouter';
import ProfilesRouter from './components/ProfilesRouter';
import CreateClassroomPlan from './pages/CreateClassroomPlan';
import Handler from './pages/Handler';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Stack Auth Handler Routes */}
      <Route path="/handler/*" element={<Handler />} />
      
      {/* Public Authentication Routes */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      
      {/* Account Setup Routes */}
      <Route path="/account-type" element={
        <ProtectedRoute>
          <SimpleAccountTypeSelection />
        </ProtectedRoute>
      } />
      <Route path="/onboarding/homeschool" element={
        <ProtectedRoute>
          <HomeschoolOnboarding />
        </ProtectedRoute>
      } />
      <Route path="/onboarding/classroom" element={
        <ProtectedRoute>
          <ClassroomOnboarding />
        </ProtectedRoute>
      } />
      
      {/* Clerk Authentication Sub-routes (factor-one, factor-two, verify-email, etc.) */}
      <Route path="/sign-in/*" element={<SignIn />} />
      <Route path="/sign-up/*" element={<SignUp />} />
      
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
        <Route path="dashboard" element={<DashboardRouter />} />
        <Route path="plans" element={<Plans />} />
        <Route path="plans/:planId" element={<WeeklyPlanView />} />
        <Route path="plans/:planId/day/:dayIndex" element={<DailyActivityView />} />
        <Route path="plans/:planId/activity/:activityIndex" element={<ClassroomActivityView />} />
        <Route path="progress" element={<Progress />} />
        <Route path="profiles" element={<ProfilesRouter />} />
        <Route path="create-classroom" element={<CreateClassroomPlan />} />
        <Route path="library" element={<div className="p-6"><h1 className="text-title-large">Activity Library</h1><p className="text-body-medium text-on-surface-variant">Coming soon...</p></div>} />
        <Route path="community" element={<div className="p-6"><h1 className="text-title-large">Community</h1><p className="text-body-medium text-on-surface-variant">Coming soon...</p></div>} />
        <Route path="calendar" element={<div className="p-6"><h1 className="text-title-large">Calendar</h1><p className="text-body-medium text-on-surface-variant">Coming soon...</p></div>} />
        <Route path="chat" element={<div className="p-6"><h1 className="text-title-large">AI Chat</h1><p className="text-body-medium text-on-surface-variant">Coming soon...</p></div>} />
      </Route>
      
      {/* Temporary Educator Route */}
      <Route path="/educator-temp" element={
        <ProtectedRoute>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🎉 Educator Account Working!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your educator account selection is working correctly. This is a temporary page to confirm the flow.
            </p>
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                ✅ <strong>Success!</strong> You successfully selected "Educator" and the system routed you here.
              </p>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                📚 The full educator dashboard with classroom management tools will be integrated here.
              </p>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<div className="flex h-screen items-center justify-center"><div className="text-center"><h1 className="text-title-large mb-2">Page Not Found</h1><p className="text-body-medium text-on-surface-variant">The page you're looking for doesn't exist.</p></div></div>} />
    </Routes>
  );
}

export default App;

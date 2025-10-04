import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if Clerk is configured
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  // If no Clerk key, allow access in development mode
  if (!PUBLISHABLE_KEY) {
    console.warn('⚠️ No Clerk configuration - allowing access in development mode');
    return <>{children}</>;
  }

  try {
    const { isLoaded, isSignedIn } = useAuth();

    // Show loading while Clerk is initializing
    if (!isLoaded) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-body-medium text-on-surface-variant">Loading...</p>
          </div>
        </div>
      );
    }

    // Redirect to sign-in if not authenticated
    if (!isSignedIn) {
      return <Navigate to="/sign-in" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    // If Clerk hooks fail, fall back to development mode
    console.warn('⚠️ Clerk authentication failed - falling back to development mode:', error);
    return <>{children}</>;
  }
}

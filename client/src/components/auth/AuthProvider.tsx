import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

interface AuthProviderProps {
  children: React.ReactNode;
}

// Development fallback component when Clerk is not configured
function DevAuthProvider({ children }: AuthProviderProps) {
  console.warn('⚠️ Clerk not configured - using development mode without authentication');
  return <>{children}</>;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // If no publishable key is provided, use development fallback
  if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.trim() === '') {
    console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY - running in development mode');
    return <DevAuthProvider>{children}</DevAuthProvider>;
  }

  // Validate the key format
  if (!PUBLISHABLE_KEY.startsWith('pk_test_') && !PUBLISHABLE_KEY.startsWith('pk_live_')) {
    console.error('Invalid Clerk publishable key format:', PUBLISHABLE_KEY);
    return <DevAuthProvider>{children}</DevAuthProvider>;
  }

  // Only initialize Clerk if we have a valid key
  try {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        {children}
      </ClerkProvider>
    );
  } catch (error) {
    console.error('Failed to initialize Clerk:', error);
    return <DevAuthProvider>{children}</DevAuthProvider>;
  }
}

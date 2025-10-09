import React from 'react';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from '../../lib/stack';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  console.log('🔐 Initializing Stack Auth (Neon Auth)');
  
  return (
    <StackProvider app={stackClientApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </StackProvider>
  );
}

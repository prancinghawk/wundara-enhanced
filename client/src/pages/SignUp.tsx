import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Card } from '../ui/components/cards/Card';
import WundaraLogo from '../assets/wundara-logo.png';

export default function SignUp() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={WundaraLogo} alt="Wundara" className="h-12" />
          </div>
          <h1 className="text-display-small mb-2">Create Account</h1>
          <p className="text-body-large text-on-surface-variant">
            Create your account to start building personalized learning experiences that celebrate neurodiversity.
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <Card className="p-6">
          <ClerkSignUp 
            routing="path" 
            path="/sign-up" 
            signInUrl="/sign-in"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg',
                card: 'shadow-none border-0 bg-transparent',
                headerTitle: 'text-title-large',
                headerSubtitle: 'text-body-medium text-on-surface-variant',
                socialButtonsBlockButton: 'border border-outline hover:bg-surface-container-low',
                formFieldInput: 'border border-outline focus:border-primary',
                footerActionLink: 'text-primary hover:text-primary/80',
                formFieldHintText: 'hidden'
              }
            }}
          />
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-body-small text-on-surface-variant">
            Already have an account?{' '}
            <a href="/sign-in" className="text-primary hover:text-primary/80">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

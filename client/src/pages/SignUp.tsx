import React from 'react';
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <ClerkSignUp routing="path" path="/sign-up" />
    </div>
  );
}

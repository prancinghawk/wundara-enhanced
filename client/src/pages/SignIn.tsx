import React from 'react';
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <ClerkSignIn routing="path" path="/sign-in" />
    </div>
  );
}

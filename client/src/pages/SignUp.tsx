import React from 'react';
import { SignUp as StackSignUp } from "@stackframe/stack";
import { stackClientApp } from "../lib/stack";

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md">
        <StackSignUp app={stackClientApp} />
      </div>
    </div>
  );
}

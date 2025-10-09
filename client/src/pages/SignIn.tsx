import React from 'react';
import { SignIn as StackSignIn } from "@stackframe/stack";
import { stackClientApp } from "../lib/stack";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md">
        <StackSignIn app={stackClientApp} />
      </div>
    </div>
  );
}

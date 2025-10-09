import React, { useEffect } from 'react';

export default function SignUp() {
  useEffect(() => {
    // Redirect to Stack Auth's hosted sign-up page
    window.location.href = 'https://app.stack-auth.com/handler/sign-up?project_id=ddb5065b-a008-4f51-b576-0cbced7f83c2';
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md">
        <p className="text-center">Redirecting to sign up...</p>
      </div>
    </div>
  );
}

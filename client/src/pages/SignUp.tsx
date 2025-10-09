import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to Stack Auth's hosted sign-up page
    window.location.href = '/handler/sign-up';
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md">
        <p className="text-center">Redirecting to sign up...</p>
      </div>
    </div>
  );
}

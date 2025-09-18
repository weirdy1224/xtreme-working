import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const { authUser, isEmailVerified, isCheckingAuth, hasAttemptedAuth } = useAuthStore();

  // Show loading while checking authentication
  if (isCheckingAuth && !hasAttemptedAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to verify email if email is not verified
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;

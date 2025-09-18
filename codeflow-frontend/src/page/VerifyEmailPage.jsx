import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Code, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verificationStatus, verify } = useAuthStore();
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    if (token && !hasVerified) {
      console.log('Starting verification with token:', token);
      setHasVerified(true);
      verify(token);
    }
  }, [token]);

  useEffect(() => {
    if (verificationStatus === 'success') {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [verificationStatus, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Verifying Your Email</h1>
            <p className="text-base-content/60">
              Please wait while we verify your email address...
            </p>
          </>
        );

      case 'success':
        return (
          <>
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-success">
              Email Verified!
            </h1>
            <p className="text-base-content/60 mb-6">
              Your email has been successfully verified. You will be redirected
              to the login page in 3 seconds.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
            >
              Go to Login Now
            </button>
          </>
        );

      case 'error':
        return (
          <>
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8 text-error" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-error">
              Verification Failed
            </h1>
            <p className="text-base-content/60 mb-6">
              The verification link is invalid or has expired. Please try
              signing up again.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/signup')}
                className="btn btn-primary"
              >
                Sign Up Again
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-outline"
              >
                Back to Login
              </button>
            </div>
          </>
        );

      case 'pending':
      default:
        return (
          <>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Code className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
            <p className="text-base-content/60 mb-6">
              We've sent a verification link to your email address. Please check
              your email and click the link to verify your account.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary w-full"
              >
                I've verified my email
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-outline w-full"
              >
                Back to Login
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-base-100">
      <div className="w-full max-w-md">
        <div className="text-center space-y-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;


import React from 'react';
import { Route } from 'react-router-dom';

// Page imports
const AuthPage = React.lazy(() => import("@/pages/AuthPage"));
const AuthCallbackPage = React.lazy(() => import("@/pages/AuthCallbackPage"));
const ForgotPasswordPage = React.lazy(() => import("@/pages/ForgotPasswordPage"));
const VerifyEmailPage = React.lazy(() => import("@/pages/VerifyEmailPage"));

export const AuthRoutes = () => {
  return (
    <>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
    </>
  );
};

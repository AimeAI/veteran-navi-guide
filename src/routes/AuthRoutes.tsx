
import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded components
const AuthPage = lazy(() => import("../pages/AuthPage"));
const AuthCallbackPage = lazy(() => import("../pages/AuthCallbackPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const VerifyEmailPage = lazy(() => import("../pages/VerifyEmailPage"));

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="callback" element={<AuthCallbackPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="verify-email" element={<VerifyEmailPage />} />
    </Routes>
  );
};

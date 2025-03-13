
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy-loaded components
const SavedJobs = lazy(() => import("../pages/SavedJobs"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const ApplicationsPage = lazy(() => import("../pages/ApplicationsPage"));
const RecommendedJobs = lazy(() => import("../pages/RecommendedJobs"));
const MessagesPage = lazy(() => import("../pages/MessagesPage"));
const VeteranDashboardPage = lazy(() => import("../pages/VeteranDashboardPage"));
const ReferralProgramPage = lazy(() => import("../pages/ReferralProgramPage"));
const NotificationPreferences = lazy(() => import("../components/NotificationPreferences"));
const FeedbackSupportPage = lazy(() => import("../pages/FeedbackSupportPage"));
const JobAlertsPage = lazy(() => import("../pages/JobAlertsPage"));

export const UserRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        {/* Main user dashboard route */}
        <Route path="/" element={<VeteranDashboardPage />} />
        
        {/* Profile routes with tabs */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/resume" element={<UserProfile />} />
        <Route path="/profile/resume-parser" element={<UserProfile />} />
        <Route path="/profile/applications" element={<UserProfile />} />
        <Route path="/profile/settings" element={<UserProfile />} />
        
        {/* Standalone pages */}
        <Route path="/saved" element={<SavedJobs />} />
        <Route path="/history" element={<ApplicationsPage />} />
        <Route path="/recommended" element={<RecommendedJobs />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/dashboard" element={<VeteranDashboardPage />} />
        <Route path="/job-alerts" element={<JobAlertsPage />} />
        <Route path="/settings/notifications" element={<NotificationPreferences />} />
        <Route path="/feedback" element={<FeedbackSupportPage />} />
        <Route path="/referral-program" element={<ReferralProgramPage />} />
        
        {/* Handle old routes for backward compatibility */}
        <Route path="profile" element={<Navigate to="/user/profile" replace />} />
        <Route path="profile/resume" element={<Navigate to="/user/profile/resume" replace />} />
        <Route path="profile/resume-parser" element={<Navigate to="/user/profile/resume-parser" replace />} />
        <Route path="profile/applications" element={<Navigate to="/user/profile/applications" replace />} />
        <Route path="profile/settings" element={<Navigate to="/user/profile/settings" replace />} />
      </Routes>
    </Suspense>
  );
};

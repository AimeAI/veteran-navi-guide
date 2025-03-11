
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "../components/RequireAuth";
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
        <Route path="/" element={<RequireAuth><VeteranDashboardPage /></RequireAuth>} />
        
        {/* Profile routes with tabs */}
        <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="/profile/resume" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="/profile/resume-parser" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="/profile/applications" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="/profile/settings" element={<RequireAuth><UserProfile /></RequireAuth>} />
        
        {/* Standalone pages */}
        <Route path="/saved" element={<RequireAuth><SavedJobs /></RequireAuth>} />
        <Route path="/history" element={<RequireAuth><ApplicationsPage /></RequireAuth>} />
        <Route path="/recommended" element={<RequireAuth><RecommendedJobs /></RequireAuth>} />
        <Route path="/messages" element={<RequireAuth><MessagesPage /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><VeteranDashboardPage /></RequireAuth>} />
        <Route path="/job-alerts" element={<RequireAuth><JobAlertsPage /></RequireAuth>} />
        <Route path="/settings/notifications" element={<RequireAuth><NotificationPreferences /></RequireAuth>} />
        <Route path="/feedback" element={<RequireAuth><FeedbackSupportPage /></RequireAuth>} />
        <Route path="/referral-program" element={<RequireAuth><ReferralProgramPage /></RequireAuth>} />
        
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

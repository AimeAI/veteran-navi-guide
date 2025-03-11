
import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "../components/RequireAuth";

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

export const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="saved" element={<RequireAuth><SavedJobs /></RequireAuth>} />
      <Route path="profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
      <Route path="profile/settings" element={<RequireAuth><UserProfile /></RequireAuth>} />
      <Route path="profile/resume" element={<RequireAuth><UserProfile /></RequireAuth>} />
      <Route path="history" element={<RequireAuth><ApplicationsPage /></RequireAuth>} />
      <Route path="recommendations" element={<RequireAuth><RecommendedJobs /></RequireAuth>} />
      <Route path="messages" element={<RequireAuth><MessagesPage /></RequireAuth>} />
      <Route path="dashboard" element={<RequireAuth><VeteranDashboardPage /></RequireAuth>} />
      <Route path="job-alerts" element={<RequireAuth><UserProfile /></RequireAuth>} />
      <Route path="recommended" element={<RequireAuth><RecommendedJobs /></RequireAuth>} />
      <Route path="settings/notifications" element={<RequireAuth><NotificationPreferences /></RequireAuth>} />
      <Route path="feedback" element={<RequireAuth><FeedbackSupportPage /></RequireAuth>} />
      <Route path="referral-program" element={<RequireAuth><ReferralProgramPage /></RequireAuth>} />
    </Routes>
  );
};

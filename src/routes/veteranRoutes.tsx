
import React from 'react';
import { Route } from 'react-router-dom';
import { RequireAuth } from '@/components/RequireAuth';

// Page imports
const VeteranDashboardPage = React.lazy(() => import("@/pages/VeteranDashboardPage"));
const JobSearch = React.lazy(() => import("@/pages/JobSearch"));
const JobDetailsPage = React.lazy(() => import("@/pages/JobDetailsPage"));
const SavedJobs = React.lazy(() => import("@/pages/SavedJobs"));
const UserProfile = React.lazy(() => import("@/pages/UserProfile"));
const ApplicationsPage = React.lazy(() => import("@/pages/ApplicationsPage"));
const RecommendedJobs = React.lazy(() => import("@/pages/RecommendedJobs"));
const MessagesPage = React.lazy(() => import("@/pages/MessagesPage"));
const NotificationPreferences = React.lazy(() => import("@/components/NotificationPreferences"));
const FeedbackSupportPage = React.lazy(() => import("@/pages/FeedbackSupportPage"));
const ReferralProgramPage = React.lazy(() => import("@/pages/ReferralProgramPage"));
const VettedJobsPage = React.lazy(() => import("@/pages/VettedJobsPage"));
const IntegrationsPage = React.lazy(() => import("@/pages/IntegrationsPage"));

export const VeteranRoutes = () => {
  return (
    <>
      <Route path="/job-search" element={<JobSearch />} />
      <Route path="/jobs/search" element={<JobSearch />} />
      <Route path="/saved" element={
        <RequireAuth>
          <SavedJobs />
        </RequireAuth>
      } />
      <Route path="/job/:id" element={<JobDetailsPage />} />
      <Route path="/profile" element={
        <RequireAuth>
          <UserProfile />
        </RequireAuth>
      } />
      <Route path="/history" element={
        <RequireAuth>
          <ApplicationsPage />
        </RequireAuth>
      } />
      <Route path="/recommendations" element={
        <RequireAuth>
          <RecommendedJobs />
        </RequireAuth>
      } />
      <Route path="/messages" element={
        <RequireAuth>
          <MessagesPage />
        </RequireAuth>
      } />
      <Route path="/dashboard" element={
        <RequireAuth>
          <VeteranDashboardPage />
        </RequireAuth>
      } />
      <Route path="/profile/settings" element={
        <RequireAuth>
          <UserProfile />
        </RequireAuth>
      } />
      <Route path="/profile/resume" element={
        <RequireAuth>
          <UserProfile />
        </RequireAuth>
      } />
      <Route path="/job-alerts" element={
        <RequireAuth>
          <UserProfile />
        </RequireAuth>
      } />
      <Route path="/recommended" element={
        <RequireAuth>
          <RecommendedJobs />
        </RequireAuth>
      } />
      <Route path="/vetted-jobs" element={<VettedJobsPage />} />
      <Route
        path="/settings/notifications"
        element={
          <RequireAuth>
            <NotificationPreferences />
          </RequireAuth>
        }
      />
      <Route
        path="/feedback"
        element={
          <RequireAuth>
            <FeedbackSupportPage />
          </RequireAuth>
        }
      />
      <Route
        path="/referral-program"
        element={
          <RequireAuth>
            <ReferralProgramPage />
          </RequireAuth>
        }
      />
      <Route
        path="/integrations"
        element={
          <RequireAuth>
            <IntegrationsPage />
          </RequireAuth>
        }
      />
    </>
  );
};

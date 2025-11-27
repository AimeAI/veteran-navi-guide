
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import DevRouteWrapper from "../components/DevRouteWrapper";

// Lazy-loaded components from GeneralRoutes
const Index = lazy(() => import("../pages/Index"));
const JobDetailsPage = lazy(() => import("../pages/JobDetailsPage"));
const VettedJobsPage = lazy(() => import("../pages/VettedJobsPage"));
const JobFairsEventsPage = lazy(() => import("../pages/JobFairsEventsPage"));
const CommunityForums = lazy(() => import("../pages/CommunityForums"));
const TopicDetail = lazy(() => import("../pages/TopicDetail"));
const AbTestingPage = lazy(() => import("../pages/AbTestingPage"));
const NotFound = lazy(() => import("../pages/NotFound"));
const AllRoutes = lazy(() => import("../pages/AllRoutes"));
const DefenseJobsPage = lazy(() => import("../pages/DefenseJobsPage"));
const MilitaryTranslatorPage = lazy(() => import("../pages/MilitaryTranslatorPage"));
const ActiveJobsPage = lazy(() => import("../pages/ActiveJobsPage"));
const UnderConstruction = lazy(() => import("../pages/UnderConstruction"));

// Import route components
import { AuthRoutes } from "./AuthRoutes";
import { UserRoutes } from "./UserRoutes";
import { EmployerRoutes } from "./EmployerRoutes";
import { ResourceRoutes } from "./ResourceRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { RequireAuth } from "@/components/RequireAuth";

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        {/* Development Routes - No auth required */}
        <Route path="/routes" element={<DevRouteWrapper><AllRoutes /></DevRouteWrapper>} />
        <Route path="/ab-testing" element={<DevRouteWrapper><AbTestingPage /></DevRouteWrapper>} />
        <Route path="/dev/*" element={<DevRouteWrapper><AllRoutes /></DevRouteWrapper>} />

        {/* General Routes */}
        <Route path="/" element={<DefenseJobsPage />} />
        <Route path="/defense-jobs" element={<DefenseJobsPage />} />
        <Route path="/military-translator" element={<MilitaryTranslatorPage />} />
        <Route path="/jobs" element={<ActiveJobsPage />} />
        <Route path="/job-search" element={<ActiveJobsPage />} />
        <Route path="/jobs/search" element={<UnderConstruction />} />
        <Route path="/job-board" element={<UnderConstruction />} />
        <Route path="/job/:id" element={<UnderConstruction />} />
        <Route path="/vetted-jobs" element={<UnderConstruction />} />
        <Route path="/events" element={<JobFairsEventsPage />} />
        <Route path="/resources/forums" element={<UnderConstruction />} />
        <Route path="/topic/:topicId" element={<UnderConstruction />} />
        
        {/* Nested Routes */}
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/employer/*" element={<EmployerRoutes />} />
        <Route path="/resources/*" element={<ResourceRoutes />} />

        {/* Admin Routes - Protected by role-based auth */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth roles={['admin']}>
              <AdminRoutes />
            </RequireAuth>
          }
        />
        
        {/* Direct profile routes for backward compatibility */}
        <Route path="/profile" element={<Navigate to="/user/profile" replace />} />
        <Route path="/profile/resume" element={<Navigate to="/user/profile/resume" replace />} />
        <Route path="/profile/resume-parser" element={<Navigate to="/user/profile/resume-parser" replace />} />
        <Route path="/profile/applications" element={<Navigate to="/user/profile/applications" replace />} />
        <Route path="/profile/settings" element={<Navigate to="/user/profile/settings" replace />} />
        <Route path="/saved" element={<Navigate to="/user/saved" replace />} />
        <Route path="/history" element={<Navigate to="/user/history" replace />} />
        <Route path="/recommended" element={<Navigate to="/user/recommended" replace />} />
        <Route path="/messages" element={<Navigate to="/user/messages" replace />} />
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/settings/notifications" element={<Navigate to="/user/settings/notifications" replace />} />
        <Route path="/job-alerts" element={<Navigate to="/user/job-alerts" replace />} />
        <Route path="/feedback" element={<Navigate to="/user/feedback" replace />} />
        <Route path="/referral-program" element={<Navigate to="/user/referral-program" replace />} />
        
        {/* 404 catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;


import React from "react";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import JobSearch from "../pages/JobSearch";
import JobBoardPage from "../pages/JobBoardPage";

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

// Import route components as named exports
import { AuthRoutes } from "./AuthRoutes";
import { UserRoutes } from "./UserRoutes";
import { EmployerRoutes } from "./EmployerRoutes";
import { ResourceRoutes } from "./ResourceRoutes";
import { AdminRoutes } from "./AdminRoutes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* General Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/job-search" element={<JobSearch />} />
      <Route path="/jobs/search" element={<JobSearch />} />
      <Route path="/job-board" element={<JobBoardPage />} />
      <Route path="/job/:id" element={<JobDetailsPage />} />
      <Route path="/vetted-jobs" element={<VettedJobsPage />} />
      <Route path="/events" element={<JobFairsEventsPage />} />
      <Route path="/resources/forums" element={<CommunityForums />} />
      <Route path="/topic/:topicId" element={<TopicDetail />} />
      <Route path="/ab-testing" element={<AbTestingPage />} />
      <Route path="/routes" element={<AllRoutes />} />
      
      {/* Nested Routes */}
      <Route path="auth/*" element={<Suspense fallback={<div>Loading...</div>}><AuthRoutes /></Suspense>} />
      <Route path="user/*" element={<Suspense fallback={<div>Loading...</div>}><UserRoutes /></Suspense>} />
      <Route path="employer/*" element={<Suspense fallback={<div>Loading...</div>}><EmployerRoutes /></Suspense>} />
      <Route path="resources/*" element={<Suspense fallback={<div>Loading...</div>}><ResourceRoutes /></Suspense>} />
      <Route path="admin/*" element={<Suspense fallback={<div>Loading...</div>}><AdminRoutes /></Suspense>} />
      
      {/* 404 catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;


import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded components
const CareerCounseling = lazy(() => import("../pages/CareerCounseling"));
const ResumeAssistance = lazy(() => import("../pages/ResumeAssistance"));
const InterviewPreparation = lazy(() => import("../pages/InterviewPreparation"));
const MilitaryTransitionResources = lazy(() => import("../pages/MilitaryTransitionResources"));

export const ResourceRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/career-counseling" element={<CareerCounseling />} />
      <Route path="/resume-assistance" element={<ResumeAssistance />} />
      <Route path="/interview-prep" element={<InterviewPreparation />} />
      <Route path="/military-transition" element={<MilitaryTransitionResources />} />
    </Routes>
  );
};

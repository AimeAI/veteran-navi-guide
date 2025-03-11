
import React, { lazy } from "react";
import { Route } from "react-router-dom";

// Lazy-loaded components
const CareerCounseling = lazy(() => import("../pages/CareerCounseling"));
const ResumeAssistance = lazy(() => import("../pages/ResumeAssistance"));
const InterviewPreparation = lazy(() => import("../pages/InterviewPreparation"));
const MilitaryTransitionResources = lazy(() => import("../pages/MilitaryTransitionResources"));

export const ResourceRoutes = () => {
  return (
    <>
      <Route path="/resources/career-counseling" element={<CareerCounseling />} />
      <Route path="/resources/resume-assistance" element={<ResumeAssistance />} />
      <Route path="/resources/interview-prep" element={<InterviewPreparation />} />
      <Route path="/resources/military-transition" element={<MilitaryTransitionResources />} />
    </>
  );
};


import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RequireEmployerAuth from "../components/RequireEmployerAuth";

// Lazy-loaded components
const PostJobPage = lazy(() => import("../pages/PostJobPage"));
const EmployerDashboardPage = lazy(() => import("../pages/EmployerDashboardPage"));
const EmployerProfilePage = lazy(() => import("../pages/EmployerProfilePage"));
const EmployerSearchVeteransPage = lazy(() => import("../pages/EmployerSearchVeteransPage"));
const EmployerApplicationsPage = lazy(() => import("../pages/EmployerApplicationsPage"));
const MessagesPage = lazy(() => import("../pages/MessagesPage"));

export const EmployerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="post-job" 
        element={<RequireEmployerAuth><PostJobPage /></RequireEmployerAuth>}
      />
      <Route 
        path="manage-applications" 
        element={<RequireEmployerAuth><EmployerApplicationsPage /></RequireEmployerAuth>}
      />
      <Route 
        path="profile" 
        element={<RequireEmployerAuth><EmployerProfilePage /></RequireEmployerAuth>}
      />
      <Route 
        path="search-veterans" 
        element={<RequireEmployerAuth><EmployerSearchVeteransPage /></RequireEmployerAuth>}
      />
      <Route 
        path="employer-profile" 
        element={<RequireEmployerAuth><EmployerProfilePage /></RequireEmployerAuth>}
      />
      <Route 
        path="messages" 
        element={<RequireEmployerAuth><MessagesPage /></RequireEmployerAuth>}
      />
    </Routes>
  );
};


import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "../components/RequireAuth";

// Lazy-loaded components
const PostJobPage = lazy(() => import("../pages/PostJobPage"));
const EmployerDashboardPage = lazy(() => import("../pages/EmployerDashboardPage"));
const EmployerProfilePage = lazy(() => import("../pages/EmployerProfilePage"));
const EmployerSearchVeteransPage = lazy(() => import("../pages/EmployerSearchVeteransPage"));

export const EmployerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="post-job" 
        element={<RequireAuth roles={["employer", "admin"]}><PostJobPage /></RequireAuth>} 
      />
      <Route 
        path="manage-applications" 
        element={<RequireAuth roles={["employer", "admin"]}><EmployerDashboardPage /></RequireAuth>} 
      />
      <Route 
        path="profile" 
        element={<RequireAuth roles={["employer", "admin"]}><EmployerProfilePage /></RequireAuth>} 
      />
      <Route 
        path="search-veterans" 
        element={<RequireAuth roles={["employer", "admin"]}><EmployerSearchVeteransPage /></RequireAuth>} 
      />
      <Route 
        path="employer-profile" 
        element={<RequireAuth roles={["employer", "admin"]}><EmployerProfilePage /></RequireAuth>} 
      />
    </Routes>
  );
};

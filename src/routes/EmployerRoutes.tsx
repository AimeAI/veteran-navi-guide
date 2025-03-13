
import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

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
        element={<PostJobPage />}  // Removed RequireAuth wrapper
      />
      <Route 
        path="manage-applications" 
        element={<EmployerDashboardPage />}  // Removed RequireAuth wrapper
      />
      <Route 
        path="profile" 
        element={<EmployerProfilePage />}  // Removed RequireAuth wrapper
      />
      <Route 
        path="search-veterans" 
        element={<EmployerSearchVeteransPage />}  // Removed RequireAuth wrapper
      />
      <Route 
        path="employer-profile" 
        element={<EmployerProfilePage />}  // Removed RequireAuth wrapper
      />
    </Routes>
  );
};

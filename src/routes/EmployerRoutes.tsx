
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
        element={<PostJobPage />}
      />
      <Route 
        path="manage-applications" 
        element={<EmployerDashboardPage />}
      />
      <Route 
        path="profile" 
        element={<EmployerProfilePage />}
      />
      <Route 
        path="search-veterans" 
        element={<EmployerSearchVeteransPage />}
      />
      <Route 
        path="employer-profile" 
        element={<EmployerProfilePage />}
      />
    </Routes>
  );
};

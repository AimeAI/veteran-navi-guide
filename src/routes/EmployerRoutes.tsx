
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { RequireAuth } from "../components/RequireAuth";

// Lazy-loaded components
const PostJobPage = lazy(() => import("../pages/PostJobPage"));
const EmployerDashboardPage = lazy(() => import("../pages/EmployerDashboardPage"));
const EmployerProfilePage = lazy(() => import("../pages/EmployerProfilePage"));
const EmployerSearchVeteransPage = lazy(() => import("../pages/EmployerSearchVeteransPage"));

export const EmployerRoutes = () => {
  return (
    <>
      <Route 
        path="/employer/post-job" 
        element={<RequireAuth roles={["employer", "admin"]}><PostJobPage /></RequireAuth>} 
      />
      <Route 
        path="/employer/manage-applications" 
        element={<RequireAuth roles={["employer", "admin"]}><EmployerDashboardPage /></RequireAuth>} 
      />
      <Route 
        path="/employer/profile" 
        element={<RequireAuth roles={["employer", "admin"]}><EmployerProfilePage /></RequireAuth>} 
      />
      <Route 
        path="/employer/search-veterans" 
        element={<RequireAuth roles={["employer", "admin"]}><EmployerSearchVeteransPage /></RequireAuth>} 
      />
      <Route 
        path="/employer-profile" 
        element={<RequireAuth roles={["employer", "admin"]}><EmployerProfilePage /></RequireAuth>} 
      />
    </>
  );
};

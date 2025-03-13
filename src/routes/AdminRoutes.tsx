
import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "../components/RequireAuth";

// Lazy-loaded components
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"));
const AdminContentPage = lazy(() => import("../pages/AdminContentPage"));

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={<AdminDashboardPage />}  // Removed RequireAuth wrapper
      />
      <Route 
        path="content" 
        element={<AdminContentPage />}  // Removed RequireAuth wrapper
      />
    </Routes>
  );
};

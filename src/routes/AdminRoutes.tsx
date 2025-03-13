
import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded components
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"));
const AdminContentPage = lazy(() => import("../pages/AdminContentPage"));

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={<AdminDashboardPage />}
      />
      <Route 
        path="content" 
        element={<AdminContentPage />}
      />
    </Routes>
  );
};

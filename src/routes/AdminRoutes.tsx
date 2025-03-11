
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { RequireAuth } from "../components/RequireAuth";

// Lazy-loaded components
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"));
const AdminContentPage = lazy(() => import("../pages/AdminContentPage"));

export const AdminRoutes = () => {
  return (
    <>
      <Route 
        path="/admin" 
        element={<RequireAuth roles={["admin"]}><AdminDashboardPage /></RequireAuth>} 
      />
      <Route 
        path="/admin/content" 
        element={<RequireAuth roles={["admin"]}><AdminContentPage /></RequireAuth>} 
      />
    </>
  );
};

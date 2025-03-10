
import React from 'react';
import { Route } from 'react-router-dom';
import { RequireAuth } from '@/components/RequireAuth';

// Page imports
const AdminDashboardPage = React.lazy(() => import("@/pages/AdminDashboardPage"));
const AdminContentPage = React.lazy(() => import("@/pages/AdminContentPage"));

export const AdminRoutes = () => {
  return (
    <>
      <Route path="/admin" element={
        <RequireAuth roles={["admin"]}>
          <AdminDashboardPage />
        </RequireAuth>
      } />
      <Route path="/admin/content" element={
        <RequireAuth roles={["admin"]}>
          <AdminContentPage />
        </RequireAuth>
      } />
    </>
  );
};


import React from 'react';
import { Route } from 'react-router-dom';
import { RequireAuth } from '@/components/RequireAuth';

// Page imports
const PostJobPage = React.lazy(() => import("@/pages/PostJobPage"));
const EmployerDashboardPage = React.lazy(() => import("@/pages/EmployerDashboardPage"));
const EmployerProfilePage = React.lazy(() => import("@/pages/EmployerProfilePage"));
const EmployerSearchVeteransPage = React.lazy(() => import("@/pages/EmployerSearchVeteransPage"));

export const EmployerRoutes = () => {
  return (
    <>
      <Route path="/employer/post-job" element={
        <RequireAuth roles={["employer", "admin"]}>
          <PostJobPage />
        </RequireAuth>
      } />
      <Route path="/employer/manage-applications" element={
        <RequireAuth roles={["employer", "admin"]}>
          <EmployerDashboardPage />
        </RequireAuth>
      } />
      <Route path="/employer/profile" element={
        <RequireAuth roles={["employer", "admin"]}>
          <EmployerProfilePage />
        </RequireAuth>
      } />
      <Route path="/employer/search-veterans" element={
        <RequireAuth roles={["employer", "admin"]}>
          <EmployerSearchVeteransPage />
        </RequireAuth>
      } />
      <Route path="/employer-profile" element={
        <RequireAuth roles={["employer", "admin"]}>
          <EmployerProfilePage />
        </RequireAuth>
      } />
    </>
  );
};

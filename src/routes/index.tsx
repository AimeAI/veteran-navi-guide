
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthRoutes } from './authRoutes';
import { veteranRoutes } from './veteranRoutes';
import { EmployerRoutes } from './employerRoutes';
import { ResourceRoutes } from './resourceRoutes';
import { AdminRoutes } from './adminRoutes';
import Layout from '@/components/layout/Layout';

// Page imports
const Index = React.lazy(() => import("@/pages/Index"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        
        {/* Auth Routes */}
        <AuthRoutes />
        
        {/* Veteran Routes */}
        <Route path="dashboard">
          {veteranRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
        
        {/* Employer Routes */}
        <EmployerRoutes />
        
        {/* Resource Routes */}
        <ResourceRoutes />
        
        {/* Admin Routes */}
        <AdminRoutes />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};


import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthRoutes } from './authRoutes';
import { VeteranRoutes } from './veteranRoutes';
import { EmployerRoutes } from './employerRoutes';
import { ResourceRoutes } from './resourceRoutes';
import { AdminRoutes } from './adminRoutes';

// Page imports
const Index = React.lazy(() => import("@/pages/Index"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Auth Routes */}
      <AuthRoutes />
      
      {/* Veteran Routes */}
      <VeteranRoutes />
      
      {/* Employer Routes */}
      <EmployerRoutes />
      
      {/* Resource Routes */}
      <ResourceRoutes />
      
      {/* Admin Routes */}
      <AdminRoutes />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

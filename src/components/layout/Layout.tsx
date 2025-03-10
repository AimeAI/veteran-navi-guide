
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layout components
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import SecurityMonitor from '@/components/security/SecurityMonitor';
import PageFooter from '@/components/layout/PageFooter';

// Loading component for suspense fallback
const PageLoading = () => (
  <div className="flex justify-center items-center h-[70vh]">
    <LoadingSpinner size="lg" />
  </div>
);

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 pt-4">
          <EmailVerificationBanner />
        </div>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <PageFooter />
      <Toaster position="top-right" />
      <SecurityMonitor />
    </div>
  );
};

export default Layout;

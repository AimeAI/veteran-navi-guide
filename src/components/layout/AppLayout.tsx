
import React, { Suspense, ReactNode } from "react";
import Navbar from "./Navbar";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Toaster } from "../ui/sonner";
import EmailVerificationBanner from "../EmailVerificationBanner";
import SecurityMonitor from "../security/SecurityMonitor";

interface AppLayoutProps {
  children: ReactNode;
}

// Loading component for suspense fallback
const PageLoading = () => (
  <div className="flex justify-center items-center h-[70vh]">
    <LoadingSpinner size="lg" />
  </div>
);

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 pt-4">
          <EmailVerificationBanner />
        </div>
        <Suspense fallback={<PageLoading />}>
          {children}
        </Suspense>
      </main>
      <Toaster position="top-right" />
      <SecurityMonitor />
    </div>
  );
};

export default AppLayout;

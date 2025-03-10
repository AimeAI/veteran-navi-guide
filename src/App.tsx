
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layout components
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import SecurityMonitor from '@/components/security/SecurityMonitor';
import { MessageProvider } from '@/context/MessageContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AppProvider } from '@/context/AppContext';
import { AppRoutes } from '@/routes';

// Loading component for suspense fallback
const PageLoading = () => (
  <div className="flex justify-center items-center h-[70vh]">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <MessageProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow pt-16">
                <div className="container mx-auto px-4 pt-4">
                  <EmailVerificationBanner />
                </div>
                <Suspense fallback={<PageLoading />}>
                  <AppRoutes />
                </Suspense>
              </main>
              <Toaster position="top-right" />
              <SecurityMonitor />
            </div>
          </Router>
        </MessageProvider>
      </LanguageProvider>
    </AppProvider>
  );
}

export default App;

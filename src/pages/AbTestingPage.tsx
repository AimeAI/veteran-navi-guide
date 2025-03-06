
import React from 'react';
import AbTestingDashboard from '@/components/abTesting/AbTestingDashboard';
import { FlaskConical } from 'lucide-react';
import Navbar from '@/components/Navbar';

const AbTestingPage = () => {
  // In a real implementation, this would come from auth context
  const employerId = 'emp1';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8" id="main-content">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <FlaskConical className="h-6 w-6 text-primary mr-3" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-gray-900">A/B Testing</h1>
          </div>
          
          <section 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8"
            aria-labelledby="ab-testing-heading"
          >
            <div className="mb-6">
              <h2 id="ab-testing-heading" className="text-lg font-semibold text-gray-900 mb-2">Optimize Your Job Listings</h2>
              <p className="text-gray-600">
                Create and test different versions of your job listings to see which performs best.
                Compare conversion rates and make data-driven decisions to attract more qualified veterans.
              </p>
            </div>
            
            <AbTestingDashboard employerId={employerId} />
          </section>
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto" role="contentinfo">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 VeteranJobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AbTestingPage;


import React, { useState } from 'react';
import PostJobForm from '@/components/PostJobForm';
import AbTestingDashboard from '@/components/abTesting/AbTestingDashboard';
import { Briefcase, FlaskConical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PostJobPage = () => {
  const [activeTab, setActiveTab] = useState('post');
  const employerId = 'emp1'; // In a real app, this would come from auth context

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Briefcase className="h-6 w-6 text-primary mr-3" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === 'post' ? 'Post a Job' : 'Optimize Your Job Listings'}
            </h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="post" className="flex-1">
                <Briefcase className="h-4 w-4 mr-2" />
                Post a Job
              </TabsTrigger>
              <TabsTrigger value="ab-testing" className="flex-1">
                <FlaskConical className="h-4 w-4 mr-2" />
                A/B Testing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="post">
              <section 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8"
                aria-labelledby="post-job-heading"
              >
                <div className="mb-6">
                  <h2 id="post-job-heading" className="text-lg font-semibold text-gray-900 mb-2">Connect with Veteran Talent</h2>
                  <p className="text-gray-600">
                    Create a job listing that showcases your opportunity to our community of skilled veterans. 
                    Be specific about how military experience relates to the role.
                  </p>
                </div>
                
                <PostJobForm />
              </section>
            </TabsContent>
            
            <TabsContent value="ab-testing">
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
            </TabsContent>
          </Tabs>
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

export default PostJobPage;

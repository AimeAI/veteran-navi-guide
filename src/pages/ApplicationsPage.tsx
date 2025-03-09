
import React, { useState } from 'react';
import ApplicationHistory from '@/components/ApplicationHistory';
import { FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequireAuth } from '@/components/RequireAuth';

const ApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { refreshApplications } = useApplications();

  const handleRefresh = () => {
    refreshApplications();
  };

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
        <main className="flex-grow container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-primary mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="self-start sm:self-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="mb-8">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 text-sm flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>
                  Track all your job applications in one place. We'll update the status as recruiters review your application.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6 w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <ApplicationHistory />
                </TabsContent>
                
                <TabsContent value="active">
                  <p className="text-sm text-muted-foreground mb-4">
                    Applications that are pending, under review, or in the interview process
                  </p>
                  <ApplicationHistory />
                </TabsContent>
                
                <TabsContent value="completed">
                  <p className="text-sm text-muted-foreground mb-4">
                    Applications where you've been hired, received an offer, or were not selected
                  </p>
                  <ApplicationHistory />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500 text-sm">
              <p>© 2023 VeteranJobBoard. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </RequireAuth>
  );
};

export default ApplicationsPage;

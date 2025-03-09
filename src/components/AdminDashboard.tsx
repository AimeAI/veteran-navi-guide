// Import necessary components and hooks
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserManagement from './admin/UserManagement';
import JobModeration from './admin/JobModeration';
import WebsiteContentManagement from './admin/WebsiteContentManagement';
import EventsManagement from './admin/EventsManagement';
import FeedbackManagement from './admin/FeedbackManagement';
import ForumModeration from './admin/ForumModeration';
import ResourcesManagement from './admin/ResourcesManagement';
import AbTestingDashboard from './admin/AbTestingDashboard';

// Import the ReviewModeration component
import ReviewModeration from './admin/ReviewModeration';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-8">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="jobs">
          <JobModeration />
        </TabsContent>
        
        <TabsContent value="reviews">
          <ReviewModeration />
        </TabsContent>
        
        <TabsContent value="content">
          <WebsiteContentManagement />
        </TabsContent>
        
        <TabsContent value="events">
          <EventsManagement />
        </TabsContent>
        
        <TabsContent value="feedback">
          <FeedbackManagement />
        </TabsContent>
        
        <TabsContent value="forum">
          <ForumModeration />
        </TabsContent>
        
        <TabsContent value="resources">
          <ResourcesManagement />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AbTestingDashboard />
            <Card>
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Platform-wide metrics dashboard coming soon.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

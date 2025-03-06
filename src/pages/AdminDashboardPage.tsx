
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/admin/UserManagement';
import JobModeration from '@/components/admin/JobModeration';
import ForumModeration from '@/components/admin/ForumModeration';
import ReviewModeration from '@/components/admin/ReviewModeration'; // Add new import
import { Shield } from 'lucide-react';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  return (
    <div className="container py-10 max-w-7xl">
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="forums">Forum Posts</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="jobs">
          <JobModeration />
        </TabsContent>
        
        <TabsContent value="forums">
          <ForumModeration />
        </TabsContent>
        
        <TabsContent value="reviews">
          <ReviewModeration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
